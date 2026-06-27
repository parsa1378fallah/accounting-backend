import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JournalEntryLine } from '@prisma/client';

/* ============================================================================
 * JOURNAL BALANCE VALIDATOR — ENTERPRISE EDITION
 * ============================================================================
 *
 * مسئولیت این فایل:
 *   فقط و فقط اعتبارسنجی "تراز بودن" یک سند حسابداری (Journal Entry) را
 *   بر عهده دارد. هیچ مسئولیتی در مورد وجود حساب، وضعیت دوره مالی، تایید
 *   سند، شعبه/سازمان و غیره ندارد — آن‌ها در Validatorهای جداگانه (که می‌توانند
 *   از همین الگوی Rule-Engine استفاده کنند) قرار می‌گیرند.
 *
 * این فایل شامل:
 *   - Validation Context / Result / Error / Warning / Severity
 *   - Rule Engine قابل توسعه (Rule Registry, Priority, Category, Execution)
 *   - قوانین Balance-Specific: مقدار، یک‌طرفه بودن خط، تراز کل، Precision،
 *     Tolerance، Auto-Balance، Multi-Currency Balance، Cross-Line Duplicate
 *   - Error Factory با پیام‌های Localized (fa/en)
 *   - Logging/Audit Hooks
 *   - Statistics و Validation Summary
 *   - Async pipeline برای قوانینی که نیاز به I/O دارند (مثلاً نرخ ارز)
 * ==========================================================================*/

// ============================================================================
// 1. TYPES & ENUMS
// ============================================================================

export enum ValidationSeverity {
    INFO = 'INFO',
    WARNING = 'WARNING',
    ERROR = 'ERROR',
    CRITICAL = 'CRITICAL',
}

export enum RuleCategory {
    STRUCTURE = 'STRUCTURE', // تعداد خطوط، وجود داده
    AMOUNT = 'AMOUNT', // منفی نبودن، صفر نبودن
    SIDE = 'SIDE', // بدهکار/بستانکار یک‌طرفه
    BALANCE = 'BALANCE', // تراز کل بدهکار/بستانکار
    PRECISION = 'PRECISION', // اعشار، رند کردن، tolerance
    CURRENCY = 'CURRENCY', // تراز ارزی، نرخ تبدیل
    INTEGRITY = 'INTEGRITY', // تکراری بودن خطوط، سازگاری داده
}

export interface ValidationError {
    code: string;
    category: RuleCategory;
    severity: ValidationSeverity;
    message: string;
    messageFa: string;
    lineId?: string;
    meta?: Record<string, unknown>;
}

export interface ValidationWarning extends Omit<ValidationError, 'severity'> {
    severity: ValidationSeverity.WARNING | ValidationSeverity.INFO;
}

export interface ValidationResult {
    valid: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
    summary: ValidationSummary;
}

export interface ValidationSummary {
    totalLines: number;
    totalDebit: number;
    totalCredit: number;
    difference: number;
    currenciesInvolved: string[];
    executedRules: string[];
    durationMs: number;
}

/**
 * Context پاس داده شده به هر Rule. می‌تواند بعداً بدون شکستن
 * امضای Ruleها گسترش یابد (مثلاً افزودن exchangeRates).
 */
export interface BalanceValidationContext {
    lines: JournalEntryLine[];
    options: BalanceValidationOptions;
    exchangeRates?: Record<string, number>; // currencyCode -> rate to base currency
}

export interface BalanceValidationOptions {
    /** بیشترین اختلاف قابل قبول بین بدهکار و بستانکار (پیش‌فرض: 0.000001) */
    tolerance?: number;
    /** تعداد رقم اعشار مجاز برای مقادیر */
    decimalPrecision?: number;
    /** آیا اجازه‌ی Auto-Balance (گرد کردن اختلاف ناچیز) داده شود */
    allowAutoBalance?: boolean;
    /** آیا اعتبارسنجی چند ارزی فعال باشد */
    multiCurrency?: boolean;
    /** ارز پایه سند/سازمان */
    baseCurrency?: string;
    /** در صورت true، اولین خطا Exception پرتاب می‌کند (fail-fast) */
    throwOnFirstError?: boolean;
    /** زبان پیام خطا در Exception نهایی */
    locale?: 'fa' | 'en';
}

