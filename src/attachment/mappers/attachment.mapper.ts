import { Injectable } from '@nestjs/common';

import { Prisma, Attachment } from '@prisma/client';

import { CreateAttachmentDto } from '../dto/create-attachment.dto';
import { UpdateAttachmentDto } from '../dto/update-attachment.dto';
import { AttachmentResponseDto } from '../dto/attachment-response.dto';

@Injectable()
export class AttachmentMapper {

    //--------------------------------------------------
    // Create DTO -> Prisma
    //--------------------------------------------------

    toCreateInput(
        dto: CreateAttachmentDto,
    ): Prisma.AttachmentCreateInput {

        return {
            organization: {
                connect: {
                    id: dto.organizationId,
                },
            },

            fileName: dto.fileName,

            originalName: dto.originalName,

            extension: dto.extension,

            mimeType: dto.mimeType,

            size: dto.size,

            path: dto.path,

            disk: dto.disk,

            checksum: dto.checksum,

            isPublic: dto.isPublic ?? false,

            uploadedById: dto.uploadedById,
        };
    }

    //--------------------------------------------------
    // Update DTO -> Prisma
    //--------------------------------------------------

    toUpdateInput(
        dto: UpdateAttachmentDto,
    ): Prisma.AttachmentUpdateInput {

        const data: Prisma.AttachmentUpdateInput = {};

        if (dto.fileName !== undefined)
            data.fileName = { set: dto.fileName };

        if (dto.originalName !== undefined)
            data.originalName = { set: dto.originalName };

        if (dto.extension !== undefined)
            data.extension = { set: dto.extension };

        if (dto.mimeType !== undefined)
            data.mimeType = { set: dto.mimeType };

        if (dto.size !== undefined)
            data.size = { set: dto.size };

        if (dto.path !== undefined)
            data.path = { set: dto.path };

        if (dto.disk !== undefined)
            data.disk = { set: dto.disk };

        if (dto.checksum !== undefined)
            data.checksum = { set: dto.checksum };

        if (dto.isPublic !== undefined)
            data.isPublic = { set: dto.isPublic };

        if (dto.uploadedById !== undefined)
            data.uploadedById = {
                set: dto.uploadedById,
            };

        return data;
    }

    //--------------------------------------------------
    // Entity -> Response
    //--------------------------------------------------

    toResponse(
        entity: Attachment,
    ): AttachmentResponseDto {

        return {
            id: entity.id,

            organizationId: entity.organizationId,

            fileName: entity.fileName,

            originalName: entity.originalName,

            extension: entity.extension,

            mimeType: entity.mimeType,

            size: entity.size,

            path: entity.path,

            disk: entity.disk ?? undefined,

            checksum: entity.checksum ?? undefined,

            isPublic: entity.isPublic,

            uploadedById:
                entity.uploadedById ?? undefined,

            createdAt: entity.createdAt,

            updatedAt: entity.updatedAt,

            deletedAt: entity.deletedAt,
        };
    }

    //--------------------------------------------------
    // List
    //--------------------------------------------------

    toResponseList(
        entities: Attachment[],
    ): AttachmentResponseDto[] {

        return entities.map(entity =>
            this.toResponse(entity),
        );
    }
}