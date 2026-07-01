import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

import { Prisma } from '@prisma/client';

@Injectable()
export class JournalAttachmentsRepository {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    //--------------------------------------------------
    // Attach
    //--------------------------------------------------

    create(
        journalEntryId: string,
        attachmentId: string,
    ) {
        return this.prisma.journalAttachment.create({
            data: {
                journalEntryId,
                attachmentId,
            },
        });
    }

    //--------------------------------------------------
    // Find By Journal
    //--------------------------------------------------

    findByJournal(
        journalEntryId: string,
    ) {
        return this.prisma.journalAttachment.findMany({
            where: {
                journalEntryId,
            },
            include: {
                attachment: true,
            },
            orderBy: {
                attachment: {
                    createdAt: 'desc',
                },
            },
        });
    }

    //--------------------------------------------------
    // Exists
    //--------------------------------------------------

    exists(
        journalEntryId: string,
        attachmentId: string,
    ) {
        return this.prisma.journalAttachment.findUnique({
            where: {
                journalEntryId_attachmentId: {
                    journalEntryId,
                    attachmentId,
                },
            },
        });
    }

    //--------------------------------------------------
    // Detach
    //--------------------------------------------------

    delete(
        journalEntryId: string,
        attachmentId: string,
    ) {
        return this.prisma.journalAttachment.delete({
            where: {
                journalEntryId_attachmentId: {
                    journalEntryId,
                    attachmentId,
                },
            },
        });
    }

    //--------------------------------------------------
    // Delete All
    //--------------------------------------------------

    deleteMany(
        journalEntryId: string,
    ) {
        return this.prisma.journalAttachment.deleteMany({
            where: {
                journalEntryId,
            },
        });
    }

    //--------------------------------------------------
    // Replace
    //--------------------------------------------------

    async replace(
        journalEntryId: string,
        attachmentIds: string[],
    ) {
        return this.prisma.$transaction(async (tx) => {
            await tx.journalAttachment.deleteMany({
                where: {
                    journalEntryId,
                },
            });

            if (attachmentIds.length === 0) {
                return [];
            }

            await tx.journalAttachment.createMany({
                data: attachmentIds.map(
                    attachmentId => ({
                        journalEntryId,
                        attachmentId,
                    }),
                ),
                skipDuplicates: true,
            });

            return tx.journalAttachment.findMany({
                where: {
                    journalEntryId,
                },
                include: {
                    attachment: true,
                },
            });
        });
    }

    //--------------------------------------------------
    // Count
    //--------------------------------------------------

    count(
        journalEntryId: string,
    ) {
        return this.prisma.journalAttachment.count({
            where: {
                journalEntryId,
            },
        });
    }
}