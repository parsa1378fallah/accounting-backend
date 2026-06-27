import {
    BadRequestException,
    Injectable,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { JournalEntryStatus } from '@prisma/client';

@Injectable()
export class JournalLockService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    /**
     * قفل کردن سند
     */
    async lock(journalId: string) {
        const journal = await this.getJournal(journalId);

        if (journal.isLocked) {
            throw new BadRequestException(
                'Journal is already locked',
            );
        }

        return this.prisma.journalEntry.update({
            where: {
                id: journalId,
            },
            data: {
                isLocked: true,
            },
        });
    }

    /**
     * باز کردن قفل سند
     */
    async unlock(journalId: string) {
        const journal = await this.getJournal(journalId);

        if (!journal.isLocked) {
            throw new BadRequestException(
                'Journal is not locked',
            );
        }

        if (journal.status === JournalEntryStatus.POSTED) {
            throw new BadRequestException(
                'Posted journal cannot be unlocked',
            );
        }

        return this.prisma.journalEntry.update({
            where: {
                id: journalId,
            },
            data: {
                isLocked: false,
            },
        });
    }

    /**
     * بررسی قفل بودن
     */
    async ensureUnlocked(journalId: string) {
        const journal = await this.getJournal(journalId);

        if (journal.isLocked) {
            throw new BadRequestException(
                'Journal is locked',
            );
        }

        return journal;
    }

    /**
     * بررسی امکان ویرایش
     */
    async ensureEditable(journalId: string) {
        const journal = await this.getJournal(journalId);

        if (journal.isLocked) {
            throw new BadRequestException(
                'Journal is locked',
            );
        }

        if (journal.status !== JournalEntryStatus.DRAFT) {
            throw new BadRequestException(
                'Only DRAFT journal can be edited',
            );
        }

        return journal;
    }

    /**
     * بررسی امکان حذف
     */
    async ensureDeletable(journalId: string) {
        const journal = await this.ensureEditable(journalId);

        return journal;
    }

    /**
     * بررسی امکان Posting
     */
    async ensurePostable(journalId: string) {
        const journal = await this.getJournal(journalId);

        if (journal.isLocked) {
            throw new BadRequestException(
                'Journal is locked',
            );
        }

        if (journal.status !== JournalEntryStatus.PENDING_APPROVAL) {
            throw new BadRequestException(
                'Only approved journals can be posted',
            );
        }

        return journal;
    }

    /**
     * بررسی امکان Reverse
     */
    async ensureReversible(journalId: string) {
        const journal = await this.getJournal(journalId);

        if (journal.status !== JournalEntryStatus.POSTED) {
            throw new BadRequestException(
                'Only POSTED journal can be reversed',
            );
        }

        if (journal.isReversal) {
            throw new BadRequestException(
                'Journal is already reversed',
            );
        }

        return journal;
    }

    /**
     * وضعیت قفل
     */
    async isLocked(journalId: string): Promise<boolean> {
        const journal = await this.getJournal(journalId);

        return journal.isLocked;
    }

    /**
     * گرفتن سند
     */
    private async getJournal(journalId: string) {
        const journal = await this.prisma.journalEntry.findUnique({
            where: {
                id: journalId,
            },
        });

        if (!journal) {
            throw new BadRequestException(
                'Journal not found',
            );
        }

        return journal;
    }
}