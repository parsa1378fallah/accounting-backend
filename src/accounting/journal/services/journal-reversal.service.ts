import {
    BadRequestException,
    Injectable,
} from '@nestjs/common';

import {
    JournalEntryStatus,
    Prisma,
} from '@prisma/client';

import { EventEmitter2 } from '@nestjs/event-emitter';

import { PrismaService } from 'src/prisma/prisma.service';

import { JournalNumberService } from './journal-number.service';

@Injectable()
export class JournalReversalService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly numberService: JournalNumberService,
        private readonly eventEmitter: EventEmitter2,
    ) { }

    /**
     * Reverse Posted Journal
     */
    async reverse(
        journalId: string,
        reversalDate: Date,
    ) {
        return this.prisma.$transaction(async (tx) => {

            //----------------------------------------------------
            // Load Original Journal
            //----------------------------------------------------

            const original = await tx.journalEntry.findUnique({
                where: {
                    id: journalId,
                },
                include: {
                    fiscalYear: true,
                    lines: true,
                },
            });

            if (!original) {
                throw new BadRequestException(
                    'Journal entry not found.',
                );
            }

            //----------------------------------------------------
            // Validation
            //----------------------------------------------------

            if (original.status !== JournalEntryStatus.POSTED) {
                throw new BadRequestException(
                    'Only POSTED journals can be reversed.',
                );
            }

            if (original.isReversal) {
                throw new BadRequestException(
                    'Reversal journals cannot be reversed again.',
                );
            }

            const exists = await tx.journalEntry.findFirst({
                where: {
                    reversalOfId: original.id,
                },
            });

            if (exists) {
                throw new BadRequestException(
                    'Journal has already been reversed.',
                );
            }

            if (original.fiscalYear.isClosed) {
                throw new BadRequestException(
                    'Fiscal year is closed.',
                );
            }

            //----------------------------------------------------
            // Generate Number
            //----------------------------------------------------

            const entryNumber =
                await this.numberService.generate({
                    organizationId: original.organizationId,
                    branchId: original.branchId,
                    fiscalYearId: original.fiscalYearId,
                    referenceType: 'REV',
                });

            //----------------------------------------------------
            // Create Reversal Header
            //----------------------------------------------------

            const reversal = await tx.journalEntry.create({
                data: {
                    organization: {
                        connect: {
                            id: original.organizationId,
                        },
                    },

                    fiscalYear: {
                        connect: {
                            id: original.fiscalYearId,
                        },
                    },

                    branch: {
                        connect: {
                            id: original.branchId,
                        },
                    },

                    entryNumber,

                    description:
                        `Reversal of ${original.entryNumber}`,

                    referenceType: original.referenceType,

                    referenceId: original.id,

                    totalDebit: original.totalCredit,

                    totalCredit: original.totalDebit,

                    status: JournalEntryStatus.DRAFT,

                    isReversal: true,

                    reversalOf: {
                        connect: {
                            id: original.id,
                        },
                    },

                    reversalDate,
                },
            });

            //----------------------------------------------------
            // Create Reverse Lines
            //----------------------------------------------------

            await tx.journalEntryLine.createMany({
                data: original.lines.map((line) => ({
                    journalEntryId: reversal.id,

                    accountId: line.accountId,

                    costCenterId: line.costCenterId,

                    projectId: line.projectId,

                    description: line.description,

                    debit: line.credit,

                    credit: line.debit,

                    currencyId: line.currencyId,

                    foreignDebit: line.foreignCredit,

                    foreignCredit: line.foreignDebit,

                    exchangeRateSnapshot:
                        line.exchangeRateSnapshot,

                    sortOrder: line.sortOrder,
                })),
            });

            //----------------------------------------------------
            // Event
            //----------------------------------------------------

            this.eventEmitter.emit(
                'journal.reversed',
                {
                    originalJournalId: original.id,
                    reversalJournalId: reversal.id,
                    organizationId: original.organizationId,
                },
            );

            return reversal;
        });
    }

    /**
     * Check reversal eligibility
     */
    async canReverse(
        journalId: string,
    ): Promise<boolean> {

        const journal =
            await this.prisma.journalEntry.findUnique({
                where: {
                    id: journalId,
                },
            });

        if (!journal) {
            return false;
        }

        if (journal.status !== JournalEntryStatus.POSTED) {
            return false;
        }

        if (journal.isReversal) {
            return false;
        }

        const exists =
            await this.prisma.journalEntry.findFirst({
                where: {
                    reversalOfId: journalId,
                },
            });

        return !exists;
    }

    /**
     * Get reversal document
     */
    async getReversal(
        journalId: string,
    ) {
        return this.prisma.journalEntry.findFirst({
            where: {
                reversalOfId: journalId,
            },
            include: {
                lines: true,
            },
        });
    }
}