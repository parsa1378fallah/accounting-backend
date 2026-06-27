// ============================================================================
// journal-validation.module.ts
// ============================================================================

import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma/prisma.module'

import { ErrorFactory }    from './engine/error-factory'
import { RuleRegistry }    from './engine/rule-registry'
import { ValidationEngine } from './engine/validation-engine'
import { SummaryBuilder }  from './engine/summary-builder'

import {
  MinimumLinesRule,
  NoNegativeAmountsRule,
  SingleSideRule,
  PrecisionRule,
  DuplicateLineRule,
  BalancedTotalsRule,
} from './rules/sync.rules'
import { MultiCurrencyBalanceRule } from './rules/currency.rule'

import { EXCHANGE_RATE_PROVIDER }      from './interfaces'
import { PrismaExchangeRateProvider }  from './providers/prisma-exchange-rate.provider'
import { JournalLineMapper }           from './providers/journal-line.mapper'

import { JournalBalanceValidator } from './journal-balance.validator'

@Module({
  imports: [PrismaModule],
  providers: [
    // Engine
    ErrorFactory,
    RuleRegistry,
    ValidationEngine,
    SummaryBuilder,

    // Rules
    MinimumLinesRule,
    NoNegativeAmountsRule,
    SingleSideRule,
    PrecisionRule,
    DuplicateLineRule,
    BalancedTotalsRule,
    MultiCurrencyBalanceRule,

    // Provider (قابل swap برای تست)
    {
      provide:  EXCHANGE_RATE_PROVIDER,
      useClass: PrismaExchangeRateProvider,
    },

    // Mapper
    JournalLineMapper,

    // Main validator
    JournalBalanceValidator,
  ],
  exports: [
    JournalBalanceValidator,
    JournalLineMapper,
  ],
})
export class JournalValidationModule {}
