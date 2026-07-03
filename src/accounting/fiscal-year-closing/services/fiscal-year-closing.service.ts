import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

import { FiscalYearClosingMapper } from './../mappers/fiscal-year-closing.mapper';

import {
    FiscalYearExistsValidator,
    FiscalYearOpenValidator,
    OrganizationMatchesValidator,
    NoPendingJournalApprovalsValidator,
    NoUnbalancedJournalEntriesValidator,
    ClosingJournalNotExistsValidator,
    ClosingJournalExistsValidator,
} from '../validators';

import {
    FiscalYearAlreadyClosedException,
    FiscalYearClosingNotFoundException,
} from '../exceptions';

@Injectable()
export class FiscalYearClosingService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly fiscalYearExists: FiscalYearExistsValidator,
        private readonly fiscalYearOpen: FiscalYearOpenValidator,
        private readonly organizationMatches: OrganizationMatchesValidator,
        private readonly noPendingApprovals: NoPendingJournalApprovalsValidator,
        private readonly noUnbalanced: NoUnbalancedJournalEntriesValidator,
        private readonly closingJournalNotExists: ClosingJournalNotExistsValidator,
        private readonly closingJournalExists: ClosingJournalExistsValidator,
    ) { }

    // =========================================================
    // PREVIEW
    // =========================================================
    async preview(fiscalYearId: string, organizationId: string) {
        const fiscalYear =
            await this.fiscalYearExists.validate(fiscalYearId);

        this.organizationMatches.validate(fiscalYear, organizationId);
        this.fiscalYearOpen.validate(fiscalYear);

        await this.noPendingApprovals.validate(fiscalYearId);
        await this.noUnbalanced.validate(fiscalYearId);
        await this.closingJournalNotExists.validate(fiscalYearId);

        const journalStats = await this.prisma.journalEntry.aggregate({
            where: { fiscalYearId },
            _sum: {
                totalDebit: true,
                totalCredit: true,
            },
        });

        const totalRevenue = Number(journalStats._sum.totalCredit ?? 0);
        const totalExpense = Number(journalStats._sum.totalDebit ?? 0);
        const netIncome = totalRevenue - totalExpense;

        const draftJournalEntries = await this.prisma.journalEntry.count({
            where: { fiscalYearId, status: 'DRAFT' },
        });

        const pendingJournalApprovals =
            await this.prisma.journalApproval.count({
                where: {
                    journalEntry: { fiscalYearId },
                },
            });

        return {
            fiscalYearId,
            totalRevenue,
            totalExpense,
            netIncome,
            retainedEarningsAmount: netIncome,
            draftJournalEntries,
            pendingJournalApprovals,
            unbalancedJournalEntries: 0,
            canClose: true,
            warnings: [],
        };
    }

    // =========================================================
    // CLOSE
    // =========================================================
    async close(
        fiscalYearId: string,
        organizationId: string,
        userId: string,
    ) {
        const fiscalYear =
            await this.fiscalYearExists.validate(fiscalYearId);

        this.organizationMatches.validate(fiscalYear, organizationId);
        this.fiscalYearOpen.validate(fiscalYear);

        await this.noPendingApprovals.validate(fiscalYearId);
        await this.noUnbalanced.validate(fiscalYearId);
        await this.closingJournalNotExists.validate(fiscalYearId);

        const preview = await this.preview(fiscalYearId, organizationId);

        const closingNumber = `FYC-${Date.now()}`;

        return this.prisma.$transaction(async (tx) => {
            const closing = await tx.fiscalYearClosing.create({
                data: {
                    fiscalYearId,
                    organizationId,
                    closedById: userId,
                    closedAt: new Date(),

                    closingNumber, // ✅ FIX REQUIRED BY PRISMA

                    retainedEarningsAmount:
                        new Prisma.Decimal(preview.retainedEarningsAmount),

                    closingJournalEntryId: '',
                },
            });

            await tx.fiscalYear.update({
                where: { id: fiscalYearId },
                data: { isClosed: true },
            });

            return FiscalYearClosingMapper.toResponse(closing);
        });
    }

    // =========================================================
    // REOPEN
    // =========================================================
    async reopen(fiscalYearId: string, organizationId: string) {
        const fiscalYear =
            await this.fiscalYearExists.validate(fiscalYearId);

        this.organizationMatches.validate(fiscalYear, organizationId);

        if (!fiscalYear.isClosed) {
            throw new FiscalYearAlreadyClosedException();
        }

        return this.prisma.fiscalYear.update({
            where: { id: fiscalYearId },
            data: { isClosed: false },
        });
    }

    // =========================================================
    // LIST (FIXED PAGINATION CONTRACT)
    // =========================================================
    async findAll(organizationId: string) {
        const closings = await this.prisma.fiscalYearClosing.findMany({
            where: { organizationId },
            orderBy: { closedAt: 'desc' },
        });

        return FiscalYearClosingMapper.toList(
            closings,
            closings.length,
            1,
            closings.length,
        );
    }

    // =========================================================
    // GET ONE
    // =========================================================
    async findOne(id: string) {
        const closing = await this.prisma.fiscalYearClosing.findUnique({
            where: { id },
        });

        if (!closing) {
            throw new FiscalYearClosingNotFoundException();
        }

        return FiscalYearClosingMapper.toResponse(closing);
    }
}