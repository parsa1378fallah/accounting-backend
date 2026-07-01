import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { AttachmentRepository } from '../repositories/attachment.repository';

import { CreateAttachmentDto } from '../dto/create-attachment.dto';
import { UpdateAttachmentDto } from '../dto/update-attachment.dto';

@Injectable()
export class AttachmentValidator {
    constructor(
        private readonly repository: AttachmentRepository,
    ) { }

    //--------------------------------------------------
    // Create
    //--------------------------------------------------

    async validateCreate(
        dto: CreateAttachmentDto,
    ) {
        await this.validateFileName(dto.fileName);

        await this.validateSize(dto.size);

        await this.validateChecksum(
            dto.organizationId,
            dto.checksum,
        );
    }

    //--------------------------------------------------
    // Update
    //--------------------------------------------------

    async validateUpdate(
        id: string,
        dto: UpdateAttachmentDto,
    ) {
        await this.ensureExists(id);

        if (dto.fileName !== undefined) {
            await this.validateFileName(
                dto.fileName,
            );
        }

        if (dto.size !== undefined) {
            await this.validateSize(
                dto.size,
            );
        }
    }

    //--------------------------------------------------
    // Delete
    //--------------------------------------------------

    async validateDelete(
        id: string,
    ) {
        await this.ensureExists(id);
    }

    //--------------------------------------------------
    // Exists
    //--------------------------------------------------

    async ensureExists(
        id: string,
    ) {
        const entity =
            await this.repository.findById(id);

        if (!entity) {
            throw new NotFoundException(
                'Attachment not found.',
            );
        }

        return entity;
    }

    //--------------------------------------------------
    // File Name
    //--------------------------------------------------

    async validateFileName(
        fileName: string,
    ) {
        if (!fileName.trim()) {
            throw new BadRequestException(
                'File name is required.',
            );
        }
    }

    //--------------------------------------------------
    // File Size
    //--------------------------------------------------

    async validateSize(
        size: number,
    ) {
        if (size <= 0) {
            throw new BadRequestException(
                'Invalid file size.',
            );
        }

        /**
         * 100 MB
         */

        const maxSize =
            100 * 1024 * 1024;

        if (size > maxSize) {
            throw new BadRequestException(
                'File size exceeds maximum allowed.',
            );
        }
    }

    //--------------------------------------------------
    // Duplicate Checksum
    //--------------------------------------------------

    async validateChecksum(
        organizationId: string,
        checksum?: string,
    ) {
        if (!checksum) {
            return;
        }

        const exists =
            await this.repository.exists({
                organizationId,
                checksum,
                deletedAt: null,
            });

        if (exists) {
            throw new BadRequestException(
                'Duplicate file detected.',
            );
        }
    }
}