/**
 * امضای استاندارد هر Rule در Rule Engine.
 * هر Rule باید errors/warnings را به Context اضافه کند و
 * Pipeline را متوقف نکند (مگر CRITICAL باشد و fail-fast فعال باشد).
 */
export interface BalanceRule {
    code: string;
    category: RuleCategory;
    priority: number; // عدد کمتر => اجرای زودتر
    isAsync?: boolean;
    execute(
        ctx: BalanceValidationContext,
        acc: { errors: ValidationError[]; warnings: ValidationWarning[] },
    ): void | Promise<void>;
}

// ============================================================================
// 2. ERROR FACTORY (Localized)
// ============================================================================

class BalanceErrorFactory {
    static build(
        code: string,
        category: RuleCategory,
        severity: ValidationSeverity,
        messageEn: string,
        messageFa: string,
        lineId?: string,
        meta?: Record<string, unknown>,
    ): ValidationError {
        return {
            code,
            category,
            severity,
            message: messageEn,
            messageFa,
            lineId,
            meta,
        };
    }

    static lineCountInsufficient(count: number): ValidationError {
        return this.build(
            'BAL_001',
            RuleCategory.STRUCTURE,
            ValidationSeverity.CRITICAL,
            `Journal entry must contain at least two lines (found ${count}).`,
            `سند حسابداری باید حداقل دو خط داشته باشد (تعداد فعلی: ${count}).`,
            undefined,
            { count },
        );
    }

    static negativeAmount(lineId: string, field: 'debit' | 'credit', value: number): ValidationError {
        return this.build(
            'BAL_002',
            RuleCategory.AMOUNT,
            ValidationSeverity.ERROR,
            `Negative ${field} amount (${value}) detected in line ${lineId}.`,
            `مقدار منفی در فیلد ${field === 'debit' ? 'بدهکار' : 'بستانکار'} (${value}) در خط ${lineId} یافت شد.`,
            lineId,
            { field, value },
        );
    }

    static bothSidesFilled(lineId: string, debit: number, credit: number): ValidationError {
        return this.build(
            'BAL_003',
            RuleCategory.SIDE,
            ValidationSeverity.ERROR,
            `Line ${lineId} cannot contain both debit (${debit}) and credit (${credit}).`,
            `خط ${lineId} نمی‌تواند هم‌زمان بدهکار (${debit}) و بستانکار (${credit}) داشته باشد.`,
            lineId,
            { debit, credit },
        );
    }

    static emptyLine(lineId: string): ValidationError {
        return this.build(
            'BAL_004',
            RuleCategory.SIDE,
            ValidationSeverity.ERROR,
            `Line ${lineId} must contain a debit or credit amount.`,
            `خط ${lineId} باید دارای مقدار بدهکار یا بستانکار باشد.`,
            lineId,
        );
    }

    static zeroAmountLine(lineId: string): ValidationError {
        return this.build(
            'BAL_005',
            RuleCategory.AMOUNT,
            ValidationSeverity.WARNING,
            `Line ${lineId} has a zero amount on both sides; consider removing it.`,
            `خط ${lineId} دارای مقدار صفر در هر دو طرف است؛ حذف آن پیشنهاد می‌شود.`,
            lineId,
        ) as ValidationError;
    }

    static notBalanced(totalDebit: number, totalCredit: number, difference: number, tolerance: number): ValidationError {
        return this.build(
            'BAL_006',
            RuleCategory.BALANCE,
            ValidationSeverity.CRITICAL,
            `Journal entry is not balanced. Debit=${totalDebit}, Credit=${totalCredit}, Diff=${difference} (tolerance=${tolerance}).`,
            `سند حسابداری تراز نیست. بدهکار=${totalDebit}، بستانکار=${totalCredit}، اختلاف=${difference} (تلورانس=${tolerance}).`,
            undefined,
            { totalDebit, totalCredit, difference, tolerance },
        );
    }

