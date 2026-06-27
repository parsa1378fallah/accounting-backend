// ============================================================================
// engine/validation-result.ts
// ============================================================================

import { RuleCategory, RuleCode, ValidationSeverity } from './validation.enums'

export interface ValidationIssue {
  readonly code: RuleCode
  readonly category: RuleCategory
  readonly severity: ValidationSeverity
  /** کلید ترجمه برای i18n — FrontEnd از این استفاده می‌کند */
  readonly messageKey: string
  /** پیام آماده فارسی (برای لاگ و Exception سریع) */
  readonly messageFa: string
  /** پیام آماده انگلیسی */
  readonly messageEn: string
  readonly lineId?: string
  readonly meta?: Readonly<Record<string, unknown>>
}

export type ValidationError   = ValidationIssue & { severity: ValidationSeverity.ERROR | ValidationSeverity.CRITICAL }
export type ValidationWarning = ValidationIssue & { severity: ValidationSeverity.WARNING | ValidationSeverity.INFO }

export interface ValidationSummary {
  readonly totalLines: number
  readonly totalDebit: number
  readonly totalCredit: number
  readonly difference: number
  readonly currenciesInvolved: readonly string[]
  readonly executedRules: readonly RuleCode[]
  readonly skippedRules: readonly RuleCode[]
  readonly errorCount: number
  readonly warningCount: number
  readonly durationMs: number
}

export interface ValidationResult {
  readonly valid: boolean
  readonly errors: readonly ValidationError[]
  readonly warnings: readonly ValidationWarning[]
  readonly summary: ValidationSummary
}
