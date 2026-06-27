// ============================================================================
// rules/currency.rule.ts
// Rule ناهمگام — نرخ ارز را از Provider می‌گیرد، نه مستقیم از Prisma
// ============================================================================

import { Inject, Injectable, Logger } from '@nestjs/common'
import * as interfaces from '../interfaces'
import { ValidationAccumulator } from '../engine/validation-accumulator'
import { BalanceValidationContext } from '../engine/validation-context'
import { RuleCategory, RuleCode } from '../engine/validation.enums'
import { ErrorFactory } from '../engine/error-factory'

@Injectable()
export class MultiCurrencyBalanceRule implements interfaces.BalanceRule {
  readonly code = RuleCode.MISSING_EXCHANGE_RATE
  readonly category = RuleCategory.CURRENCY
  readonly priority = 70
  readonly isAsync = true
  readonly dependsOn = [RuleCode.BALANCE_NOT_EQUAL]

  private readonly logger = new Logger(MultiCurrencyBalanceRule.name)

  constructor(
    @Inject(interfaces.EXCHANGE_RATE_PROVIDER)
    private readonly rateProvider: interfaces.ExchangeRateProvider,
    private readonly factory: ErrorFactory,
  ) { }

  async execute(ctx: BalanceValidationContext, acc: ValidationAccumulator): Promise<void> {
    if (!ctx.options.multiCurrency) return

    const { baseCurrency } = ctx.options
    const foreignLines = ctx.foreignLines

    if (foreignLines.length === 0) return

    // گروه‌بندی خطوط بر اساس ارز
    const groups = new Map<string, typeof foreignLines[number][]>()

    for (const line of foreignLines) {
      const code = line.currencyCode!

      // گرفتن نرخ ارز از Provider (که خودش کش می‌کند)
      const rate = await this.rateProvider.getRate(code, ctx.entryDate)

      if (rate === null) {
        this.logger.warn(`Exchange rate not found for currency: ${code}`)
        acc.push(this.factory.missingExchangeRate(line.id, code, baseCurrency))
        continue
      }

      const bucket = groups.get(code) ?? []
      bucket.push(line)
      groups.set(code, bucket)
    }

    // بررسی تراز هر ارز خارجی به صورت مستقل
    for (const [currencyCode, lines] of groups) {
      const totalDebit = lines.reduce((s, l) => s + (l.foreignDebit ?? l.debit), 0)
      const totalCredit = lines.reduce((s, l) => s + (l.foreignCredit ?? l.credit), 0)
      const difference = Math.abs(totalDebit - totalCredit)

      if (difference > ctx.options.tolerance) {
        acc.push(
          this.factory.foreignNotBalanced(currencyCode, totalDebit, totalCredit, difference),
        )
      }
    }
  }
}
