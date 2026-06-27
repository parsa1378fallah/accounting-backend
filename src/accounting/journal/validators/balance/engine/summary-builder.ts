// ============================================================================
// engine/summary-builder.ts
// مسئولیت تنها: ساخت ValidationSummary از نتیجه pipeline
// ============================================================================

import { Injectable } from '@nestjs/common'
import { BalanceValidationContext } from './validation-context'
import { ValidationAccumulator } from './validation-accumulator'
import { RuleCode } from './validation.enums'
import { ValidationSummary } from './validation-result'

@Injectable()
export class SummaryBuilder {
  build(
    ctx: BalanceValidationContext,
    acc: ValidationAccumulator,
    executedRules: RuleCode[],
    skippedRules: RuleCode[],
    durationMs: number,
  ): ValidationSummary {
    return Object.freeze({
      totalLines:          ctx.lines.length,
      totalDebit:          ctx.totalDebit,
      totalCredit:         ctx.totalCredit,
      difference:          ctx.difference,
      currenciesInvolved:  ctx.currenciesInvolved,
      executedRules:       executedRules,
      skippedRules:        skippedRules,
      errorCount:          acc.errors.length,
      warningCount:        acc.warnings.length,
      durationMs,
    })
  }
}
