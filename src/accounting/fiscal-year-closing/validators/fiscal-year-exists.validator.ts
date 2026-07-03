import { Injectable } from '@nestjs/common';
import { FiscalYear } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';

import { FiscalYearNotFoundException } from '../exceptions';

@Injectable()
export class FiscalYearExistsValidator {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async validate(
        fiscalYearId: string,
    ): Promise<FiscalYear> {
        const fiscalYear =
            await this.prisma.fiscalYear.findUnique({
                where: {
                    id: fiscalYearId,
                },
            });

        if (!fiscalYear) {
            throw new FiscalYearNotFoundException(fiscalYearId);
        }

        return fiscalYear;
    }
}