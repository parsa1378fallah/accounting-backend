import {
    BadRequestException,
    Injectable,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

import { CreateFxGainLossDto } from '../dto/create-fx-gain-loss.dto';

@Injectable()
export class FxGainLossValidator {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    /**
     * Validate Create Request
     */
    async validateCreate(
        dto: CreateFxGainLossDto,
    ): Promise<void> {
        await Promise.all([
            this.validateJournal(dto.journalEntryId),
            this.validateCurrency(dto.currencyId),
            this.validateCurrency(dto.baseCurrencyId),
        ]);

        this.validateAmounts(dto);
    }

    /**
     * Validate Journal Exists
     */
    private async validateJournal(
        journalEntryId: string,
    ): Promise<void> {
        const exists =
            await this.prisma.journalEntry.count({
                where: {
                    id: journalEntryId,
                },
            });

        if (!exists) {
            throw new BadRequestException(
                'Journal entry not found.',
            );
        }
    }

    /**
     * Validate Currency Exists
     */
    private async validateCurrency(
        currencyId: string,
    ): Promise<void> {
        const exists =
            await this.prisma.currency.count({
                where: {
                    id: currencyId,
                    deletedAt: null,
                    isActive: true,
                },
            });

        if (!exists) {
            throw new BadRequestException(
                'Currency not found.',
            );
        }
    }

    /**
     * Validate Amounts
     */
    private validateAmounts(
        dto: CreateFxGainLossDto,
    ): void {
        if (dto.amount <= 0) {
            throw new BadRequestException(
                'Amount must be greater than zero.',
            );
        }

        if (dto.exchangeRate <= 0) {
            throw new BadRequestException(
                'Exchange rate must be greater than zero.',
            );
        }

        if (dto.sourceAmount <= 0) {
            throw new BadRequestException(
                'Source amount must be greater than zero.',
            );
        }
    }
}