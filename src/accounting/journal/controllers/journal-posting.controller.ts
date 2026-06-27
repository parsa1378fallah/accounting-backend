import {
    Body,
    Controller,
    Get,
    Param,
    Post,
} from '@nestjs/common';

import { JournalPostingService } from '../services/journal-posting.service';
import { JournalLockService } from '../services/journal-lock.service';

@Controller('journal-entries/:id/posting')
export class JournalPostingController {
    constructor(
        private readonly journalPostingService: JournalPostingService,
        private readonly journalLockService: JournalLockService,
    ) { }

    @Post()
    post(
        @Param('id') journalId: string,
        @Body('postedById') postedById: string,
    ) {
        return this.journalPostingService.post(journalId, postedById);
    }

    @Get('can-post')
    canPost(@Param('id') journalId: string) {
        return this.journalPostingService.canPost(journalId);
    }

    @Get()
    getInfo(@Param('id') journalId: string) {
        return this.journalPostingService.getPostingInfo(journalId);
    }

    @Post('lock')
    lock(@Param('id') journalId: string) {
        return this.journalLockService.lock(journalId);
    }

    @Post('unlock')
    unlock(@Param('id') journalId: string) {
        return this.journalLockService.unlock(journalId);
    }
}
