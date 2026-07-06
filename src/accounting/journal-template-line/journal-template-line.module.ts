import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { BullModule } from '@nestjs/bullmq';
import { EventEmitterModule } from '@nestjs/event-emitter';

// Controllers
import { JournalTemplateLineController } from './presentation/controllers/journal-template-line.controller';
import { JournalTemplateLineBulkController } from './presentation/controllers/journal-template-line-bulk.controller';

// Commands & Queries
import { CreateJournalTemplateLineUseCase } from './application/use-cases/create-journal-template-line.use-case';
import { UpdateJournalTemplateLineUseCase } from './application/use-cases/update-journal-template-line.use-case';
import { DeleteJournalTemplateLineUseCase } from './application/use-cases/delete-journal-template-line.use-case';
import { GetJournalTemplateLineUseCase } from './application/use-cases/get-journal-template-line.use-case';
import { ListJournalTemplateLinesUseCase } from './application/use-cases/list-journal-template-lines.use-case';
import { BulkCreateJournalTemplateLinesUseCase } from './application/use-cases/bulk-create-journal-template-lines.use-case';
import { ReorderJournalTemplateLinesUseCase } from './application/use-cases/reorder-journal-template-lines.use-case';
import { PreviewCalculationUseCase } from './application/use-cases/preview-calculation.use-case';

// Application Services
import { JournalTemplateLineService } from './application/services/journal-template-line.service';
import { FormulaCalculatorService } from './application/services/formula-calculator.service';
import { AmountCalculatorService } from './application/services/amount-calculator.service';
import { JournalTemplateLineValidatorService } from './application/services/journal-template-line-validator.service';
import { JournalTemplateLineCacheService } from './application/services/journal-template-line-cache.service';
import { TemplateLineSorterService } from './application/services/template-line-sorter.service';

// Mappers
import { JournalTemplateLineMapper } from './application/mappers/journal-template-line.mapper';
import { CalculationResultMapper } from './application/mappers/calculation-result.mapper';

// Factories
import { JournalTemplateLineFactory } from './application/factories/journal-template-line.factory';

// Job Handlers
import { TemplateSyncJobHandler } from './application/jobs/formula-validation.job';
import { FormulaValidationJobHandler } from './application/jobs/template-line-sync.job';

// Infrastructure - Calculations
import { FormulaEvaluatorService } from './infrastructure/calculations/formula-evaluator.service';
import { ExpressionParserService } from './infrastructure/calculations/expression-parser.service';
import { CalculationEngineService } from './infrastructure/calculations/calculation-engine.service';
import { RoundingStrategyService } from './infrastructure/calculations/rounding-strategy.service';

// Infrastructure - Validators
import { AccountValidatorService } from './infrastructure/validators/account-validator.service';
import { CostCenterValidatorService } from './infrastructure/validators/cost-center-validator.service';
import { ProjectValidatorService } from './infrastructure/validators/project-validator.service';
import { CurrencyValidatorService } from './infrastructure/validators/currency-validator.service';
import { FormulaSyntaxValidatorService } from './infrastructure/validators/formula-syntax-validator.service';

// Infrastructure - Cache
import { TemplateCacheService } from './infrastructure/cache/template-line-cache.service';
import { RedisTemplateCacheService } from './infrastructure/cache/redis-template-line-cache.service';

// Infrastructure - Events
import { TemplateLineEventPublisher } from './infrastructure/events/template-line-event.publisher';

// Infrastructure - Queue
import { TemplateLineQueueService } from './infrastructure/events/template-line-queue.service';

// Infrastructure - Persistence
import { PrismaJournalTemplateLineRepository } from './infrastructure/persistence/repositories/prisma-journal-template-line.repository';
import { CalculationCacheRepositoryImpl } from './infrastructure/persistence/repositories/calculation-cache.repository';
import { JournalTemplateLPersistenceMapper } from './infrastructure/persistence/mappers/journal-template-line-persistence.mapper';

// Policies
import { FormulaCalculationPolicy } from './domain/policies/formula-calculation.policy';
import { AmountDistributionPolicy } from './domain/policies/amount-distribution.policy';
import { DebitCreditBalancePolicy } from './domain/policies/debit-credit-balance.policy';

// Config
import journalTemplateLineConfig from './config/journal-template-line.config';
import formulaEngineConfig from './config/formula-engine.config';
import calculationConfig from './config/calculation.config';

// DTOs & Mappers
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forFeature(journalTemplateLineConfig),
    ConfigModule.forFeature(formulaEngineConfig),
    ConfigModule.forFeature(calculationConfig),
    CqrsModule,
    EventEmitterModule.forRoot(),
    BullModule.registerQueue({
      name: 'journal-template-line',
      defaultJobOptions: {
        removeOnComplete: true,
        attempts: 3,
      },
    }),
  ],
  controllers: [
    JournalTemplateLineController,
    JournalTemplateLineBulkController,
  ],
  providers: [
    // Use Cases
    CreateJournalTemplateLineUseCase,
    UpdateJournalTemplateLineUseCase,
    DeleteJournalTemplateLineUseCase,
    GetJournalTemplateLineUseCase,
    ListJournalTemplateLinesUseCase,
    BulkCreateJournalTemplateLinesUseCase,
    ReorderJournalTemplateLinesUseCase,
    PreviewCalculationUseCase,

    // Services
    JournalTemplateLineService,
    FormulaCalculatorService,
    AmountCalculatorService,
    JournalTemplateLineValidatorService,
    JournalTemplateLineCacheService,
    TemplateLineSorterService,

    // Mappers
    JournalTemplateLineMapper,
    CalculationResultMapper,
    JournalTemplateLPersistenceMapper,

    // Factories
    JournalTemplateLineFactory,

    // Event Handlers
    TemplateSyncJobHandler,
    FormulaValidationJobHandler,

    // Calculation Services
    FormulaEvaluatorService,
    ExpressionParserService,
    CalculationEngineService,
    RoundingStrategyService,

    // Validators
    AccountValidatorService,
    CostCenterValidatorService,
    ProjectValidatorService,
    CurrencyValidatorService,
    FormulaSyntaxValidatorService,

    // Cache
    TemplateCacheService,
    RedisTemplateCacheService,

    // Events
    TemplateLineEventPublisher,

    // Queue
    TemplateLineQueueService,

    // Persistence
    {
      provide: 'JOURNAL_TEMPLATE_LINE_REPOSITORY',
      useClass: PrismaJournalTemplateLineRepository,
    },
    {
      provide: 'CALCULATION_CACHE_REPOSITORY',
      useClass: CalculationCacheRepositoryImpl,
    },

    // Policies
    FormulaCalculationPolicy,
    AmountDistributionPolicy,
    DebitCreditBalancePolicy,

    // Database
    PrismaService,
  ],
  exports: [
    JournalTemplateLineService,
    FormulaCalculatorService,
    AmountCalculatorService,
    CalculationEngineService,
    'JOURNAL_TEMPLATE_LINE_REPOSITORY',
  ],
})
export class JournalTemplateLineModule { }