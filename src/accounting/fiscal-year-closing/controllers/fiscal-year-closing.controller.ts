import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';



import { FiscalYearClosingService } from '../services/fiscal-year-closing.service';
import { ClosingJournalService } from '../services/closing-journal.service';
import { RetainedEarningsService } from '../services/retained-earnings.service';
import { Permissions } from 'src/auth/decorators/permisions.decorator';
import {
    CloseFiscalYearDto,
    ReopenFiscalYearDto,
    FiscalYearClosingQueryDto,
    ClosingPreviewQueryDto,
    CreateClosingJournalDto,
} from '../dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
// ─── Swagger decorators (استفاده مجدد یا inline) ────────────────────────────

import { CurrentOrg } from 'src/common/decorators/current-org.decorator';

@Controller('accounting/fiscal-year-closings')
@UseGuards(JwtAuthGuard)
export class FiscalYearClosingController {
    constructor(
        private readonly closingService: FiscalYearClosingService,
        private readonly closingJournalService: ClosingJournalService,
        private readonly retainedEarningsService: RetainedEarningsService,
    ) { }

    @Post('preview')
    preview(
        @Body() dto: ClosingPreviewQueryDto,
        @CurrentOrg() organizationId: string,
    ) {
        return this.closingService.preview(
            dto.fiscalYearId,
            organizationId,
        );
    }

    @Get('retained-earnings')
    getRetainedEarnings(
        @Query('fiscalYearId') fiscalYearId: string,
    ) {
        return this.retainedEarningsService.calculate(fiscalYearId);
    }

    @Get('closing-journal/build')
    buildClosingJournal(
        @Query('fiscalYearId') fiscalYearId: string,
        @CurrentUser('ud') userId: string,
    ) {
        return this.closingJournalService.buildClosingJournal(
            fiscalYearId,
            userId,
        );
    }

    @Post('closing-journal')
    createClosingJournal(
        @Body() dto: CreateClosingJournalDto,
        @CurrentUser() userId: string,
    ) {
        return this.closingJournalService.createClosingEntry(
            dto.fiscalYearId,
            dto.organizationId,
            userId,
            dto.retainedEarningsAccountId,
        );
    }

    @Post('close')
    close(
        @Body() dto: CloseFiscalYearDto,
        @CurrentOrg() organizationId: string,
        @CurrentUser() userId: string,
    ) {
        return this.closingService.close(
            dto.fiscalYearId,
            organizationId,
            userId,
        );
    }

    @Post('reopen')
    reopen(
        @Body() dto: ReopenFiscalYearDto,
        @CurrentOrg() organizationId: string,
    ) {
        return this.closingService.reopen(
            dto.fiscalYearId,
            organizationId,
        );
    }
}
