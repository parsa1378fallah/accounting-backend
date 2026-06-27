// ============================================================================
// engine/validation-accumulator.ts
// جمع‌آوری خطا و هشدار در طول pipeline — مستقل از نتیجه نهایی
// ============================================================================

import { ValidationError, ValidationWarning } from './validation-result'
import { ValidationSeverity } from './validation.enums'

export class ValidationAccumulator {
  private readonly _errors: ValidationError[]   = []
  private readonly _warnings: ValidationWarning[] = []

  get errors(): readonly ValidationError[]   { return this._errors }
  get warnings(): readonly ValidationWarning[] { return this._warnings }
  get hasErrors(): boolean { return this._errors.length > 0 }

  push(issue: ValidationError | ValidationWarning): void {
    if (
      issue.severity === ValidationSeverity.ERROR ||
      issue.severity === ValidationSeverity.CRITICAL
    ) {
      this._errors.push(issue as ValidationError)
    } else {
      this._warnings.push(issue as ValidationWarning)
    }
  }

  pushAll(issues: (ValidationError | ValidationWarning)[]): void {
    for (const issue of issues) this.push(issue)
  }

  toResult() {
    return { errors: [...this._errors], warnings: [...this._warnings] }
  }
}
