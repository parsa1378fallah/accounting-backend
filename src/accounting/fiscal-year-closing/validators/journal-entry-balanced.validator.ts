import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FiscalYearCloseValidationException } from '../exceptions';

@Injectable()
export class JournalEntryBalancedValidator {
    constructor(private readonly prisma: PrismaService) { }

    async validate(fiscalYearId: string): Promise<void> {
        const entries = await this.prisma.journalEntry.findMany({
            where: {
                fiscalYearId,
                status: {
                    in: ['POSTED', 'PENDING_APPROVAL'],
                },
                isLocked: false,
            },
            select: {
                id: true,
                totalDebit: true,
                totalCredit: true,
            },
        });

        const hasMismatch = entries.some((entry) => {
            const debit = Number(entry.totalDebit);
            const credit = Number(entry.totalCredit);

            return debit !== credit;
        });

        if (hasMismatch) {
            throw new FiscalYearCloseValidationException(
                'Unbalanced journal entries exist.',
            );
        }
    }
}