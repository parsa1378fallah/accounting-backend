import {
    Injectable,
} from '@nestjs/common';

import { AttachmentRepository } from '../repositories/attachment.repository';

import { AttachmentValidator } from '../validators/attachment.validator';

import { AttachmentMapper } from '../mappers/attachment.mapper';

import { AttachmentQueryService } from './attachment-query.service';

import { CreateAttachmentDto } from '../dto/create-attachment.dto';
import { UpdateAttachmentDto } from '../dto/update-attachment.dto';

@Injectable()
export class AttachmentService {
    constructor(
        private readonly repository: AttachmentRepository,

        private readonly validator: AttachmentValidator,

        private readonly mapper: AttachmentMapper,

        private readonly queryService: AttachmentQueryService,
    ) { }

    //--------------------------------------------------
    // CREATE
    //--------------------------------------------------

    async create(
        dto: CreateAttachmentDto,
    ) {
        await this.validator.validateCreate(dto);

        const input =
            this.mapper.toCreateInput(dto);

        const entity =
            await this.repository.create(input);

        return this.mapper.toResponse(entity);
    }

    //--------------------------------------------------
    // FIND ALL
    //--------------------------------------------------

    async findAll(query: any) {
        return this.queryService.findAll(query);
    }

    //--------------------------------------------------
    // FIND ONE
    //--------------------------------------------------

    async findById(
        id: string,
    ) {
        return this.queryService.findById(id);
    }

    //--------------------------------------------------
    // UPDATE
    //--------------------------------------------------

    async update(
        id: string,
        dto: UpdateAttachmentDto,
    ) {
        await this.validator.validateUpdate(
            id,
            dto,
        );

        const input =
            this.mapper.toUpdateInput(dto);

        const entity =
            await this.repository.update(
                id,
                input,
            );

        return this.mapper.toResponse(entity);
    }

    //--------------------------------------------------
    // SOFT DELETE
    //--------------------------------------------------

    async remove(
        id: string,
    ) {
        await this.validator.validateDelete(id);

        const entity =
            await this.repository.softDelete(id);

        return {
            success: true,
            id: entity.id,
        };
    }

    //--------------------------------------------------
    // RESTORE
    //--------------------------------------------------

    async restore(
        id: string,
    ) {
        await this.validator.ensureExists(id);

        const entity =
            await this.repository.restore(id);

        return this.mapper.toResponse(entity);
    }

    //--------------------------------------------------
    // HARD DELETE
    //--------------------------------------------------

    async forceDelete(
        id: string,
    ) {
        await this.validator.ensureExists(id);

        await this.repository.delete(id);

        return {
            success: true,
        };
    }
}