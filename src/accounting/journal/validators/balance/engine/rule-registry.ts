// ============================================================================
// engine/rule-registry.ts
// رجیستری قوانین با مدیریت dependency و اولویت
// ============================================================================

import { Injectable, Logger } from '@nestjs/common'
import { BalanceRule } from '../interfaces'
import { RuleCode } from './validation.enums'

@Injectable()
export class RuleRegistry {
  private readonly logger = new Logger(RuleRegistry.name)
  private readonly rules = new Map<RuleCode, BalanceRule>()
  private readonly disabled = new Set<RuleCode>()

  register(rule: BalanceRule): void {
    if (this.rules.has(rule.code)) {
      throw new Error(`Duplicate rule code: ${rule.code}`)
    }
    this.rules.set(rule.code, rule)
    this.logger.debug(`Rule registered: ${rule.code} (priority=${rule.priority})`)
  }

  registerMany(rules: BalanceRule[]): void {
    for (const rule of rules) this.register(rule)
  }

  enable(code: RuleCode): void  { this.disabled.delete(code) }
  disable(code: RuleCode): void { this.disabled.add(code) }

  unregister(code: RuleCode): void { this.rules.delete(code) }

  /**
   * برگرداندن قوانین مرتب‌شده بر اساس dependency و اولویت.
   * ابتدا dependency ها resolve می‌شوند (Topological Sort)،
   * سپس درون هر گروه بر اساس priority مرتب می‌شوند.
   */
  getOrdered(disabledCodes: RuleCode[] = []): BalanceRule[] {
    const allDisabled = new Set([...this.disabled, ...disabledCodes])
    const eligible = [...this.rules.values()].filter((r) => !allDisabled.has(r.code))

    return this.topologicalSort(eligible)
  }

  private topologicalSort(rules: BalanceRule[]): BalanceRule[] {
    const ruleMap = new Map(rules.map((r) => [r.code, r]))
    const visited = new Set<RuleCode>()
    const result: BalanceRule[] = []

    const visit = (rule: BalanceRule) => {
      if (visited.has(rule.code)) return
      visited.add(rule.code)

      // ابتدا dependency ها
      for (const dep of rule.dependsOn ?? []) {
        const depRule = ruleMap.get(dep)
        if (depRule) visit(depRule)
        // اگر dependency موجود نبود، لاگ می‌کنیم ولی ادامه می‌دهیم
        else this.logger.warn(`Rule ${rule.code} depends on ${dep} which is not registered`)
      }

      result.push(rule)
    }

    // مرتب‌سازی اولیه بر اساس priority قبل از topological sort
    const sorted = [...rules].sort((a, b) => a.priority - b.priority)
    for (const rule of sorted) visit(rule)

    return result
  }
}
