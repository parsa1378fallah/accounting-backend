// ============================================================================
// نمونه استفاده در JournalService
// ============================================================================

import { Injectable } from '@nestjs/common'
import { JournalEntryLine } from '@prisma/client'
import { JournalBalanceValidator } from './journal-balance.validator'
import { JournalLineMapper } from './providers/journal-line.mapper'

@Injectable()
export class JournalService {
  constructor(
    private readonly validator: JournalBalanceValidator,
    private readonly mapper:    JournalLineMapper,
  ) {}

  async postEntry(lines: (JournalEntryLine & { currency?: { code: string } | null })[]): Promise<void> {
    const balanceLines = lines.map((l) => this.mapper.toBalanceLineWithCurrency(l))

    // اجرا با Exception (برای ثبت سند)
    await this.validator.validate(balanceLines, {
      multiCurrency:    true,
      baseCurrency:     'IRR',
      decimalPrecision: 4,
      locale:           'fa',
    })

    // ادامه ثبت سند...
  }

  async previewEntry(lines: (JournalEntryLine & { currency?: { code: string } | null })[]) {
    const balanceLines = lines.map((l) => this.mapper.toBalanceLineWithCurrency(l))

    // اجرا بدون Exception (برای پیش‌نمایش UI)
    const result = await this.validator.run(balanceLines, {
      multiCurrency:    true,
      allowAutoBalance: true,
    })

    return {
      isValid:  result.valid,
      errors:   result.errors,
      warnings: result.warnings,
      summary:  result.summary,
    }
  }
}
