// ============================================================================
// engine/error-factory.ts
// کارخانه خطا: تولید ValidationIssue با messageKey قابل ترجمه
// FrontEnd از messageKey برای i18n استفاده می‌کند
// ============================================================================

import { Injectable } from '@nestjs/common'
import { RuleCategory, RuleCode, ValidationSeverity } from './validation.enums'
import { ValidationError, ValidationIssue, ValidationWarning } from './validation-result'

@Injectable()
export class ErrorFactory {
  private build(
    code: RuleCode,
    category: RuleCategory,
    severity: ValidationSeverity,
    messageFa: string,
    messageEn: string,
    lineId?: string,
    meta?: Record<string, unknown>,
  ): ValidationIssue {
    return Object.freeze({
      code,
      category,
      severity,
      messageKey: `journal.validation.${code}`,
      messageFa,
      messageEn,
      lineId,
      meta: meta ? Object.freeze(meta) : undefined,
    })
  }

  // ─── STRUCTURE ───────────────────────────────────────────────────────────

  insufficientLines(count: number): ValidationError {
    return this.build(
      RuleCode.INSUFFICIENT_LINES,
      RuleCategory.STRUCTURE,
      ValidationSeverity.CRITICAL,
      `سند حسابداری باید حداقل دو خط داشته باشد (تعداد فعلی: ${count}).`,
      `Journal entry must contain at least two lines (found ${count}).`,
      undefined,
      { count },
    ) as ValidationError
  }

  // ─── AMOUNT ──────────────────────────────────────────────────────────────

  negativeDebit(lineId: string, value: number): ValidationError {
    return this.build(
      RuleCode.NEGATIVE_DEBIT,
      RuleCategory.AMOUNT,
      ValidationSeverity.ERROR,
      `مقدار بدهکار منفی (${value}) در خط ${lineId} مجاز نیست.`,
      `Negative debit amount (${value}) is not allowed in line ${lineId}.`,
      lineId,
      { value },
    ) as ValidationError
  }

  negativeCredit(lineId: string, value: number): ValidationError {
    return this.build(
      RuleCode.NEGATIVE_CREDIT,
      RuleCategory.AMOUNT,
      ValidationSeverity.ERROR,
      `مقدار بستانکار منفی (${value}) در خط ${lineId} مجاز نیست.`,
      `Negative credit amount (${value}) is not allowed in line ${lineId}.`,
      lineId,
      { value },
    ) as ValidationError
  }

  zeroLine(lineId: string): ValidationWarning {
    return this.build(
      RuleCode.ZERO_LINE,
      RuleCategory.AMOUNT,
      ValidationSeverity.WARNING,
      `خط ${lineId} مقدار صفر در هر دو طرف دارد؛ حذف آن پیشنهاد می‌شود.`,
      `Line ${lineId} has zero on both sides; consider removing it.`,
      lineId,
    ) as ValidationWarning
  }

  // ─── SIDE ─────────────────────────────────────────────────────────────────

  doubleSide(lineId: string, debit: number, credit: number): ValidationError {
    return this.build(
      RuleCode.DOUBLE_SIDE,
      RuleCategory.SIDE,
      ValidationSeverity.ERROR,
      `خط ${lineId} نمی‌تواند هم‌زمان بدهکار (${debit}) و بستانکار (${credit}) داشته باشد.`,
      `Line ${lineId} cannot have both debit (${debit}) and credit (${credit}).`,
      lineId,
      { debit, credit },
    ) as ValidationError
  }

  emptyLine(lineId: string): ValidationError {
    return this.build(
      RuleCode.EMPTY_LINE,
      RuleCategory.SIDE,
      ValidationSeverity.ERROR,
      `خط ${lineId} باید دارای مقدار بدهکار یا بستانکار باشد.`,
      `Line ${lineId} must have a debit or credit amount.`,
      lineId,
    ) as ValidationError
  }

  // ─── BALANCE ──────────────────────────────────────────────────────────────

