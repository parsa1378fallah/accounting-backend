import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FiscalYearCloseValidationException } from '../exceptions';

@Injectable()
export class ClosingJournalNotExistsValidator {
    constructor(private readonly prisma: PrismaService) { }

    async validate(fiscalYearId: string): Promise<void> {
        const exists = await this.prisma.journalEntry.findFirst({
            where: {
                fiscalYearId,
                referenceType: 'FISCAL_YEAR_CLOSING',
            },
        });

        if (exists) {
            throw new FiscalYearCloseValidationException(
                'Closing journal already exists for this fiscal year.',
            );
        }
    }
}