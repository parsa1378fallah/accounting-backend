import {
    Controller,
    Get,
    Param,
    Query,
} from '@nestjs/common';

import { JournalEntryStatus } from '@prisma/client';

import { JournalQueryService } from '../services/journal-query.service';
import { JournalApprovalService } from '../services/journal-approval.service';

@Controller('journal-history')
export class JournalHistoryController {
    constructor(
        private readonly journalQueryService: JournalQueryService,
        private readonly journalApprovalService: JournalApprovalService,
    ) { }

    @Get(':id/approvals')
    getApprovalHistory(@Param('id') journalId: string) {
        return this.journalApprovalService.getApprovalHistory(journalId);
    }

    @Get('organizations/:organizationId/count')
    count(
        @Param('organizationId') organizationId: string,
        @Query('status') status?: JournalEntryStatus,
    ) {
        return this.journalQueryService.count(organizationId, status);
    }

    @Get('organizations/:organizationId/last')
    getLastJournal(@Param('organizationId') organizationId: string) {
        return this.journalQueryService.getLastJournal(organizationId);
    }

    @Get(':id/exists')
    exists(@Param('id') id: string) {
        return this.journalQueryService.exists(id);
    }
}
