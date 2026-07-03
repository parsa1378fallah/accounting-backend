import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class ClosingJournalService {
    constructor(private readonly prisma: PrismaService) { }

    // =========================================================
    // MAIN ENTRY
    // =========================================================
    async buildClosingJournal(fiscalYearId: string, userId: string) {
        const entries = await this.prisma.journalEntry.findMany({
            where: {
                fiscalYearId,
                status: 'POSTED',
                isLocked: false,
            },
            include: {
                lines: true,
            },
        });

        let totalRevenue = new Decimal(0);
        let totalExpense = new Decimal(0);

        for (const entry of entries) {
            totalRevenue = totalRevenue.add(entry.totalCredit);
            totalExpense = totalExpense.add(entry.totalDebit);
        }

        const netIncome = totalRevenue.minus(totalExpense);

        return {
            totalRevenue,
            totalExpense,
            netIncome,
        };
    }

    // =========================================================
    // CREATE JOURNAL ENTRY (CLOSING)
    // =========================================================
    async createClosingEntry(
        fiscalYearId: string,
        organizationId: string,
        userId: string,
        retainedEarningsAccountId: string,
    ) {
        const summary = await this.buildClosingJournal(fiscalYearId, userId);

        return this.prisma.$transaction(async (tx) => {
            const journal = await tx.journalEntry.create({
                data: {
                    organizationId,
                    fiscalYearId,
                    branchId: '', // TODO: system default branch
                    entryNumber: `CL-${Date.now()}`,
                    description: 'Fiscal Year Closing Entry',
                    status: 'POSTED',
                    totalDebit: summary.totalRevenue,
                    totalCredit: summary.totalRevenue,
                    postedAt: new Date(),
                    postedById: userId,
                    referenceType: 'FISCAL_YEAR_CLOSING',
                },
            });

            await tx.journalEntryLine.createMany({
                data: [
                    {
                        journalEntryId: journal.id,
                        accountId: retainedEarningsAccountId,
                        debit: summary.totalExpense,
                        credit: new Decimal(0),
                    },
                ],
            });

            return journal;
        });
    }
}