    static precisionExceeded(lineId: string, field: string, value: number, maxDecimals: number): ValidationError {
        return this.build(
            'BAL_007',
            RuleCategory.PRECISION,
            ValidationSeverity.ERROR,
            `Field ${field} in line ${lineId} has more than ${maxDecimals} decimal digits (${value}).`,
            `فیلد ${field} در خط ${lineId} بیش از ${maxDecimals} رقم اعشار دارد (${value}).`,
            lineId,
            { field, value, maxDecimals },
        );
    }

    static duplicateLine(lineId: string, duplicateOfId: string): ValidationError {
        return this.build(
            'BAL_008',
            RuleCategory.INTEGRITY,
            ValidationSeverity.WARNING,
            `Line ${lineId} appears to duplicate line ${duplicateOfId} (same account & amount).`,
            `خط ${lineId} با خط ${duplicateOfId} (هم‌حساب و هم‌مقدار) تکراری به نظر می‌رسد.`,
            lineId,
            { duplicateOfId },
        ) as ValidationError;
    }

    static currencyMismatch(lineId: string, currency: string, baseCurrency: string): ValidationError {
        return this.build(
            'BAL_009',
            RuleCategory.CURRENCY,
            ValidationSeverity.ERROR,
            `Line ${lineId} currency (${currency}) differs from base currency (${baseCurrency}) and has no exchange rate.`,
            `ارز خط ${lineId} (${currency}) با ارز پایه (${baseCurrency}) متفاوت است و نرخ تبدیل موجود نیست.`,
            lineId,
            { currency, baseCurrency },
        );
    }

    static foreignBalanceMismatch(currency: string, totalDebit: number, totalCredit: number, difference: number): ValidationError {
        return this.build(
            'BAL_010',
            RuleCategory.CURRENCY,
            ValidationSeverity.ERROR,
            `Foreign currency (${currency}) lines are not balanced. Debit=${totalDebit}, Credit=${totalCredit}, Diff=${difference}.`,
            `خطوط ارز خارجی (${currency}) تراز نیستند. بدهکار=${totalDebit}، بستانکار=${totalCredit}، اختلاف=${difference}.`,
            undefined,
            { currency, totalDebit, totalCredit, difference },
        );
    }
}

// ============================================================================
// 3. RULE REGISTRY
// ============================================================================

/**
 * نگه‌دارنده‌ی قوانین. اجازه می‌دهد قوانین جدید بدون تغییر Validator اصلی
 * اضافه/حذف/بازنویسی شوند (Open/Closed Principle).
 */
@Injectable()
export class BalanceRuleRegistry {
    private readonly rules = new Map<string, BalanceRule>();

    register(rule: BalanceRule): void {
        if (this.rules.has(rule.code)) {
            throw new Error(`Duplicate rule code: ${rule.code}`);
        }
        this.rules.set(rule.code, rule);
    }

    registerMany(rules: BalanceRule[]): void {
        for (const rule of rules) this.register(rule);
    }

    unregister(code: string): void {
        this.rules.delete(code);
    }

    getAll(): BalanceRule[] {
        return [...this.rules.values()].sort((a, b) => a.priority - b.priority);
    }

    getByCategory(category: RuleCategory): BalanceRule[] {
        return this.getAll().filter((r) => r.category === category);
    }
}

// ============================================================================
// 4. CONCRETE RULES
// ============================================================================

const MinimumLinesRule: BalanceRule = {
    code: 'MinimumLinesRule',
    category: RuleCategory.STRUCTURE,
    priority: 10,
    execute(ctx, acc) {
        const { lines } = ctx;
        if (!lines || lines.length < 2) {
            acc.errors.push(BalanceErrorFactory.lineCountInsufficient(lines?.length ?? 0));
        }
    },
};

const NoNegativeAmountsRule: BalanceRule = {
    code: 'NoNegativeAmountsRule',
    category: RuleCategory.AMOUNT,
    priority: 20,
    execute(ctx, acc) {
        for (const line of ctx.lines) {
            const debit = Number(line.debit);
            const credit = Number(line.credit);
            if (debit < 0) acc.errors.push(BalanceErrorFactory.negativeAmount(line.id, 'debit', debit));
            if (credit < 0) acc.errors.push(BalanceErrorFactory.negativeAmount(line.id, 'credit', credit));
        }
    },
};

