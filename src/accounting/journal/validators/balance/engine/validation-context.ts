// ============================================================================
// engine/validation-context.ts
// Context پاس داده‌شده به هر Rule — فقط داده، بدون dependency
// ============================================================================

import { BalanceLine } from '../interfaces'
import { BalanceValidationOptions, DEFAULT_OPTIONS } from './validation-options'

export class BalanceValidationContext {
  readonly lines: readonly BalanceLine[]
  readonly options: Readonly<Required<BalanceValidationOptions>>
  readonly entryDate: Date

  constructor(
    lines: BalanceLine[],
    options: BalanceValidationOptions = {},
    entryDate?: Date,
  ) {
    this.lines = Object.freeze([...lines])
    this.options = Object.freeze({
      ...DEFAULT_OPTIONS,
      throwOnFirstError: false,
      disabledCategories: [],
      disabledRules: [],
      ...options,
    })
    this.entryDate = entryDate ?? new Date()
  }

  get totalDebit(): number {
    return this.lines.reduce((s, l) => s + l.debit, 0)
  }

  get totalCredit(): number {
    return this.lines.reduce((s, l) => s + l.credit, 0)
  }

  get difference(): number {
    return Math.abs(this.totalDebit - this.totalCredit)
  }

  get currenciesInvolved(): string[] {
    return Array.from(
      new Set(this.lines.map((l) => l.currencyCode ?? this.options.baseCurrency)),
    )
  }

  get foreignLines(): readonly BalanceLine[] {
    return this.lines.filter(
      (l) => l.currencyCode && l.currencyCode !== this.options.baseCurrency,
    )
  }
}
