import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AttachmentSummaryService } from '../services/attachment-summary.service';

@UseGuards(JwtAuthGuard)
@Controller('attachments/summary')
export class AttachmentSummaryController {
    constructor(
        private readonly summaryService: AttachmentSummaryService,
    ) {}

    //--------------------------------------------------
    // Storage summary for an organization:
    // total/deleted/public/private counts, total & average
    // size, breakdown by mime type and extension
    //--------------------------------------------------

    @Get(':organizationId')
    getSummary(@Param('organizationId') organizationId: string) {
        return this.summaryService.getSummary(organizationId);
    }
}
