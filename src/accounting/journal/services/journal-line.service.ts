import {
    BadRequestException,
    Injectable,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';

import { CreateJournalLineDto } from '../dto/create-journal-line.dto';
import { UpdateJournalLineDto } from '../dto/update-journal-line.dto';

import { JournalBalanceValidator } from '../validators/domains/journal-balance.validator';
import { JournalMapper } from '../mappers/journal.mapper';

@Injectable()
export class JournalLineService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly validator: JournalBalanceValidator,
    ) { }

    /* ===========================================================
       Add Line
    =========================================================== */

    async addLine(
        journalId: string,
        dto: CreateJournalLineDto,
    ) {
        return this.prisma.$transaction(async (tx) => {

            const journal = await tx.journalEntry.findUnique({
                where: { id: journalId },
                include: {
                    lines: true,
                },
            });

            if (!journal)
                throw new BadRequestException('Journal not found');

            this.ensureEditable(journal);

            await tx.journalEntryLine.create({
                data: {
                    journalEntryId: journalId,

                    accountId: dto.accountId,

                    costCenterId: dto.costCenterId,

                    projectId: dto.projectId,

                    description: dto.description,

                    debit: dto.debit,

                    credit: dto.credit,

                    currencyId: dto.currencyId,

                    foreignDebit: dto.foreignDebit,

                    foreignCredit: dto.foreignCredit,

                    exchangeRateSnapshot:
                        dto.exchangeRateSnapshot,

                    sortOrder: dto.sortOrder ?? 0,
                },
            });

            await this.recalculateTotals(tx, journalId);

            return this.validateJournal(tx, journalId);
        });
    }

    /* ===========================================================
       Update Line
    =========================================================== */

    async updateLine(
        lineId: string,
        dto: UpdateJournalLineDto,
    ) {
        return this.prisma.$transaction(async (tx) => {

            const line =
                await tx.journalEntryLine.findUnique({
                    where: {
                        id: lineId,
                    },
                    include: {
                        journalEntry: true,
                    },
                });

            if (!line)
                throw new BadRequestException(
                    'Journal line not found',
                );

            this.ensureEditable(line.journalEntry);

            await tx.journalEntryLine.update({
                where: {
                    id: lineId,
                },
                data: dto,
            });

            await this.recalculateTotals(
                tx,
                line.journalEntryId,
            );

            return this.validateJournal(
                tx,
                line.journalEntryId,
            );
        });
    }

    /* ===========================================================
       Delete Line
    =========================================================== */

    async deleteLine(lineId: string) {
        return this.prisma.$transaction(async (tx) => {

            const line =
                await tx.journalEntryLine.findUnique({
                    where: {
                        id: lineId,
                    },
                    include: {
                        journalEntry: true,
                    },
                });

            if (!line)
                throw new BadRequestException(
                    'Journal line not found',
                );

            this.ensureEditable(line.journalEntry);

            await tx.journalEntryLine.delete({
                where: {
                    id: lineId,
                },
            });

            await this.recalculateTotals(
                tx,
                line.journalEntryId,
            );

            return this.validateJournal(
                tx,
                line.journalEntryId,
            );
        });
    }

    /* ===========================================================
       Replace Lines
    =========================================================== */

    async replaceLines(
        journalId: string,
        lines: CreateJournalLineDto[],
    ) {
        return this.prisma.$transaction(async (tx) => {

            const journal =
                await tx.journalEntry.findUnique({
                    where: {
                        id: journalId,
                    },
                });

            if (!journal)
                throw new BadRequestException(
                    'Journal not found',
                );

            this.ensureEditable(journal);

            await tx.journalEntryLine.deleteMany({
                where: {
                    journalEntryId: journalId,
                },
            });

            await tx.journalEntryLine.createMany({
                data: JournalMapper.toLinesInput(
                    lines,
                    journalId,
                    'IRR',
                ),
            });

            await this.recalculateTotals(
                tx,
                journalId,
            );

            return this.validateJournal(
                tx,
                journalId,

            );
        });
    }

    /* ===========================================================
       Sort Lines
    =========================================================== */

    async reorder(
        journalId: string,
        ids: string[],
    ) {
        return this.prisma.$transaction(async (tx) => {

            for (let i = 0; i < ids.length; i++) {

                await tx.journalEntryLine.update({

                    where: {
                        id: ids[i],
                    },

                    data: {
                        sortOrder: i,
                    },
                });

            }

            return true;
        });
    }

    /* ===========================================================
       Get Lines
    =========================================================== */

    async getLines(journalId: string) {
        return this.prisma.journalEntryLine.findMany({
            where: {
                journalEntryId: journalId,
            },
            include: {
                account: true,
                costCenter: true,
                project: true,
                currency: true,
            },
            orderBy: {
                sortOrder: 'asc',
            },
        });
    }

    /* ===========================================================
       Validation
    =========================================================== */

    private async validateJournal(
        tx: Prisma.TransactionClient,
        journalId: string,
    ) {
        const journal =
            await tx.journalEntry.findUnique({
                where: {
                    id: journalId,
                },
                include: {
                    lines: true,
                },
            });

        if (!journal)
            throw new BadRequestException(
                'Journal not found',
            );

        const validation =
            this.validator.run(journal.lines);

        return {
            journal,
            validation,
        };
    }

    /* ===========================================================
       Totals
    =========================================================== */

    private calculateTotals(
        lines: {
            debit: Prisma.Decimal;
            credit: Prisma.Decimal;
        }[],
    ) {
        let totalDebit = new Prisma.Decimal(0);
        let totalCredit = new Prisma.Decimal(0);

        for (const line of lines) {
            totalDebit = totalDebit.plus(line.debit);
            totalCredit = totalCredit.plus(line.credit);
        }

        return {
            totalDebit,
            totalCredit,
        };
    }
    private async recalculateTotals(
        tx: Prisma.TransactionClient,
        journalId: string,
    ): Promise<void> {

        const lines = await tx.journalEntryLine.findMany({
            where: {
                journalEntryId: journalId,
            },
            select: {
                debit: true,
                credit: true,
            },
        });

        const totals = this.calculateTotals(lines);

        await tx.journalEntry.update({
            where: {
                id: journalId,
            },
            data: {
                totalDebit: totals.totalDebit,
                totalCredit: totals.totalCredit,
            },
        });
    }

    /* ===========================================================
       Guard
    =========================================================== */

    private ensureEditable(
        journal: {
            status: string;
            isLocked: boolean;
        },
    ) {
        if (journal.isLocked) {
            throw new BadRequestException(
                'Journal is locked',
            );
        }

        if (journal.status !== 'DRAFT') {
            throw new BadRequestException(
                'Only DRAFT journals can be modified',
            );
        }
    }
}