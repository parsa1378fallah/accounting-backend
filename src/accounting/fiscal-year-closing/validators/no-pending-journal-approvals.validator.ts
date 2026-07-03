import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FiscalYearCloseValidationException } from '../exceptions';

@Injectable()
export class NoPendingJournalApprovalsValidator {
    constructor(private readonly prisma: PrismaService) { }

    async validate(fiscalYearId: string): Promise<void> {
        const pending = await this.prisma.journalApproval.findFirst({
            where: {
                status: 'PENDING',
                journalEntry: {
                    fiscalYearId,
                },
            },
        });

        if (pending) {
            throw new FiscalYearCloseValidationException(
                'Pending journal approvals exist for this fiscal year.',
            );
        }
    }
}