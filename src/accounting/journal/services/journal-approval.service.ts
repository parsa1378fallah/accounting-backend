import {
    BadRequestException,
    Injectable,
} from '@nestjs/common';

import {
    ApprovalStatus,
    JournalEntryStatus,
} from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';

import { JournalBalanceValidator } from '../validators/domains/journal-balance.validator';

@Injectable()
export class JournalApprovalService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly validator: JournalBalanceValidator,
    ) { }

    /**
     * ارسال سند برای تایید
     */
    async submitForApproval(journalId: string) {
        const journal = await this.prisma.journalEntry.findUnique({
            where: { id: journalId },
            include: {
                lines: true,
            },
        });

        if (!journal) {
            throw new BadRequestException('Journal entry not found.');
        }

        if (journal.status !== JournalEntryStatus.DRAFT) {
            throw new BadRequestException(
                'Only DRAFT journals can be submitted.',
            );
        }

        const validation = this.validator.run(
            journal.lines,
            {
                multiCurrency: true,
                baseCurrency: 'IRR',
            },
        );

        if (!validation.valid) {
            throw new BadRequestException(validation);
        }

        return this.prisma.journalEntry.update({
            where: {
                id: journalId,
            },
            data: {
                status: JournalEntryStatus.PENDING_APPROVAL,
            },
        });
    }

    /**
     * تایید توسط یک Approver
     */
    async approve(
        journalId: string,
        approverId: string,
        comment?: string,
    ) {
        return this.prisma.$transaction(async (tx) => {
            const journal = await tx.journalEntry.findUnique({
                where: {
                    id: journalId,
                },
            });

            if (!journal) {
                throw new BadRequestException('Journal entry not found.');
            }

            if (
                journal.status !==
                JournalEntryStatus.PENDING_APPROVAL
            ) {
                throw new BadRequestException(
                    'Journal is not waiting for approval.',
                );
            }

            const approval =
                await tx.journalApproval.findFirst({
                    where: {
                        journalEntryId: journalId,
                        approverId,
                    },
                });

            if (approval) {
                throw new BadRequestException(
                    'Approver has already reviewed this journal.',
                );
            }

            return tx.journalApproval.create({
                data: {
                    journalEntryId: journalId,
                    approverId,
                    status: ApprovalStatus.APPROVED,
                    comment,
                    approvedAt: new Date(),
                },
            });
        });
    }

    /**
     * رد سند
     */
    async reject(
        journalId: string,
        approverId: string,
        reason: string,
    ) {
        return this.prisma.$transaction(async (tx) => {
            const journal = await tx.journalEntry.findUnique({
                where: {
                    id: journalId,
                },
            });

            if (!journal) {
                throw new BadRequestException('Journal entry not found.');
            }

            if (
                journal.status !==
                JournalEntryStatus.PENDING_APPROVAL
            ) {
                throw new BadRequestException(
                    'Journal is not waiting for approval.',
                );
            }

            await tx.journalApproval.create({
                data: {
                    journalEntryId: journalId,
                    approverId,
                    status: ApprovalStatus.REJECTED,
                    comment: reason,
                },
            });

            return tx.journalEntry.update({
                where: {
                    id: journalId,
                },
                data: {
                    status: JournalEntryStatus.DRAFT,
                },
            });
        });
    }

    /**
     * مشاهده تاریخچه تاییدها
     */
    async getApprovalHistory(journalId: string) {
        return this.prisma.journalApproval.findMany({
            where: {
                journalEntryId: journalId,
            },
            include: {
                approver: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                approvedAt: 'asc',
            },
        });
    }
}