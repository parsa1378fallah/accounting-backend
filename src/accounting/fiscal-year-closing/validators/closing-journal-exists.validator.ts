import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FiscalYearCloseValidationException } from '../exceptions';

@Injectable()
export class ClosingJournalExistsValidator {
    constructor(private readonly prisma: PrismaService) { }

    async validate(fiscalYearId: string): Promise<void> {
        const closingJournal = await this.prisma.journalEntry.findFirst({
            where: {
                fiscalYearId,
                referenceType: 'FISCAL_YEAR_CLOSING',
                isReversal: false,
                isLocked: true,
            },
        });

        if (!closingJournal) {
            throw new FiscalYearCloseValidationException(
                'Closing journal entry does not exist for this fiscal year.',
            );
        }
    }
}