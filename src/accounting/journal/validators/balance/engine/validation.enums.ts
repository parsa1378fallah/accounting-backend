// ============================================================================
// engine/validation.enums.ts
// منبع واحد حقیقت برای همه enum های اعتبارسنجی
// FrontEnd مستقیم از RuleCode برای ترجمه پیام استفاده می‌کند
// ============================================================================

export enum ValidationSeverity {
  INFO     = 'INFO',
  WARNING  = 'WARNING',
  ERROR    = 'ERROR',
  CRITICAL = 'CRITICAL',
}

export enum RuleCategory {
  STRUCTURE = 'STRUCTURE', // تعداد خطوط، ساختار سند
  AMOUNT    = 'AMOUNT',    // منفی، صفر، مقادیر
  SIDE      = 'SIDE',      // یک‌طرفه بودن بدهکار/بستانکار
  BALANCE   = 'BALANCE',   // تراز کل
  PRECISION = 'PRECISION', // رقم اعشار، tolerance
  CURRENCY  = 'CURRENCY',  // تراز ارزی، نرخ تبدیل
  INTEGRITY = 'INTEGRITY', // تکراری، سازگاری داده
}

/**
 * هر کد rule یک کد خطای ثابت و قابل ترجمه است.
 * FrontEnd از این enum برای نمایش پیام متناسب با زبان استفاده می‌کند.
 */
export enum RuleCode {
  // STRUCTURE
  INSUFFICIENT_LINES    = 'INSUFFICIENT_LINES',

  // AMOUNT
  NEGATIVE_DEBIT        = 'NEGATIVE_DEBIT',
  NEGATIVE_CREDIT       = 'NEGATIVE_CREDIT',
  ZERO_LINE             = 'ZERO_LINE',

  // SIDE
  DOUBLE_SIDE           = 'DOUBLE_SIDE',
  EMPTY_LINE            = 'EMPTY_LINE',

  // BALANCE
  BALANCE_NOT_EQUAL     = 'BALANCE_NOT_EQUAL',
  AUTO_BALANCE_APPLIED  = 'AUTO_BALANCE_APPLIED',

  // PRECISION
  PRECISION_EXCEEDED    = 'PRECISION_EXCEEDED',

  // INTEGRITY
  DUPLICATE_LINE        = 'DUPLICATE_LINE',

  // CURRENCY
  MISSING_EXCHANGE_RATE = 'MISSING_EXCHANGE_RATE',
  FOREIGN_NOT_BALANCED  = 'FOREIGN_NOT_BALANCED',

  // SYSTEM
  RULE_EXECUTION_FAILED = 'RULE_EXECUTION_FAILED',
}
