// ============================================================================
// journal-balance.validator.ts
// نقطه ورود اصلی — orchestration خالص، بدون Business Logic
//
// مسئولیت‌ها:
//   ۱. دریافت BalanceLine ها و Options
//   ۲. ساخت Context
//   ۳. فراخوانی RuleRegistry برای ترتیب قوانین
//   ۴. اجرای pipeline از طریق ValidationEngine
//   ۵. ساخت نتیجه نهایی از طریق SummaryBuilder
//   ۶. آمار درونی (in-process metrics)
//
// هیچ Rule ای، هیچ Prisma Query ای، هیچ i18n ای در این فایل نیست.
// ============================================================================

import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { BalanceLine } from './interfaces'
import {
  BalanceValidationContext,
  BalanceValidationOptions,
  ErrorFactory,
  RuleCode,
  RuleRegistry,
  SummaryBuilder,
  ValidationEngine,
  ValidationResult,
} from './engine'
import {
  BalancedTotalsRule,
  DuplicateLineRule,
  MinimumLinesRule,
  MultiCurrencyBalanceRule,
  NoNegativeAmountsRule,
  PrecisionRule,
  SingleSideRule,
} from './rules'

// ─── In-process metrics ──────────────────────────────────────────────────────
interface ValidatorStats {
  totalRuns:            number
  totalFailures:        number
  totalWarningsEmitted: number
  lastDurationMs:       number
  avgDurationMs:        number
}

@Injectable()
export class JournalBalanceValidator {
  private readonly logger = new Logger(JournalBalanceValidator.name)

  private readonly stats: ValidatorStats = {
    totalRuns:            0,
    totalFailures:        0,
    totalWarningsEmitted: 0,
    lastDurationMs:       0,
    avgDurationMs:        0,
  }

  constructor(
    private readonly registry:  RuleRegistry,
    private readonly engine:    ValidationEngine,
    private readonly summary:   SummaryBuilder,
    private readonly factory:   ErrorFactory,
    // Sync rules
    private readonly minimumLines:    MinimumLinesRule,
    private readonly noNegative:      NoNegativeAmountsRule,
    private readonly singleSide:      SingleSideRule,
    private readonly precision:       PrecisionRule,
    private readonly duplicate:       DuplicateLineRule,
    private readonly balanced:        BalancedTotalsRule,
    // Async rules
    private readonly multiCurrency:   MultiCurrencyBalanceRule,
  ) {
    this.registerDefaultRules()
  }

  // ─── PUBLIC API ────────────────────────────────────────────────────────────

  /**
   * اجرا بدون پرتاب Exception — برای UI preview، ذخیره پیش‌نویس، گزارش
   */
  async run(
    lines: BalanceLine[],
    options: BalanceValidationOptions = {},
  ): Promise<ValidationResult> {
    const start = Date.now()
    this.stats.totalRuns++

    const ctx = new BalanceValidationContext(lines, options)
    const rules = this.registry.getOrdered(
      (options.disabledRules ?? []) as RuleCode[],
    )

    const acc = await this.engine.execute(rules, ctx)

    const executedRules = rules.map((r) => r.code)
    const allCodes = this.registry.getOrdered().map((r) => r.code)
    const skippedRules = allCodes.filter((c) => !executedRules.includes(c))

    const durationMs = Date.now() - start
    const builtSummary = this.summary.build(ctx, acc, executedRules, skippedRules, durationMs)

    // به‌روزرسانی stats
    if (acc.hasErrors) this.stats.totalFailures++
    this.stats.totalWarningsEmitted += acc.warnings.length
    this.stats.lastDurationMs = durationMs
    this.stats.avgDurationMs  = this.rollingAvg(this.stats.avgDurationMs, durationMs, this.stats.totalRuns)

    if (acc.warnings.length > 0) {
      this.logger.warn(
        `Validation completed with ${acc.warnings.length} warning(s): ` +
        acc.warnings.map((w) => w.code).join(', '),
      )
    }

    return {
      valid:    !acc.hasErrors,
      errors:   acc.errors,
      warnings: acc.warnings,
      summary:  builtSummary,
    }
  }

  /**
   * اجرا با پرتاب Exception در صورت خطا — برای service layer
   */
  async validate(
    lines: BalanceLine[],
    options: BalanceValidationOptions = {},
  ): Promise<void> {
    const result = await this.run(lines, options)

    if (!result.valid) {
      const locale  = options.locale ?? 'fa'
      const primary = result.errors[0]

      throw new BadRequestException({
        message:  locale === 'fa' ? primary.messageFa : primary.messageEn,
        errorCode: primary.code,
        errors:   result.errors,
        warnings: result.warnings,
        summary:  result.summary,
      })
    }
  }

  // ─── RULE MANAGEMENT ───────────────────────────────────────────────────────

  /** افزودن Rule سفارشی برای Tenant یا افزونه خاص */
  addRule(rule: import('./interfaces').BalanceRule): void {
    this.registry.register(rule)
  }

  enableRule(code: RuleCode): void  { this.registry.enable(code) }
  disableRule(code: RuleCode): void { this.registry.disable(code) }

  // ─── METRICS ───────────────────────────────────────────────────────────────

  getStats(): Readonly<ValidatorStats> {
    return { ...this.stats }
  }

  resetStats(): void {
    Object.assign(this.stats, {
      totalRuns: 0, totalFailures: 0, totalWarningsEmitted: 0,
      lastDurationMs: 0, avgDurationMs: 0,
    })
  }

  // ─── PRIVATE ───────────────────────────────────────────────────────────────

  private registerDefaultRules(): void {
    this.registry.registerMany([
      this.minimumLines,
      this.noNegative,
      this.singleSide,
      this.precision,
      this.duplicate,
      this.balanced,
      this.multiCurrency,
    ])
    this.logger.log(`${this.registry.getOrdered().length} validation rules registered`)
  }

  private rollingAvg(prev: number, current: number, count: number): number {
    return prev + (current - prev) / count
  }
}
