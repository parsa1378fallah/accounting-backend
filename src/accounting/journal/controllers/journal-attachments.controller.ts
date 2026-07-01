import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';

import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { JournalAttachmentsService } from '../services/journal-attachments.service';

import { AttachJournalAttachmentDto } from '../dto/attach-journal-attachment.dto';
import { ReplaceJournalAttachmentsDto } from '../dto/replace-journal-attachments.dto';

@ApiTags('Journal Attachments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('journal-entries/:journalEntryId/attachments')
export class JournalAttachmentsController {
    constructor(
        private readonly service: JournalAttachmentsService,
    ) { }

    //--------------------------------------------------
    // Attach
    //--------------------------------------------------

    @Post()
    @ApiOperation({
        summary: 'Attach file to journal entry',
    })
    attach(
        @Param('journalEntryId')
        journalEntryId: string,

        @Body()
        dto: AttachJournalAttachmentDto,
    ) {
        return this.service.attach(
            journalEntryId,
            dto.attachmentId,
        );
    }

    //--------------------------------------------------
    // List
    //--------------------------------------------------

    @Get()
    @ApiOperation({
        summary: 'List journal attachments',
    })
    list(
        @Param('journalEntryId')
        journalEntryId: string,
    ) {
        return this.service.list(
            journalEntryId,
        );
    }

    //--------------------------------------------------
    // Count
    //--------------------------------------------------

    @Get('count')
    @ApiOperation({
        summary: 'Count journal attachments',
    })
    count(
        @Param('journalEntryId')
        journalEntryId: string,
    ) {
        return this.service.count(
            journalEntryId,
        );
    }

    //--------------------------------------------------
    // Replace
    //--------------------------------------------------

    @Put()
    @ApiOperation({
        summary: 'Replace journal attachments',
    })
    replace(
        @Param('journalEntryId')
        journalEntryId: string,

        @Body()
        dto: ReplaceJournalAttachmentsDto,
    ) {
        return this.service.replace(
            journalEntryId,
            dto.attachmentIds,
        );
    }

    //--------------------------------------------------
    // Detach
    //--------------------------------------------------

    @Delete(':attachmentId')
    @ApiOperation({
        summary: 'Detach attachment from journal',
    })
    detach(
        @Param('journalEntryId')
        journalEntryId: string,

        @Param('attachmentId')
        attachmentId: string,
    ) {
        return this.service.detach(
            journalEntryId,
            attachmentId,
        );
    }
}