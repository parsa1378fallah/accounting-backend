import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { FiscalYearClosingNotFoundException } from '../exceptions';

@Injectable()
export class FiscalYearClosingExistsValidator {
    constructor(private readonly prisma: PrismaService) { }

    async validate(fiscalYearId: string): Promise<void> {
        const closing = await this.prisma.fiscalYearClosing.findUnique({
            where: { fiscalYearId },
        });

        if (!closing) {
            throw new FiscalYearClosingNotFoundException();
        }
    }
}