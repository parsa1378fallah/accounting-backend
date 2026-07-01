import {
    Controller,
    Get,
    Headers,
    Param,
    Res,
    UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AttachmentDownloadService } from '../services/attachment-download.service';

@UseGuards(JwtAuthGuard)
@Controller('attachments')
export class AttachmentDownloadController {
    constructor(
        private readonly downloadService: AttachmentDownloadService,
    ) { }

    //--------------------------------------------------
    // Download — supports HTTP Range for video/audio
    //--------------------------------------------------

    @Get(':id/download')
    download(
        @Param('id') id: string,
        @Res() res: Response,
        @Headers('range') range?: string,
    ) {
        return this.downloadService.download(id, res, range);
    }

    //--------------------------------------------------
    // Inline preview — images/PDF render in browser,
    // anything else falls back to download
    //--------------------------------------------------

    @Get(':id/preview')
    preview(
        @Param('id') id: string,
        @Res() res: Response,
    ) {
        return this.downloadService.preview(id, res);
    }
}
