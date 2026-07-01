import { Injectable } from '@nestjs/common';

import { EventEmitter2 } from '@nestjs/event-emitter';

import { AttachmentRepository } from '../repositories/attachment.repository';
import { AttachmentValidationService } from './attachment-validation.service';
import { AttachmentChecksumService } from './attachment-checksum.service';

import { AttachmentPathService } from './attachment-path.service';
import { AttachmentMetadataService } from './attachment-metadata.service';
import { AttachmentMapper } from '../mappers/attachment.mapper';
import { AttachmentStorageService } from '../storage/attachment-storage.service';

@Injectable()
export class AttachmentUploadService {

    constructor(
        private readonly validationService: AttachmentValidationService,
        private readonly checksumService: AttachmentChecksumService,
        private readonly storageService: AttachmentStorageService,
        private readonly pathService: AttachmentPathService,
        private readonly metadataService: AttachmentMetadataService,
        private readonly repository: AttachmentRepository,
        private readonly mapper: AttachmentMapper,
        private readonly eventEmitter: EventEmitter2,
    ) { }

    //--------------------------------------------------
    // PUBLIC API
    //--------------------------------------------------

    async upload(
        file: Express.Multer.File,
        organizationId: string,
    ) {

        //--------------------------------------------------
        // 1. Validate
        //--------------------------------------------------

        this.validateFile(file);

        //--------------------------------------------------
        // 2. Calculate Buffer
        //--------------------------------------------------

        const buffer =
            file.buffer;

        //--------------------------------------------------
        // 3. Checksum (SHA256)
        //--------------------------------------------------

        const checksum =
            this.calculateChecksum(buffer);

        //--------------------------------------------------
        // 4. Deduplication Check
        //--------------------------------------------------

        const existing =
            await this.checkDuplicate(checksum);

        if (existing) {

            return this.buildResponse(existing);

        }

        //--------------------------------------------------
        // 5. Generate Storage Path
        //--------------------------------------------------

        const path =
            this.generatePath(
                organizationId,
                file.originalname,
            );

        //--------------------------------------------------
        // 6. Store File
        //--------------------------------------------------

        try {

            await this.storeFile(
                path.fullPath,
                buffer,
            );

        } catch (error) {

            await this.rollback(path.fullPath);

            throw error;

        }

        //--------------------------------------------------
        // 7. Extract Metadata
        //--------------------------------------------------

        const metadata =
            await this.extractMetadata(file);

        //--------------------------------------------------
        // 8. Create DB Record
        //--------------------------------------------------

        const entity =
            await this.createAttachmentRecord({

                organizationId,

                fileName:
                    path.filename,

                mimeType:
                    file.mimetype,

                size:
                    file.size,

                path:
                    path.relativePath,

                checksum,

                metadata,

            });

        //--------------------------------------------------
        // 9. Publish Event
        //--------------------------------------------------

        this.publishEvent(
            'attachment.uploaded',
            {
                id: entity.id,
                organizationId,
                checksum,
                path: path.relativePath,
            },
        );

        //--------------------------------------------------
        // 10. Return Response
        //--------------------------------------------------

        return this.buildResponse(entity);
    }

    async uploadMany(
        files: Express.Multer.File[],
        organizationId: string,
    ) {

        const results: any[] = [];

        for (const file of files) {

            try {

                const result =
                    await this.upload(
                        file,
                        organizationId,
                    );

                results.push(result);

            } catch (error) {

                //--------------------------------------------------
                // Continue other uploads even if one fails
                //--------------------------------------------------

                results.push({
                    success: false,
                    fileName: file.originalname,
                    error: error.message,
                });

            }

        }

        //--------------------------------------------------
        // Bulk event
        //--------------------------------------------------

        this.publishEvent(
            'attachment.uploadMany.completed',
            {
                organizationId,
                total: files.length,
                success: results.filter(r => r.id).length,
                failed: results.filter(r => !r.id).length,
            },
        );

        return results;
    }

