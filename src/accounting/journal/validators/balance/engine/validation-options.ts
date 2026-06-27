// ============================================================================
// engine/validation-options.ts
// Options شکسته شده به بخش‌های منطقی — جلوگیری از God Object
// ============================================================================

export interface BalanceOptions {
  /** بیشترین اختلاف قابل قبول (پیش‌فرض: 0.000001) */
  readonly tolerance?: number
  /** اگر true باشد، اختلاف کمتر از autoBalanceThreshold فقط warning می‌دهد */
  readonly allowAutoBalance?: boolean
  /** آستانه Auto-Balance (پیش‌فرض: 0.01) */
  readonly autoBalanceThreshold?: number
}

export interface PrecisionOptions {
  /** حداکثر رقم اعشار مجاز (پیش‌فرض: 4 بر اساس @db.Decimal(20,4) اسکیما) */
  readonly decimalPrecision?: number
}

export interface CurrencyOptions {
  /** فعال‌سازی اعتبارسنجی چند ارزی */
  readonly multiCurrency?: boolean
  /** ارز پایه سازمان (پیش‌فرض: IRR) */
  readonly baseCurrency?: string
}

export interface LocalizationOptions {
  /** زبان پیام خطا در Exception نهایی (پیش‌فرض: fa) */
  readonly locale?: 'fa' | 'en'
}

export interface ExecutionOptions {
  /** توقف اجرا پس از اولین خطا */
  readonly throwOnFirstError?: boolean
  /** دسته‌هایی که نباید اجرا شوند */
  readonly disabledCategories?: string[]
  /** کدهایی که نباید اجرا شوند */
  readonly disabledRules?: string[]
}

/** تجمیع همه Options — برای استفاده در Validator */
export interface BalanceValidationOptions
  extends BalanceOptions,
    PrecisionOptions,
    CurrencyOptions,
    LocalizationOptions,
    ExecutionOptions {}

/** مقادیر پیش‌فرض */
export const DEFAULT_OPTIONS: Required<BalanceOptions & PrecisionOptions & CurrencyOptions & LocalizationOptions> = {
  tolerance:            0.000001,
  allowAutoBalance:     false,
  autoBalanceThreshold: 0.01,
  decimalPrecision:     4,
  multiCurrency:        false,
  baseCurrency:         'IRR',
  locale:               'fa',
}
