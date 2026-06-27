import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';



import { JournalEntriesController } from './controllers/journal-entries.controller';
import { JournalPostingController } from './controllers/journal-posting.controller';
import { JournalApprovalController } from './controllers/journal-approval.controller';
import { JournalReversalController } from './controllers/journal-reversal.controller';
import { JournalHistoryController } from './controllers/journal-history.controller';

// import { JournalService } from './journal.service';

import { JournalEntryService } from './services/journal-entry.service';
import { JournalLineService } from './services/journal-line.service';
import { JournalPostingService } from './services/journal-posting.service';
import { JournalApprovalService } from './services/journal-approval.service';
import { JournalReversalService } from './services/journal-reversal.service';
import { JournalValidationService } from './services/journal-validation.service';
import { JournalLockService } from './services/journal-lock.service';
import { JournalNumberService } from './services/journal-number.service';
import { JournalQueryService } from './services/journal-query.service';
import { JournalValidationModule } from './validators/balance/journal-validation.module';
import { JournalBalanceValidator } from './validators/domains/journal-balance.validator';

// import { JournalRepository } from './repositories/journal.repository';

@Module({
    imports: [
        PrismaModule,
        JournalValidationModule
    ],

    controllers: [
        // JournalController,
        JournalEntriesController,
        JournalPostingController,
        JournalApprovalController,
        JournalReversalController,
        JournalHistoryController,
    ],

    providers: [
        // JournalService,

        // JournalRepository,

        JournalEntryService,
        JournalLineService,
        JournalPostingService,
        JournalApprovalService,
        JournalReversalService,
        JournalValidationService,
        JournalLockService,
        JournalNumberService,
        JournalQueryService,
        JournalBalanceValidator,
    ],

    exports: [
        // JournalService,
        // JournalRepository,
        JournalEntryService,
        JournalPostingService,
        JournalValidationService,
        JournalQueryService,
    ],
})
export class JournalModule { }