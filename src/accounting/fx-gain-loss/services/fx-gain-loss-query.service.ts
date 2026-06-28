import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { FxGainLossRepository } from '../repositories/fx-gain-loss.repository';
import { FxGainLossMapper } from '../mappers/fx-gain-loss.mapper';
import { QueryFxGainLossDto } from '../dto/query-fx-gain-loss.dto';

@Injectable()
export class FxGainLossQueryService {
    constructor(
        private readonly repository: FxGainLossRepository,
        private readonly mapper: FxGainLossMapper,
    ) { }

    async findAll(
        query: QueryFxGainLossDto,
    ) {
        const where: Prisma.FxGainLossEntryWhereInput = {};

        if (query.organizationId) {
            where.organizationId = query.organizationId;
        }

        if (query.currencyId) {
            where.currencyId = query.currencyId;
        }

        if (query.journalEntryId) {
            where.journalEntryId = query.journalEntryId;
        }

        if (query.entryType) {
            where.entryType = query.entryType;
        }

        if (query.direction) {
            where.direction = query.direction;
        }

        if (query.referenceType) {
            where.referenceType = query.referenceType;
        }

        const result =
            await this.repository.findMany(where);

        return this.mapper.toResponseList(result);
    }

    async findOne(id: string) {
        const entity =
            await this.repository.findById(id);

        if (!entity) {
            throw new NotFoundException(
                'FX Gain/Loss entry not found.',
            );
        }

        return this.mapper.toResponse(entity);
    }
}