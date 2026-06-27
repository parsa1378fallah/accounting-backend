import {
    BadRequestException,
    Injectable,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CurrencyValidator {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async validate(
        currencyId?: string,
    ): Promise<void> {
        if (!currencyId) {
            return;
        }

        const currency =
            await this.prisma.currency.findUnique({
                where: {
                    id: currencyId,
                },
            });

        if (!currency) {
            throw new BadRequestException(
                'Currency not found.',
            );
        }

        if (currency.deletedAt) {
            throw new BadRequestException(
                'Currency has been deleted.',
            );
        }

        if (!currency.isActive) {
            throw new BadRequestException(
                'Currency is inactive.',
            );
        }
    }

    async validateExchangeRate(
        organizationId: string,
        currencyId: string,
        effectiveDate: Date,
    ) {
        const rate =
            await this.prisma.exchangeRate.findFirst({
                where: {
                    organizationId,
                    currencyId,
                    effectiveDate: {
                        lte: effectiveDate,
                    },
                    deletedAt: null,
                    isActive: true,
                    status: 'ACTIVE',
                },
                orderBy: {
                    effectiveDate: 'desc',
                },
            });

        if (!rate) {
            throw new BadRequestException(
                'No active exchange rate found.'
            );
        }

        return rate;
    }
}