    async replace(
        attachmentId: string,
        file: Express.Multer.File,
    ) {

        //--------------------------------------------------
        // 1. Get existing attachment
        //--------------------------------------------------

        const existing =
            await this.repository.findById(attachmentId);

        if (!existing) {
            throw new Error('Attachment not found');
        }

        const oldPath = existing.path;

        //--------------------------------------------------
        // 2. Upload new file (reuse full pipeline)
        //--------------------------------------------------

        const newAttachment =
            await this.upload(
                file,
                existing.organizationId,
            );

        //--------------------------------------------------
        // 3. Delete old physical file
        //--------------------------------------------------

        try {

            await this.storageService.delete(oldPath);

        } catch {
            //--------------------------------------------------
            // ignore storage failure (log in real system)
            //--------------------------------------------------
        }

        //--------------------------------------------------
        // 4. Mark old record as replaced
        //--------------------------------------------------

        await this.repository.softDelete(attachmentId);

        //--------------------------------------------------
        // 5. Event
        //--------------------------------------------------

        this.publishEvent(
            'attachment.replaced',
            {
                oldId: attachmentId,
                newId: newAttachment.id,
            },
        );

        return newAttachment;
    }

    async duplicate(
        attachmentId: string,
        targetEntityId: string,
    ) {

        //--------------------------------------------------
        // 1. Find source
        //--------------------------------------------------

        const source =
            await this.repository.findById(attachmentId);

        if (!source) {
            throw new Error('Attachment not found');
        }

        //--------------------------------------------------
        // 2. Create DB-only clone (NO file copy)
        //--------------------------------------------------

        const clone =
            await this.repository.create({
                organization: {
                    connect: {
                        id: source.organizationId,
                    },
                },

                fileName: source.fileName,

                mimeType: source.mimeType,

                size: source.size,

                path: source.path,

                checksum: source.checksum,
                originalName: '',
                extension: ''
            });

        //--------------------------------------------------
        // 3. Link to target entity
        //--------------------------------------------------

        await this.repository.createEntityLink(
            clone.id,
            targetEntityId,
        );

        //--------------------------------------------------
        // 4. Event
        //--------------------------------------------------

        this.publishEvent(
            'attachment.duplicated',
            {
                sourceId: attachmentId,
                cloneId: clone.id,
                targetEntityId,
            },
        );

        //--------------------------------------------------
        // 5. Response
        //--------------------------------------------------

        return this.buildResponse(clone);
    }

    //--------------------------------------------------
    // PIPELINE STEPS (PRIVATE)
    //--------------------------------------------------

    private validateFile(
        file: Express.Multer.File,
    ) {

        this.validationService.validate(file);

    }

    private calculateChecksum(
        buffer: Buffer,
    ) {

        return this.checksumService.calculateSha256(buffer);

    }

    private async checkDuplicate(
        checksum: string,
    ) {

        return this.repository.findByChecksum(checksum);

    }

    private generatePath(
        organizationId: string,
        originalFilename: string,
    ) {

        return this.pathService.build(
            organizationId,
            originalFilename,
        );

    }

    private async storeFile(
        fullPath: string,
        buffer: Buffer,
    ) {

        await this.storageService.save(
            fullPath,
            buffer,
        );

    }

    private async extractMetadata(
        file: Express.Multer.File,
    ) {

        return this.metadataService.extract(file);

    }

    private async createAttachmentRecord(
        data: any,
    ) {

        return this.repository.create(data);

    }

    private publishEvent(
        event: string,
        payload: any,
    ) {

        this.eventEmitter.emit(
            event,
            payload,
        );

    }

    private buildResponse(
        entity: any,
    ) {

        return this.mapper.toResponse(entity);

    }

    private async rollback(
        path: string,
    ) {

        await this.storageService.delete(path);

    }

}