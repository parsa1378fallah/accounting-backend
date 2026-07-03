import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';

import { FiscalYearClosingController } from './controllers/fiscal-year-closing.controller';

import { FiscalYearClosingService } from './services/fiscal-year-closing.service';
import { ClosingJournalService } from './services/closing-journal.service';
import { RetainedEarningsService } from './services/retained-earnings.service';

import {
  FiscalYearExistsValidator,
  FiscalYearOpenValidator,
  FiscalYearNotClosedValidator,
  FiscalYearAlreadyClosedValidator,
  OrganizationMatchesValidator,
  NoPendingJournalApprovalsValidator,
  NoUnbalancedJournalEntriesValidator,
  NoUnpostedJournalEntriesValidator,
  RetainedEarningsAccountExistsValidator,
  ClosingJournalExistsValidator,
  ClosingJournalNotExistsValidator,
  JournalEntryBalancedValidator,
  CanReopenFiscalYearValidator,
  FiscalYearClosingExistsValidator,
} from './validators';

import { FiscalYearClosingMapper } from './mappers/fiscal-year-closing.mapper';

@Module({
  imports: [
    PrismaModule,
  ],

  controllers: [
    FiscalYearClosingController,
  ],

  providers: [
    // =========================
    // SERVICES
    // =========================
    FiscalYearClosingService,
    ClosingJournalService,
    RetainedEarningsService,

    // =========================
    // MAPPER
    // =========================
    FiscalYearClosingMapper,

    // =========================
    // VALIDATORS
    // =========================
    FiscalYearExistsValidator,
    FiscalYearOpenValidator,
    FiscalYearNotClosedValidator,
    FiscalYearAlreadyClosedValidator,
    OrganizationMatchesValidator,
    NoPendingJournalApprovalsValidator,
    NoUnbalancedJournalEntriesValidator,
    NoUnpostedJournalEntriesValidator,
    RetainedEarningsAccountExistsValidator,
    ClosingJournalExistsValidator,
    ClosingJournalNotExistsValidator,
    JournalEntryBalancedValidator,
    CanReopenFiscalYearValidator,
    FiscalYearClosingExistsValidator,
  ],

  exports: [
    FiscalYearClosingService,
    ClosingJournalService,
    RetainedEarningsService,
  ],
})
export class FiscalYearClosingModule { }