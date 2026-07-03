import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class RetainedEarningsService {
    constructor(private readonly prisma: PrismaService) { }

    // =========================================================
    // CALCULATE RETAINED EARNINGS
    // =========================================================
    async calculate(fiscalYearId: string) {
        const entries = await this.prisma.journalEntry.findMany({
            where: {
                fiscalYearId,
                status: 'POSTED',
            },
            select: {
                totalDebit: true,
                totalCredit: true,
            },
        });

        let revenue = new Decimal(0);
        let expense = new Decimal(0);

        for (const e of entries) {
            revenue = revenue.add(e.totalCredit);
            expense = expense.add(e.totalDebit);
        }

        const netIncome = revenue.minus(expense);

        return {
            totalRevenue: revenue,
            totalExpense: expense,
            netIncome,
            retainedEarnings: netIncome, // ساده‌ترین مدل enterprise MVP
        };
    }

    // =========================================================
    // APPLY TO EQUITY (FUTURE JOURNAL IMPACT)
    // =========================================================
    async apply(fiscalYearId: string, retainedAccountId: string) {
        const result = await this.calculate(fiscalYearId);

        return {
            accountId: retainedAccountId,
            amount: result.retainedEarnings,
            type: 'EQUITY_ADJUSTMENT',
        };
    }
}