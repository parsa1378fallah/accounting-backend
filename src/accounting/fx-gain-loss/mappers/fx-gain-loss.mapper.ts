import { Injectable } from '@nestjs/common';

import { FxGainLossEntry } from '@prisma/client';

import { FxGainLossResponseDto } from '../dto/fx-gain-loss-response.dto';

@Injectable()
export class FxGainLossMapper {
    /**
     * Entity -> Response DTO
     */
    toResponse(
        entity: FxGainLossEntry,
    ): FxGainLossResponseDto {
        return {
            id: entity.id,

            organizationId: entity.organizationId,

            journalEntryId: entity.journalEntryId,

            currencyId: entity.currencyId,

            baseCurrencyId: entity.baseCurrencyId,

            entryType: entity.entryType,

            direction: entity.direction,

            amount: Number(entity.amount),

            exchangeRate: Number(entity.exchangeRate),

            sourceAmount: Number(entity.sourceAmount),

            referenceType: entity.referenceType ?? undefined,

            referenceId: entity.referenceId ?? undefined,

            description: entity.description ?? undefined,

            createdAt: entity.createdAt,
        };
    }

    /**
     * Entity[] -> Response DTO[]
     */
    toResponseList(
        entities: FxGainLossEntry[],
    ): FxGainLossResponseDto[] {
        return entities.map((entity) =>
            this.toResponse(entity),
        );
    }
}