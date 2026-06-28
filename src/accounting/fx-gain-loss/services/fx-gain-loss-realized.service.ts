import {
    Injectable,
    BadRequestException,
} from '@nestjs/common';

import {
    FxDirection,
    FxEntryType,
} from '@prisma/client';

import { FxGainLossCalculationService } from './fx-gain-loss-calculation.service';
import { FxGainLossRepository } from '../repositories/fx-gain-loss.repository';

@Injectable()
export class FxGainLossRealizedService {
    constructor(
        private readonly calculator: FxGainLossCalculationService,
        private readonly repository: FxGainLossRepository,
    ) { }

    async createFromSettlement(params: {
        organizationId: string;

        journalEntryId: string;

        currencyId: string;

        baseCurrencyId: string;

        foreignAmount: number;

        originalRate: number;

        settlementRate: number;

        referenceType?: string;

        referenceId?: string;

        description?: string;
    }) {

        const result =
            this.calculator.calculateRealized(
                params.originalRate,
                params.settlementRate,
                params.foreignAmount,
            );

        if (result.difference === 0) {
            throw new BadRequestException(
                'No exchange difference detected.',
            );
        }

        return this.repository.create({

            organizationId: params.organizationId,

            journalEntryId: params.journalEntryId,

            currencyId: params.currencyId,

            baseCurrencyId: params.baseCurrencyId,

            entryType: FxEntryType.REALIZED,

            direction:
                result.difference > 0
                    ? FxDirection.GAIN
                    : FxDirection.LOSS,

            amount: Math.abs(result.difference),

            exchangeRate: params.settlementRate,

            sourceAmount: params.foreignAmount,

            referenceType: params.referenceType,

            referenceId: params.referenceId,

            description: params.description,
        });
    }
}