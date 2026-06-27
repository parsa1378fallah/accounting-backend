// ============================================================================
// interfaces/balance-line.interface.ts
// مستقل از Prisma — Validator هیچ‌وقت JournalEntryLine رو مستقیم نمی‌بینه
// ============================================================================

export interface BalanceLine {
  readonly id: string
  readonly accountId: string
  readonly debit: number
  readonly credit: number

  // ارز خارجی (اختیاری)
  readonly currencyCode?: string
  readonly foreignDebit?: number
  readonly foreignCredit?: number
  readonly exchangeRateSnapshot?: number

  // اطلاعات تکمیلی برای rule های پیشرفته
  readonly costCenterId?: string
  readonly projectId?: string
  readonly description?: string
  readonly sortOrder?: number
}
