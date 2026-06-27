// ============================================================================
// providers/journal-line.mapper.ts
// تبدیل Prisma entity به BalanceLine — نقطه تماس با ORM
// Validator هرگز JournalEntryLine نمی‌بیند
// ============================================================================

import { Injectable } from '@nestjs/common'
import { JournalEntryLine } from '@prisma/client'
import { BalanceLine } from '../interfaces'

@Injectable()
export class JournalLineMapper {
  toBalanceLine(line: JournalEntryLine): BalanceLine {
    return {
      id:                   line.id,
      accountId:            line.accountId,
      debit:                Number(line.debit),
      credit:               Number(line.credit),
      currencyCode:         undefined, // از طریق include در query اضافه می‌شود
      foreignDebit:         line.foreignDebit  ? Number(line.foreignDebit)  : undefined,
      foreignCredit:        line.foreignCredit ? Number(line.foreignCredit) : undefined,
      exchangeRateSnapshot: line.exchangeRateSnapshot ? Number(line.exchangeRateSnapshot) : undefined,
      costCenterId:         line.costCenterId  ?? undefined,
      projectId:            line.projectId     ?? undefined,
      description:          line.description   ?? undefined,
      sortOrder:            line.sortOrder,
    }
  }

  /**
   * برای query هایی که currency رو include می‌کنند
   */
  toBalanceLineWithCurrency(
    line: JournalEntryLine & { currency?: { code: string } | null },
  ): BalanceLine {
    return {
      ...this.toBalanceLine(line),
      currencyCode: line.currency?.code ?? undefined,
    }
  }

  toBalanceLines(lines: JournalEntryLine[]): BalanceLine[] {
    return lines.map((l) => this.toBalanceLine(l))
  }
}
