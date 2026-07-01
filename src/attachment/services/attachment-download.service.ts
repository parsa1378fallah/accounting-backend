import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { Response } from 'express';

import { AttachmentRepository } from '../repositories/attachment.repository';

import { AttachmentStreamService } from './attachment-stream.service';

@Injectable()
export class AttachmentDownloadService {
    constructor(
        private readonly repository: AttachmentRepository,
        private readonly streamService: AttachmentStreamService,
    ) { }

    //--------------------------------------------------
    // DOWNLOAD
    //--------------------------------------------------

    async download(
        id: string,
        res: Response,
        range?: string,
    ) {
        const file =
            await this.repository.findById(id);

        if (!file) {
            throw new NotFoundException('File not found');
        }

        res.setHeader(
            'Content-Disposition',
            `inline; filename="${file.fileName}"`,
        );

        return this.streamService.stream(
            file.path,
            res,
            file.mimeType,
            range,
        );
    }

    //--------------------------------------------------
    // PREVIEW
    //--------------------------------------------------

    async preview(
        id: string,
        res: Response,
    ) {

        const file =
            await this.repository.findById(id);

        if (!file) {
            throw new NotFoundException(
                'File not found',
            );
        }

        const isPreviewable =
            file.mimeType.startsWith('image/') ||
            file.mimeType === 'application/pdf';

        if (!isPreviewable) {
            return this.download(id, res);
        }

        return this.streamService.stream(
            file.path,
            res,
            file.mimeType,
        );
    }
}