import {
    Body,
    Controller,
    Get,
    Param,
    Post,
} from '@nestjs/common';

import { JournalApprovalService } from '../services/journal-approval.service';

@Controller('journal-entries/:id/approvals')
export class JournalApprovalController {
    constructor(
        private readonly journalApprovalService: JournalApprovalService,
    ) { }

    @Post('submit')
    submitForApproval(@Param('id') journalId: string) {
        return this.journalApprovalService.submitForApproval(journalId);
    }

    @Post('approve')
    approve(
        @Param('id') journalId: string,
        @Body('approverId') approverId: string,
        @Body('comment') comment?: string,
    ) {
        return this.journalApprovalService.approve(
            journalId,
            approverId,
            comment,
        );
    }

    @Post('reject')
    reject(
        @Param('id') journalId: string,
        @Body('approverId') approverId: string,
        @Body('reason') reason: string,
    ) {
        return this.journalApprovalService.reject(
            journalId,
            approverId,
            reason,
        );
    }

    @Get()
    getHistory(@Param('id') journalId: string) {
        return this.journalApprovalService.getApprovalHistory(journalId);
    }
}
