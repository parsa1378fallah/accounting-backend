import {
    Body,
    Controller,
    Get,
    Param,
    Post,
} from '@nestjs/common';

import { JournalReversalService } from '../services/journal-reversal.service';

@Controller('journal-entries/:id/reversal')
export class JournalReversalController {
    constructor(
        private readonly journalReversalService: JournalReversalService,
    ) { }

    @Post()
    reverse(
        @Param('id') journalId: string,
        @Body('reversalDate') reversalDate: string,
    ) {
        return this.journalReversalService.reverse(
            journalId,
            new Date(reversalDate),
        );
    }

    @Get('can-reverse')
    canReverse(@Param('id') journalId: string) {
        return this.journalReversalService.canReverse(journalId);
    }

    @Get()
    getReversal(@Param('id') journalId: string) {
        return this.journalReversalService.getReversal(journalId);
    }
}
