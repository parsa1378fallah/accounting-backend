import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FiscalYearCloseValidationException } from '../exceptions';

@Injectable()
export class NoUnpostedJournalEntriesValidator {
    constructor(private readonly prisma: PrismaService) { }

    async validate(fiscalYearId: string): Promise<void> {
        const count = await this.prisma.journalEntry.count({
            where: {
                fiscalYearId,
                status: {
                    in: ['DRAFT', 'PENDING_APPROVAL'],
                },
            },
        });

        if (count > 0) {
            throw new FiscalYearCloseValidationException(
                'There are unposted journal entries.',
            );
        }
    }
}