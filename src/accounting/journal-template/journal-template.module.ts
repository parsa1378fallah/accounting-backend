// src/modules/accounting/journal-template/journal-template.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { PrismaModule } from 'src/prisma/prisma.module';

import { JournalTemplateController } from './controllers/journal-template.controller';
import { JournalTemplateService } from './services/journal-template.service';
import { JournalTemplateResolverService } from './services/journal-template-resolver.service';
import { RecurringJournalService } from './services/recurring-journal.service';

import { JournalTemplateRepository } from './repositories/journal-template.repository';
import { TemplateBalanceValidator } from './validators/template-balance.validator';
import { AmountCalculationStrategyFactory } from './strategies/amount-calculation.strategy';
import { RecurringFrequencyStrategyFactory } from './strategies/recurring-frequency.strategy';

import { JournalModule } from '../journal/journal.module';
import { FiscalYearModule } from 'src/fiscal-year/fiscal-year.module';

import { RECURRING_JOURNAL_QUEUE } from './constants/journal-template.constants';
import { RecurringJournalProcessor } from './jobs/recurring-journal.processor';

@Module({
  imports: [
    PrismaModule,
    EventEmitterModule,

    // Queue برای اجرای اسناد تکراری
    BullModule.registerQueue({
      name: RECURRING_JOURNAL_QUEUE,
    }),

    // ماژول‌های وابسته
    forwardRef(() => JournalModule),
    forwardRef(() => FiscalYearModule),
  ],

  controllers: [
    JournalTemplateController,
  ],

  providers: [
    // Services
    JournalTemplateService,
    JournalTemplateResolverService,
    RecurringJournalService,

    // Repository
    JournalTemplateRepository,

    // Validators
    TemplateBalanceValidator,

    // Strategies
    AmountCalculationStrategyFactory,
    RecurringFrequencyStrategyFactory,

    // Jobs (BullMQ)
    RecurringJournalProcessor,
  ],

  exports: [
    JournalTemplateService,
    JournalTemplateResolverService,
    RecurringJournalService,
    JournalTemplateRepository,
  ],
})
export class JournalTemplateModule { }