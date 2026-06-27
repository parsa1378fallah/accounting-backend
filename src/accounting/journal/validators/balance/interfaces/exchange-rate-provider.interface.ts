// ============================================================================
// interfaces/exchange-rate-provider.interface.ts
// Rule ها از این interface استفاده می‌کنند — نه از Prisma مستقیم
// ============================================================================

export const EXCHANGE_RATE_PROVIDER = Symbol('EXCHANGE_RATE_PROVIDER')

export interface ExchangeRateProvider {
  /**
   * نرخ تبدیل ارز به ارز پایه را برمی‌گرداند.
   * اگر نرخ موجود نباشد، null برمی‌گرداند.
   */
  getRate(currencyCode: string, date?: Date): Promise<number | null>

  /**
   * بررسی وجود ارز در سیستم
   */
  currencyExists(currencyCode: string): Promise<boolean>
}
