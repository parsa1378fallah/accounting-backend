// ============================================================================
// engine/validation-engine.ts
// مسئولیت تنها: اجرای pipeline قوانین و جمع‌آوری نتایج
// هیچ Business Logic ای اینجا نیست
// ============================================================================

import { Injectable, Logger } from '@nestjs/common'
import { BalanceRule } from '../interfaces'
import { ValidationAccumulator } from './validation-accumulator'
import { BalanceValidationContext } from './validation-context'
import { ValidationSeverity } from './validation.enums'
import { ErrorFactory } from './error-factory'

@Injectable()
export class ValidationEngine {
  private readonly logger = new Logger(ValidationEngine.name)

  constructor(private readonly errorFactory: ErrorFactory) {}

  /**
   * اجرای ترتیبی همه قوانین (sync و async) با مدیریت خطا.
   * قوانین async به صورت موازی اجرا نمی‌شوند چون ممکن است
   * به نتیجه قانون قبلی وابسته باشند (dependency).
   */
  async execute(
    rules: BalanceRule[],
    ctx: BalanceValidationContext,
  ): Promise<ValidationAccumulator> {
    const acc = new ValidationAccumulator()

    for (const rule of rules) {
      // skip اگر در disabledRules باشد
      if (ctx.options.disabledRules?.includes(rule.code as string)) continue
      // skip اگر category غیرفعال باشد
      if (ctx.options.disabledCategories?.includes(rule.category)) continue

      try {
        await rule.execute(ctx, acc)
      } catch (err) {
        this.logger.error(
          `Rule ${rule.code} threw an unexpected error`,
          (err as Error).stack,
        )
        acc.push(this.errorFactory.ruleExecutionFailed(rule.code, rule.category))
      }

      // fail-fast: توقف بعد از اولین CRITICAL خطا
      if (
        ctx.options.throwOnFirstError &&
        acc.errors.some((e) => e.severity === ValidationSeverity.CRITICAL)
      ) {
        this.logger.warn(`Pipeline halted after CRITICAL error from rule ${rule.code}`)
        break
      }
    }

    return acc
  }
}
