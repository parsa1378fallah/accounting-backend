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

import { JournalBalanceValidator } from '../validators/domains/journal-balance.validator';

@Injectable()
export class JournalPostingService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly validator: JournalBalanceValidator,
        private readonly eventEmitter: EventEmitter2,
    ) { }

    /**
     * Post Journal Entry
     */
    async post(
        journalId: string,
        postedById: string,
    ) {
        return this.prisma.$transaction(async (tx) => {

            //--------------------------------------------------
            // Load Journal
            //--------------------------------------------------

            const journal = await tx.journalEntry.findUnique({
                where: {
                    id: journalId,
                },
                include: {
                    fiscalYear: true,
                    lines: true,
                },
            });

            if (!journal) {
                throw new BadRequestException(
                    'Journal entry not found.',
                );
            }

            //--------------------------------------------------
            // Status Validation
            //--------------------------------------------------

            if (journal.status === JournalEntryStatus.POSTED) {
                throw new BadRequestException(
                    'Journal already posted.',
                );
            }

            if (journal.status === JournalEntryStatus.CANCELLED) {
                throw new BadRequestException(
                    'Cancelled journal cannot be posted.',
                );
            }

            if (
                journal.status !==
                JournalEntryStatus.PENDING_APPROVAL
            ) {
                throw new BadRequestException(
                    'Journal must be pending approval.',
                );
            }

            //--------------------------------------------------
            // Lock Validation
            //--------------------------------------------------

            if (journal.isLocked) {
                throw new BadRequestException(
                    'Journal is locked.',
                );
            }

            //--------------------------------------------------
            // Fiscal Year Validation
            //--------------------------------------------------

            if (journal.fiscalYear.isClosed) {
                throw new BadRequestException(
                    'Fiscal year is closed.',
                );
            }

            //--------------------------------------------------
            // Balance Validation
            //--------------------------------------------------

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

            //--------------------------------------------------
            // Update
            //--------------------------------------------------

            const updated = await tx.journalEntry.update({
                where: {
                    id: journal.id,
                },
                data: {
                    status: JournalEntryStatus.POSTED,
                    postedAt: new Date(),
                    postedById,
                    isLocked: true,
                },
            });

            //--------------------------------------------------
            // Domain Event
            //--------------------------------------------------

            this.eventEmitter.emit(
                'journal.posted',
                {
                    journalId: updated.id,
                    organizationId: updated.organizationId,
                    entryNumber: updated.entryNumber,
                    postedById,
                    postedAt: updated.postedAt,
                },
            );

            return updated;
        });
    }

    /**
     * Check posting eligibility
     */
    async canPost(
        journalId: string,
    ): Promise<boolean> {

        const journal =
            await this.prisma.journalEntry.findUnique({
                where: {
                    id: journalId,
                },
                include: {
                    fiscalYear: true,
                },
            });

        if (!journal) {
            return false;
        }

        if (
            journal.status !==
            JournalEntryStatus.PENDING_APPROVAL
        ) {
            return false;
        }

        if (journal.isLocked) {
            return false;
        }

        if (journal.fiscalYear.isClosed) {
            return false;
        }

        return true;
    }

    /**
     * Get posting information
     */
    async getPostingInfo(
        journalId: string,
    ) {

        return this.prisma.journalEntry.findUnique({
            where: {
                id: journalId,
            },
            select: {
                id: true,
                entryNumber: true,
                status: true,
                postedAt: true,
                postedById: true,
                isLocked: true,
            },
        });
    }
}