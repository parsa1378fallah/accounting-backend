import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class JournalBalanceValidatorService {
    constructor(private readonly prisma: PrismaService) { }

    // =========================================================
    // VALIDATE SINGLE ENTRY
    // =========================================================
    private isBalanced(debit: Decimal, credit: Decimal): boolean {
        return debit.equals(credit);
    }

    // =========================================================
    // VALIDATE ALL JOURNALS IN FISCAL YEAR
    // =========================================================
    async validate(fiscalYearId: string): Promise<void> {
        const entries = await this.prisma.journalEntry.findMany({
            where: {
                fiscalYearId,
                status: {
                    in: ['POSTED', 'PENDING_APPROVAL'],
                },
            },
            select: {
                id: true,
                totalDebit: true,
                totalCredit: true,
            },
        });

        const invalidEntries = entries.filter(
            (e) => !this.isBalanced(e.totalDebit, e.totalCredit),
        );

        if (invalidEntries.length > 0) {
            throw new Error(
                `Unbalanced journal entries found: ${invalidEntries.length}`,
            );
        }
    }

    // =========================================================
    // STRICT MODE (FOR CLOSE PROCESS)
    // =========================================================
    async validateStrict(fiscalYearId: string): Promise<void> {
        const entries = await this.prisma.journalEntry.findMany({
            where: {
                fiscalYearId,
                status: 'POSTED',
                isLocked: false,
            },
        });

        for (const entry of entries) {
            const debit = new Decimal(entry.totalDebit);
            const credit = new Decimal(entry.totalCredit);

            if (!debit.equals(credit)) {
                throw new Error(
                    `Journal ${entry.id} is not balanced`,
                );
            }
        }
    }
}