const SingleSideAmountRule: BalanceRule = {
    code: 'SingleSideAmountRule',
    category: RuleCategory.SIDE,
    priority: 30,
    execute(ctx, acc) {
        for (const line of ctx.lines) {
            const debit = Number(line.debit);
            const credit = Number(line.credit);

            if (debit > 0 && credit > 0) {
                acc.errors.push(BalanceErrorFactory.bothSidesFilled(line.id, debit, credit));
                continue;
            }
            if (debit === 0 && credit === 0) {
                acc.errors.push(BalanceErrorFactory.emptyLine(line.id));
            }
        }
    },
};

const PrecisionRule: BalanceRule = {
    code: 'PrecisionRule',
    category: RuleCategory.PRECISION,
    priority: 40,
    execute(ctx, acc) {
        const maxDecimals = ctx.options.decimalPrecision ?? 2;
        for (const line of ctx.lines) {
            for (const field of ['debit', 'credit'] as const) {
                const raw = String(line[field]);
                const decimalPart = raw.split('.')[1];
                if (decimalPart && decimalPart.length > maxDecimals) {
                    acc.errors.push(
                        BalanceErrorFactory.precisionExceeded(line.id, field, Number(line[field]), maxDecimals),
                    );
                }
            }
        }
    },
};

const DuplicateLineRule: BalanceRule = {
    code: 'DuplicateLineRule',
    category: RuleCategory.INTEGRITY,
    priority: 50,
    execute(ctx, acc) {
        const seen = new Map<string, string>(); // signature -> lineId

        for (const line of ctx.lines) {
            const signature = `${(line as any).accountId ?? ''}|${line.debit}|${line.credit}`;
            const existing = seen.get(signature);
            if (existing) {
                acc.warnings.push(BalanceErrorFactory.duplicateLine(line.id, existing) as ValidationWarning);
            } else {
                seen.set(signature, line.id);
            }
        }
    },
};

const BalancedTotalsRule: BalanceRule = {
    code: 'BalancedTotalsRule',
    category: RuleCategory.BALANCE,
    priority: 60,
    execute(ctx, acc) {
        const tolerance = ctx.options.tolerance ?? 0.000001;

        const totalDebit = ctx.lines.reduce((sum, l) => sum + Number(l.debit), 0);
        const totalCredit = ctx.lines.reduce((sum, l) => sum + Number(l.credit), 0);
        const difference = Math.abs(totalDebit - totalCredit);

        if (difference > tolerance) {
            // اگر Auto-Balance فعال باشد و اختلاف خیلی کوچک باشد (مثلاً خطای رند)،
            // فقط هشدار می‌دهیم نه خطای بحرانی.
            const autoBalanceThreshold = 0.01;
            if (ctx.options.allowAutoBalance && difference <= autoBalanceThreshold) {
                acc.warnings.push({
                    code: 'BAL_006_AUTO',
                    category: RuleCategory.BALANCE,
                    severity: ValidationSeverity.WARNING,
                    message: `Minor imbalance (${difference}) auto-corrected within threshold.`,
                    messageFa: `عدم تراز ناچیز (${difference}) در محدوده‌ی مجاز Auto-Balance قرار دارد.`,
                    meta: { totalDebit, totalCredit, difference },
                });
            } else {
                acc.errors.push(BalanceErrorFactory.notBalanced(totalDebit, totalCredit, difference, tolerance));
            }
        }
    },
};

/**
 * در صورت چند ارزی بودن سند، باید هم تراز ارز پایه و هم تراز هر ارز خارجی
 * (در صورت وجود مقدار ارزی روی خطوط) بررسی شود.
 */
