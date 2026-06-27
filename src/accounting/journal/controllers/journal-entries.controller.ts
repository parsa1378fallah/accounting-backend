import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common';

import { JournalEntryService } from '../services/journal-entry.service';
import { JournalLineService } from '../services/journal-line.service';
import { JournalQueryService } from '../services/journal-query.service';

import { CreateJournalEntryDto } from '../dto/create-journal-entry.dto';
import { CreateJournalLineDto } from '../dto/create-journal-line.dto';
import { UpdateJournalLineDto } from '../dto/update-journal-line.dto';
import { JournalQueryDto } from '../dto/journal-query.dto';

@Controller('journal-entries')
export class JournalEntriesController {
    constructor(
        private readonly journalEntryService: JournalEntryService,
        private readonly journalLineService: JournalLineService,
        private readonly journalQueryService: JournalQueryService,
    ) { }

    /* =========================================================
       Journal Entry (Header)
    ========================================================= */

    @Post()
    create(@Body() dto: CreateJournalEntryDto) {
        return this.journalEntryService.createJournalEntry(dto);
    }

    @Get()
    find(@Query() query: JournalQueryDto) {
        return this.journalQueryService.find(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.journalQueryService.findById(id);
    }

    @Delete(':id')
    deleteDraft(@Param('id') id: string) {
        return this.journalEntryService.deleteDraftJournal(id);
    }

    /* =========================================================
       Journal Lines
    ========================================================= */

    @Get(':id/lines')
    getLines(@Param('id') journalId: string) {
        return this.journalLineService.getLines(journalId);
    }

    @Post(':id/lines')
    addLine(
        @Param('id') journalId: string,
        @Body() dto: CreateJournalLineDto,
    ) {
        return this.journalLineService.addLine(journalId, dto);
    }

    @Patch(':id/lines/:lineId')
    updateLine(
        @Param('lineId') lineId: string,
        @Body() dto: UpdateJournalLineDto,
    ) {
        return this.journalLineService.updateLine(lineId, dto);
    }

    @Delete(':id/lines/:lineId')
    deleteLine(@Param('lineId') lineId: string) {
        return this.journalLineService.deleteLine(lineId);
    }

    @Patch(':id/lines')
    replaceLines(
        @Param('id') journalId: string,
        @Body() lines: CreateJournalLineDto[],
    ) {
        return this.journalLineService.replaceLines(journalId, lines);
    }

    @Patch(':id/lines/reorder')
    reorderLines(
        @Param('id') journalId: string,
        @Body() ids: string[],
    ) {
        return this.journalLineService.reorder(journalId, ids);
    }
}
