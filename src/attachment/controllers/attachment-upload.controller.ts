import {
    Body,
    Controller,
    Param,
    Post,
    UploadedFile,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {
    FileInterceptor,
    FilesInterceptor,
} from '@nestjs/platform-express';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

import { AttachmentUploadService } from '../services/attachment-upload.service';
import { DuplicateAttachmentDto } from '../dto/duplicate-attachment.dto';

@UseGuards(JwtAuthGuard)
@Controller('attachments')
export class AttachmentUploadController {
    constructor(
        private readonly uploadService: AttachmentUploadService,
    ) { }

    //--------------------------------------------------
    // Upload single file
    //--------------------------------------------------

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    upload(
        @UploadedFile() file: Express.Multer.File,
        @CurrentUser('organizationId') organizationId: string,
    ) {
        return this.uploadService.upload(file, organizationId);
    }

    //--------------------------------------------------
    // Upload multiple files
    //--------------------------------------------------

    @Post('upload/bulk')
    @UseInterceptors(FilesInterceptor('files', 20))
    uploadMany(
        @UploadedFiles() files: Express.Multer.File[],
        @CurrentUser('organizationId') organizationId: string,
    ) {
        return this.uploadService.uploadMany(files, organizationId);
    }

    //--------------------------------------------------
    // Replace existing attachment with a new file
    //--------------------------------------------------

    @Post(':id/replace')
    @UseInterceptors(FileInterceptor('file'))
    replace(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.uploadService.replace(id, file);
    }

    //--------------------------------------------------
    // Duplicate (DB-only clone, no file copy) and link to another entity
    //--------------------------------------------------

    @Post(':id/duplicate')
    duplicate(
        @Param('id') id: string,
        @Body() dto: DuplicateAttachmentDto,
    ) {
        return this.uploadService.duplicate(id, dto.targetEntityId);
    }
}
