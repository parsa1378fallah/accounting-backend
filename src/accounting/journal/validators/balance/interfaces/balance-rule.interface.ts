// ============================================================================
// interfaces/balance-rule.interface.ts
// ============================================================================

import { RuleCategory, RuleCode, ValidationSeverity } from '../engine/validation.enums'
import { ValidationAccumulator } from '../engine/validation-accumulator'
import { BalanceValidationContext } from '../engine/validation-context'

export interface BalanceRule {
  readonly code: RuleCode
  readonly category: RuleCategory
  readonly priority: number
  readonly isAsync: boolean

  /** Rule هایی که باید قبل از این اجرا شده باشند */
  readonly dependsOn?: RuleCode[]

  execute(
    ctx: BalanceValidationContext,
    acc: ValidationAccumulator,
  ): void | Promise<void>
}
