import {
    BadRequestException,
    Injectable,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FiscalPeriodValidator {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    /**
     * Validate fiscal year
     */
    async validateFiscalYear(
        fiscalYearId: string,
        journalDate: Date,
    ) {
        const fiscalYear =
            await this.prisma.fiscalYear.findUnique({
                where: {
                    id: fiscalYearId,
                },
            });

        if (!fiscalYear) {
            throw new BadRequestException(
                'Fiscal year not found.',
            );
        }

        if (fiscalYear.isClosed) {
            throw new BadRequestException(
                'Fiscal year is closed.',
            );
        }

        if (
            journalDate < fiscalYear.startAt ||
            journalDate > fiscalYear.endAt
        ) {
            throw new BadRequestException(
                'Journal date is outside fiscal year.'
            );
        }

        return fiscalYear;
    }

    /**
     * Validate fiscal period
     */
    async validatePeriod(
        fiscalYearId: string,
        journalDate: Date,
    ) {
        const period =
            await this.prisma.fiscalPeriod.findFirst({
                where: {
                    fiscalYearId,
                    startDate: {
                        lte: journalDate,
                    },
                    endDate: {
                        gte: journalDate,
                    },
                },
            });

        if (!period) {
            throw new BadRequestException(
                'Fiscal period not found.'
            );
        }

        if (period.isClosed) {
            throw new BadRequestException(
                'Fiscal period is closed.'
            );
        }

        return period;
    }

    /**
     * Validate both fiscal year and fiscal period
     */
    async validate(
        fiscalYearId: string,
        journalDate: Date,
    ) {
        await this.validateFiscalYear(
            fiscalYearId,
            journalDate,
        );

        await this.validatePeriod(
            fiscalYearId,
            journalDate,
        );
    }
}