  balanceNotEqual(totalDebit: number, totalCredit: number, difference: number, tolerance: number): ValidationError {
    return this.build(
      RuleCode.BALANCE_NOT_EQUAL,
      RuleCategory.BALANCE,
      ValidationSeverity.CRITICAL,
      `سند تراز نیست. بدهکار=${totalDebit}، بستانکار=${totalCredit}، اختلاف=${difference} (تلرانس=${tolerance}).`,
      `Entry not balanced. Debit=${totalDebit}, Credit=${totalCredit}, Diff=${difference} (tolerance=${tolerance}).`,
      undefined,
      { totalDebit, totalCredit, difference, tolerance },
    ) as ValidationError
  }

  autoBalanceApplied(difference: number, threshold: number): ValidationWarning {
    return this.build(
      RuleCode.AUTO_BALANCE_APPLIED,
      RuleCategory.BALANCE,
      ValidationSeverity.WARNING,
      `اختلاف ناچیز (${difference}) در محدوده Auto-Balance (${threshold}) قرار دارد.`,
      `Minor imbalance (${difference}) is within auto-balance threshold (${threshold}).`,
      undefined,
      { difference, threshold },
    ) as ValidationWarning
  }

  // ─── PRECISION ────────────────────────────────────────────────────────────

  precisionExceeded(lineId: string, field: 'debit' | 'credit', value: number, maxDecimals: number): ValidationError {
    return this.build(
      RuleCode.PRECISION_EXCEEDED,
      RuleCategory.PRECISION,
      ValidationSeverity.ERROR,
      `فیلد ${field === 'debit' ? 'بدهکار' : 'بستانکار'} در خط ${lineId} بیش از ${maxDecimals} رقم اعشار دارد (${value}).`,
      `Field ${field} in line ${lineId} exceeds ${maxDecimals} decimal digits (${value}).`,
      lineId,
      { field, value, maxDecimals },
    ) as ValidationError
  }

  // ─── INTEGRITY ───────────────────────────────────────────────────────────

  duplicateLine(lineId: string, duplicateOfId: string): ValidationWarning {
    return this.build(
      RuleCode.DUPLICATE_LINE,
      RuleCategory.INTEGRITY,
      ValidationSeverity.WARNING,
      `خط ${lineId} با خط ${duplicateOfId} (هم‌حساب و هم‌مقدار) تکراری به نظر می‌رسد.`,
      `Line ${lineId} appears to duplicate line ${duplicateOfId} (same account & amount).`,
      lineId,
      { duplicateOfId },
    ) as ValidationWarning
  }

  // ─── CURRENCY ────────────────────────────────────────────────────────────

  missingExchangeRate(lineId: string, currencyCode: string, baseCurrency: string): ValidationError {
    return this.build(
      RuleCode.MISSING_EXCHANGE_RATE,
      RuleCategory.CURRENCY,
      ValidationSeverity.ERROR,
      `نرخ تبدیل ارز ${currencyCode} به ${baseCurrency} برای خط ${lineId} موجود نیست.`,
      `Exchange rate for ${currencyCode} to ${baseCurrency} not found for line ${lineId}.`,
      lineId,
      { currencyCode, baseCurrency },
    ) as ValidationError
  }

  foreignNotBalanced(currencyCode: string, totalDebit: number, totalCredit: number, difference: number): ValidationError {
    return this.build(
      RuleCode.FOREIGN_NOT_BALANCED,
      RuleCategory.CURRENCY,
      ValidationSeverity.ERROR,
      `خطوط ارز خارجی (${currencyCode}) تراز نیستند. بدهکار=${totalDebit}، بستانکار=${totalCredit}، اختلاف=${difference}.`,
      `Foreign currency (${currencyCode}) lines not balanced. Debit=${totalDebit}, Credit=${totalCredit}, Diff=${difference}.`,
      undefined,
      { currencyCode, totalDebit, totalCredit, difference },
    ) as ValidationError
  }

  // ─── SYSTEM ──────────────────────────────────────────────────────────────

  ruleExecutionFailed(ruleCode: string, category: RuleCategory): ValidationError {
    return this.build(
      RuleCode.RULE_EXECUTION_FAILED,
      category,
      ValidationSeverity.CRITICAL,
      `خطای داخلی هنگام اجرای قانون ${ruleCode}.`,
      `Internal error while executing rule ${ruleCode}.`,
      undefined,
      { ruleCode },
    ) as ValidationError
  }
}
