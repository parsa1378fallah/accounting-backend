import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

import { JournalAttachmentsRepository } from '../repositories/journal-attachments.repository';

@Injectable()
export class JournalAttachmentsService {
    constructor(
        private readonly prisma: PrismaService,

        private readonly repository: JournalAttachmentsRepository,
    ) { }

    //--------------------------------------------------
    // Attach
    //--------------------------------------------------

    async attach(
        journalEntryId: string,
        attachmentId: string,
    ) {

        //--------------------------------------------------
        // Journal Exists
        //--------------------------------------------------

        const journal =
            await this.prisma.journalEntry.findUnique({
                where: {
                    id: journalEntryId,
                },
            });

        if (!journal) {
            throw new NotFoundException(
                'Journal Entry not found.',
            );
        }

        //--------------------------------------------------
        // Attachment Exists
        //--------------------------------------------------

        const attachment =
            await this.prisma.attachment.findUnique({
                where: {
                    id: attachmentId,
                },
            });

        if (!attachment) {
            throw new NotFoundException(
                'Attachment not found.',
            );
        }

        //--------------------------------------------------
        // Duplicate
        //--------------------------------------------------

        const exists =
            await this.repository.exists(
                journalEntryId,
                attachmentId,
            );

        if (exists) {
            throw new BadRequestException(
                'Attachment already linked.',
            );
        }

        return this.repository.create(
            journalEntryId,
            attachmentId,
        );
    }

    //--------------------------------------------------
    // List
    //--------------------------------------------------

    async list(
        journalEntryId: string,
    ) {
        return this.repository.findByJournal(
            journalEntryId,
        );
    }

    //--------------------------------------------------
    // Detach
    //--------------------------------------------------

    async detach(
        journalEntryId: string,
        attachmentId: string,
    ) {

        const exists =
            await this.repository.exists(
                journalEntryId,
                attachmentId,
            );

        if (!exists) {
            throw new NotFoundException(
                'Attachment relation not found.',
            );
        }

        await this.repository.delete(
            journalEntryId,
            attachmentId,
        );

        return {
            success: true,
        };
    }

    //--------------------------------------------------
    // Replace
    //--------------------------------------------------

    async replace(
        journalEntryId: string,
        attachmentIds: string[],
    ) {

        //--------------------------------------------------
        // Journal Exists
        //--------------------------------------------------

        const journal =
            await this.prisma.journalEntry.findUnique({
                where: {
                    id: journalEntryId,
                },
            });

        if (!journal) {
            throw new NotFoundException(
                'Journal Entry not found.',
            );
        }

        //--------------------------------------------------
        // Validate Attachments
        //--------------------------------------------------

        for (const attachmentId of attachmentIds) {

            const attachment =
                await this.prisma.attachment.findUnique({
                    where: {
                        id: attachmentId,
                    },
                });

            if (!attachment) {
                throw new NotFoundException(
                    `Attachment ${attachmentId} not found.`,
                );
            }
        }

        return this.repository.replace(
            journalEntryId,
            attachmentIds,
        );
    }

    //--------------------------------------------------
    // Count
    //--------------------------------------------------

    async count(
        journalEntryId: string,
    ) {
        return this.repository.count(
            journalEntryId,
        );
    }
}