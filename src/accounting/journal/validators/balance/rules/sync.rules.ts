// ============================================================================
// rules/structure.rule.ts
// ============================================================================
import { Injectable } from '@nestjs/common'
import { BalanceRule } from '../interfaces'
import { ValidationAccumulator } from '../engine/validation-accumulator'
import { BalanceValidationContext } from '../engine/validation-context'
import { RuleCategory, RuleCode } from '../engine/validation.enums'
import { ErrorFactory } from '../engine/error-factory'

@Injectable()
export class MinimumLinesRule implements BalanceRule {
  readonly code     = RuleCode.INSUFFICIENT_LINES
  readonly category = RuleCategory.STRUCTURE
  readonly priority = 10
  readonly isAsync  = false

  constructor(private readonly factory: ErrorFactory) {}

  execute(ctx: BalanceValidationContext, acc: ValidationAccumulator): void {
    if (ctx.lines.length < 2) {
      acc.push(this.factory.insufficientLines(ctx.lines.length))
    }
  }
}

// ============================================================================
// rules/amount.rule.ts
// ============================================================================
@Injectable()
export class NoNegativeAmountsRule implements BalanceRule {
  readonly code     = RuleCode.NEGATIVE_DEBIT  // representative code
  readonly category = RuleCategory.AMOUNT
  readonly priority = 20
  readonly isAsync  = false
  readonly dependsOn = [RuleCode.INSUFFICIENT_LINES]

  constructor(private readonly factory: ErrorFactory) {}

  execute(ctx: BalanceValidationContext, acc: ValidationAccumulator): void {
    for (const line of ctx.lines) {
      if (line.debit < 0)  acc.push(this.factory.negativeDebit(line.id, line.debit))
      if (line.credit < 0) acc.push(this.factory.negativeCredit(line.id, line.credit))
      if (line.debit === 0 && line.credit === 0) {
        acc.push(this.factory.zeroLine(line.id))
      }
    }
  }
}

// ============================================================================
// rules/side.rule.ts
// ============================================================================
@Injectable()
export class SingleSideRule implements BalanceRule {
  readonly code     = RuleCode.DOUBLE_SIDE
  readonly category = RuleCategory.SIDE
  readonly priority = 30
  readonly isAsync  = false
  readonly dependsOn = [RuleCode.NEGATIVE_DEBIT]

  constructor(private readonly factory: ErrorFactory) {}

  execute(ctx: BalanceValidationContext, acc: ValidationAccumulator): void {
    for (const line of ctx.lines) {
      if (line.debit > 0 && line.credit > 0) {
        acc.push(this.factory.doubleSide(line.id, line.debit, line.credit))
      }
    }
  }
}

// ============================================================================
// rules/precision.rule.ts
// ============================================================================
@Injectable()
export class PrecisionRule implements BalanceRule {
  readonly code     = RuleCode.PRECISION_EXCEEDED
  readonly category = RuleCategory.PRECISION
  readonly priority = 40
  readonly isAsync  = false

  constructor(private readonly factory: ErrorFactory) {}

  execute(ctx: BalanceValidationContext, acc: ValidationAccumulator): void {
    const maxDecimals = ctx.options.decimalPrecision

    for (const line of ctx.lines) {
      for (const field of ['debit', 'credit'] as const) {
        const raw = line[field].toString()
        const decimalPart = raw.split('.')[1]
        if (decimalPart && decimalPart.replace(/0+$/, '').length > maxDecimals) {
          acc.push(this.factory.precisionExceeded(line.id, field, line[field], maxDecimals))
        }
      }
    }
  }
}

// ============================================================================
// rules/duplicate.rule.ts
// ============================================================================
@Injectable()
export class DuplicateLineRule implements BalanceRule {
  readonly code     = RuleCode.DUPLICATE_LINE
  readonly category = RuleCategory.INTEGRITY
  readonly priority = 50
  readonly isAsync  = false

  constructor(private readonly factory: ErrorFactory) {}

  execute(ctx: BalanceValidationContext, acc: ValidationAccumulator): void {
    const seen = new Map<string, string>() // signature -> lineId

    for (const line of ctx.lines) {
      const sig = `${line.accountId}|${line.debit}|${line.credit}|${line.currencyCode ?? ''}`
      const existing = seen.get(sig)
      if (existing) {
        acc.push(this.factory.duplicateLine(line.id, existing))
      } else {
        seen.set(sig, line.id)
      }
    }
  }
}

// ============================================================================
// rules/balance.rule.ts
// ============================================================================
@Injectable()
export class BalancedTotalsRule implements BalanceRule {
  readonly code     = RuleCode.BALANCE_NOT_EQUAL
  readonly category = RuleCategory.BALANCE
  readonly priority = 60
  readonly isAsync  = false
  readonly dependsOn = [RuleCode.DOUBLE_SIDE, RuleCode.NEGATIVE_DEBIT]

  constructor(private readonly factory: ErrorFactory) {}

  execute(ctx: BalanceValidationContext, acc: ValidationAccumulator): void {
    const { tolerance, allowAutoBalance, autoBalanceThreshold } = ctx.options
    const difference = ctx.difference

    if (difference <= tolerance) return

    if (allowAutoBalance && difference <= autoBalanceThreshold) {
      acc.push(this.factory.autoBalanceApplied(difference, autoBalanceThreshold))
    } else {
      acc.push(
        this.factory.balanceNotEqual(ctx.totalDebit, ctx.totalCredit, difference, tolerance),
      )
    }
  }
}