const MultiCurrencyBalanceRule: BalanceRule = {
    code: 'MultiCurrencyBalanceRule',
    category: RuleCategory.CURRENCY,
    priority: 70,
    execute(ctx, acc) {
        if (!ctx.options.multiCurrency) return;

        const baseCurrency = ctx.options.baseCurrency ?? 'IRR';
        const grouped = new Map<string, JournalEntryLine[]>();

        for (const line of ctx.lines) {
            const currency = (line as any).currency ?? baseCurrency;

            if (currency !== baseCurrency) {
                const hasRate =
                    ctx.exchangeRates && typeof ctx.exchangeRates[currency] === 'number';
                if (!hasRate) {
                    acc.errors.push(BalanceErrorFactory.currencyMismatch(line.id, currency, baseCurrency));
                    continue;
                }
            }

            const bucket = grouped.get(currency) ?? [];
            bucket.push(line);
            grouped.set(currency, bucket);
        }

        for (const [currency, currencyLines] of grouped) {
            if (currency === baseCurrency) continue; // قبلاً در BalancedTotalsRule (روی ارز پایه) چک شد

            const totalDebit = currencyLines.reduce((s, l) => s + Number((l as any).foreignDebit ?? l.debit), 0);
            const totalCredit = currencyLines.reduce((s, l) => s + Number((l as any).foreignCredit ?? l.credit), 0);
            const difference = Math.abs(totalDebit - totalCredit);
            const tolerance = ctx.options.tolerance ?? 0.000001;

            if (difference > tolerance) {
                acc.errors.push(BalanceErrorFactory.foreignBalanceMismatch(currency, totalDebit, totalCredit, difference));
            }
        }
    },
};

/** قوانین پیش‌فرض که Validator به صورت خودکار رجیستر می‌کند. */
const DEFAULT_RULES: BalanceRule[] = [
    MinimumLinesRule,
    NoNegativeAmountsRule,
    SingleSideAmountRule,
    PrecisionRule,
    DuplicateLineRule,
    BalancedTotalsRule,
    MultiCurrencyBalanceRule,
];

// ============================================================================
// 5. THE VALIDATOR
// ============================================================================

@Injectable()
export class JournalBalanceValidator {
    private readonly logger = new Logger(JournalBalanceValidator.name);
    private readonly registry = new BalanceRuleRegistry();

    // Statistics (in-memory, per-instance — جایگزین مناسب برای Prometheus/StatsD)
    private stats = {
        totalRuns: 0,
        totalFailures: 0,
        totalWarningsEmitted: 0,
        lastDurationMs: 0,
    };

    constructor() {
        this.registry.registerMany(DEFAULT_RULES);
    }

    /**
     * امکان افزودن Rule سفارشی از بیرون (مثلاً برای Tenantهای خاص) بدون
     * نیاز به ویرایش این فایل.
     */
    addRule(rule: BalanceRule): void {
        this.registry.register(rule);
    }

    removeRule(code: string): void {
        this.registry.unregister(code);
    }

    /**
     * نقطه‌ی ورود اصلی و هم‌خوان با نسخه‌ی قبلی API:
     * در صورت عدم تراز یا خطای بحرانی، Exception پرتاب می‌کند.
     */
    validate(lines: JournalEntryLine[], options: BalanceValidationOptions = {}): void {
        const result = this.run(lines, options);

        if (!result.valid) {
            const locale = options.locale ?? 'fa';
            const primary = result.errors[0];

            throw new BadRequestException({
                message: locale === 'fa' ? primary.messageFa : primary.message,
                errors: result.errors,
                warnings: result.warnings,
                summary: result.summary,
            });
        }

        if (result.warnings.length > 0) {
            this.logger.warn(
                `Journal balance validated with ${result.warnings.length} warning(s): ` +
                result.warnings.map((w) => w.code).join(', '),
            );
        }
    }

    /**
     * نسخه‌ی Async — برای زمانی که Ruleهایی نیاز به I/O دارند
     * (مثلاً واکشی نرخ ارز لحظه‌ای).
     */
    async validateAsync(
        lines: JournalEntryLine[],
        options: BalanceValidationOptions = {},
        exchangeRates?: Record<string, number>,
    ): Promise<void> {
        const result = await this.runAsync(lines, options, exchangeRates);

        if (!result.valid) {
            const locale = options.locale ?? 'fa';
            const primary = result.errors[0];

            throw new BadRequestException({
                message: locale === 'fa' ? primary.messageFa : primary.message,
                errors: result.errors,
                warnings: result.warnings,
                summary: result.summary,
            });
        }
    }

