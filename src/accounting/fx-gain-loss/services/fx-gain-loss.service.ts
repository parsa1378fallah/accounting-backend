import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { FxGainLossRepository } from '../repositories/fx-gain-loss.repository';
import { FxGainLossValidator } from '../validators/fx-gain-loss.validator';
import { FxGainLossMapper } from '../mappers/fx-gain-loss.mapper';

import { CreateFxGainLossDto } from '../dto/create-fx-gain-loss.dto';
import { UpdateFxGainLossDto } from '../dto/update-fx-gain-loss.dto';
import { QueryFxGainLossDto } from '../dto/query-fx-gain-loss.dto';

@Injectable()
export class FxGainLossService {
    constructor(
        private readonly repository: FxGainLossRepository,
        private readonly validator: FxGainLossValidator,
        private readonly mapper: FxGainLossMapper,
    ) { }

    async create(
        dto: CreateFxGainLossDto,
    ) {
        await this.validator.validateCreate(dto);

        const entity = await this.repository.create(dto);

        return this.mapper.toResponse(entity);
    }

    async findAll(
        query: QueryFxGainLossDto,
    ) {
        const where = {};

        const entities =
            await this.repository.findMany(where);

        return this.mapper.toResponseList(entities);
    }

    async findOne(
        id: string,
    ) {
        const entity =
            await this.repository.findById(id);

        if (!entity) {
            throw new NotFoundException(
                'FX Gain/Loss entry not found.',
            );
        }

        return this.mapper.toResponse(entity);
    }

    async update(
        id: string,
        dto: UpdateFxGainLossDto,
    ) {
        await this.findOne(id);

        const entity =
            await this.repository.update(id, dto);

        return this.mapper.toResponse(entity);
    }

    async remove(
        id: string,
    ) {
        await this.findOne(id);

        await this.repository.delete(id);

        return {
            success: true,
        };
    }
}