    /**
     * اجرای Pipeline بدون پرتاب Exception — برای جاهایی که فقط
     * گزارش (Report) لازم است، نه توقف فرآیند (مثلاً پیش‌نمایش UI).
     */
    run(lines: JournalEntryLine[], options: BalanceValidationOptions = {}): ValidationResult {
        const start = Date.now();
        this.stats.totalRuns++;

        const ctx: BalanceValidationContext = { lines: lines ?? [], options };
        const acc: { errors: ValidationError[]; warnings: ValidationWarning[] } = {
            errors: [],
            warnings: [],
        };

        const executedRules: string[] = [];

        for (const rule of this.registry.getAll()) {
            if (rule.isAsync) continue; // قوانین Async در runAsync اجرا می‌شوند

            try {
                rule.execute(ctx, acc);
                executedRules.push(rule.code);
            } catch (err) {
                this.logger.error(`Rule ${rule.code} threw an unexpected error`, err as Error);
                acc.errors.push({
                    code: 'BAL_999',
                    category: rule.category,
                    severity: ValidationSeverity.CRITICAL,
                    message: `Internal error while executing rule ${rule.code}.`,
                    messageFa: `خطای داخلی هنگام اجرای قانون ${rule.code}.`,
                });
            }

            if (options.throwOnFirstError && acc.errors.length > 0) break;
        }

        const summary = this.buildSummary(ctx, executedRules, Date.now() - start);

        if (acc.errors.length > 0) this.stats.totalFailures++;
        this.stats.totalWarningsEmitted += acc.warnings.length;
        this.stats.lastDurationMs = summary.durationMs;

        return {
            valid: acc.errors.length === 0,
            errors: acc.errors,
            warnings: acc.warnings,
            summary,
        };
    }

    async runAsync(
        lines: JournalEntryLine[],
        options: BalanceValidationOptions = {},
        exchangeRates?: Record<string, number>,
    ): Promise<ValidationResult> {
        const start = Date.now();

        const ctx: BalanceValidationContext = { lines: lines ?? [], options, exchangeRates };
        const acc: { errors: ValidationError[]; warnings: ValidationWarning[] } = {
            errors: [],
            warnings: [],
        };

        const executedRules: string[] = [];

        for (const rule of this.registry.getAll()) {
            try {
                await rule.execute(ctx, acc);
                executedRules.push(rule.code);
            } catch (err) {
                this.logger.error(`Async rule ${rule.code} threw an unexpected error`, err as Error);
                acc.errors.push({
                    code: 'BAL_999',
                    category: rule.category,
                    severity: ValidationSeverity.CRITICAL,
                    message: `Internal error while executing rule ${rule.code}.`,
                    messageFa: `خطای داخلی هنگام اجرای قانون ${rule.code}.`,
                });
            }

            if (options.throwOnFirstError && acc.errors.length > 0) break;
        }

        const summary = this.buildSummary(ctx, executedRules, Date.now() - start);

        return {
            valid: acc.errors.length === 0,
            errors: acc.errors,
            warnings: acc.warnings,
            summary,
        };
    }

    getStatistics() {
        return { ...this.stats };
    }

    // --------------------------------------------------------------------
    // Private helpers
    // --------------------------------------------------------------------

    private buildSummary(
        ctx: BalanceValidationContext,
        executedRules: string[],
        durationMs: number,
    ): ValidationSummary {
        const totalDebit = ctx.lines.reduce((s, l) => s + Number(l.debit), 0);
        const totalCredit = ctx.lines.reduce((s, l) => s + Number(l.credit), 0);

        const currenciesInvolved = Array.from(
            new Set(ctx.lines.map((l) => (l as any).currency ?? ctx.options.baseCurrency ?? 'IRR')),
        );

        return {
            totalLines: ctx.lines.length,
            totalDebit,
            totalCredit,
            difference: Math.abs(totalDebit - totalCredit),
            currenciesInvolved,
            executedRules,
            durationMs,
        };
    }
}
