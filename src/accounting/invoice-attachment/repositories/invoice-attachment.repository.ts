import { Injectable } from '@nestjs/common';
import {
    InvoiceAttachment,
    Prisma,
} from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InvoiceAttachmentRepository {

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    //--------------------------------------------------
    // Create
    //--------------------------------------------------

    create(
        data: Prisma.InvoiceAttachmentCreateInput,
    ) {
        return this.prisma.invoiceAttachment.create({
            data,
        });
    }

    //--------------------------------------------------
    // Create Many
    //--------------------------------------------------

    createMany(
        data: Prisma.InvoiceAttachmentCreateManyInput[],
    ) {
        return this.prisma.invoiceAttachment.createMany({
            data,
        });
    }

    //--------------------------------------------------
    // Find By Id
    //--------------------------------------------------

    findById(
        id: string,
    ) {
        return this.prisma.invoiceAttachment.findUnique({
            where: {
                id,
            },
        });
    }

    //--------------------------------------------------
    // Find By Id With Relations
    //--------------------------------------------------

    findByIdWithRelations(
        id: string,
    ) {
        return this.prisma.invoiceAttachment.findUnique({
            where: {
                id,
            },
            include: {
                invoice: true,
                attachment: true,
            },
        });
    }

    //--------------------------------------------------
    // Find First
    //--------------------------------------------------

    findFirst(
        where: Prisma.InvoiceAttachmentWhereInput,
    ) {
        return this.prisma.invoiceAttachment.findFirst({
            where,
        });
    }

    //--------------------------------------------------
    // Find Many
    //--------------------------------------------------

    findMany(
        where?: Prisma.InvoiceAttachmentWhereInput,
    ) {
        return this.prisma.invoiceAttachment.findMany({
            where,
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    //--------------------------------------------------
    // Find Many With Relations
    //--------------------------------------------------

    findManyWithRelations(
        where?: Prisma.InvoiceAttachmentWhereInput,
    ) {
        return this.prisma.invoiceAttachment.findMany({
            where,
            include: {
                invoice: true,
                attachment: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    //--------------------------------------------------
    // Find By Invoice
    //--------------------------------------------------

    findByInvoice(
        invoiceId: string,
    ) {
        return this.prisma.invoiceAttachment.findMany({
            where: {
                invoiceId,
                deletedAt: null,
            },
            include: {
                attachment: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    //--------------------------------------------------
    // Find By Attachment
    //--------------------------------------------------

    findByAttachment(
        attachmentId: string,
    ) {
        return this.prisma.invoiceAttachment.findMany({
            where: {
                attachmentId,
                deletedAt: null,
            },
            include: {
                invoice: true,
            },
        });
    }

    //--------------------------------------------------
    // Exists
    //--------------------------------------------------

    async exists(
        where: Prisma.InvoiceAttachmentWhereInput,
    ): Promise<boolean> {

        const count =
            await this.prisma.invoiceAttachment.count({
                where,
            });

        return count > 0;
    }

    //--------------------------------------------------
    // Update
    //--------------------------------------------------

    update(
        id: string,
        data: Prisma.InvoiceAttachmentUpdateInput,
    ) {
        return this.prisma.invoiceAttachment.update({
            where: {
                id,
            },
            data,
        });
    }

    //--------------------------------------------------
    // Soft Delete
    //--------------------------------------------------

    delete(
        id: string,
    ) {
        return this.prisma.invoiceAttachment.update({
            where: {
                id,
            },
            data: {
                deletedAt: new Date(),
            },
        });
    }

    //--------------------------------------------------
    // Delete Many
    //--------------------------------------------------

    deleteMany(
        where: Prisma.InvoiceAttachmentWhereInput,
    ) {
        return this.prisma.invoiceAttachment.updateMany({
            where,
            data: {
                deletedAt: new Date(),
            },
        });
    }

    //--------------------------------------------------
    // Restore
    //--------------------------------------------------

    restore(
        id: string,
    ) {
        return this.prisma.invoiceAttachment.update({
            where: {
                id,
            },
            data: {
                deletedAt: null,
            },
        });
    }

    //--------------------------------------------------
    // Force Delete
    //--------------------------------------------------

    forceDelete(
        id: string,
    ) {
        return this.prisma.invoiceAttachment.delete({
            where: {
                id,
            },
        });
    }

    //--------------------------------------------------
    // Force Delete Many
    //--------------------------------------------------

    forceDeleteMany(
        where: Prisma.InvoiceAttachmentWhereInput,
    ) {
        return this.prisma.invoiceAttachment.deleteMany({
            where,
        });
    }

    //--------------------------------------------------
    // Count
    //--------------------------------------------------

    count(
        where?: Prisma.InvoiceAttachmentWhereInput,
    ) {
        return this.prisma.invoiceAttachment.count({
            where,
        });
    }
    //--------------------------------------------------
    // Find Active By Invoice
    //--------------------------------------------------

    findActiveByInvoice(
        invoiceId: string,
    ) {
        return this.prisma.invoiceAttachment.findMany({
            where: {
                invoiceId,
                deletedAt: null,
            },
            include: {
                attachment: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    //--------------------------------------------------
    // Find Deleted By Invoice
    //--------------------------------------------------

    findDeletedByInvoice(
        invoiceId: string,
    ) {
        return this.prisma.invoiceAttachment.findMany({
            where: {
                invoiceId,
                deletedAt: {
                    not: null,
                },
            },
            include: {
                attachment: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    //--------------------------------------------------
    // Find By Invoice With Relations
    //--------------------------------------------------

    findByInvoiceWithRelations(
        invoiceId: string,
    ) {
        return this.prisma.invoiceAttachment.findMany({
            where: {
                invoiceId,
            },
            include: {
                invoice: true,
                attachment: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    //--------------------------------------------------
    // Find By Attachment With Relations
    //--------------------------------------------------

    findByAttachmentWithRelations(
        attachmentId: string,
    ) {
        return this.prisma.invoiceAttachment.findMany({
            where: {
                attachmentId,
            },
            include: {
                invoice: true,
                attachment: true,
            },
        });
    }

    //--------------------------------------------------
    // Restore Many
    //--------------------------------------------------

    restoreMany(
        where: Prisma.InvoiceAttachmentWhereInput,
    ) {
        return this.prisma.invoiceAttachment.updateMany({
            where,
            data: {
                deletedAt: null,
            },
        });
    }

    //--------------------------------------------------
    // Exists By Invoice And Attachment
    //--------------------------------------------------

    async existsByInvoiceAndAttachment(
        invoiceId: string,
        attachmentId: string,
    ): Promise<boolean> {

        const count =
            await this.prisma.invoiceAttachment.count({
                where: {
                    invoiceId,
                    attachmentId,
                    deletedAt: null,
                },
            });

        return count > 0;
    }

    //--------------------------------------------------
    // Attach Exists
    //--------------------------------------------------

    attachExists(
        invoiceId: string,
        attachmentId: string,
    ) {
        return this.findFirst({
            invoiceId,
            attachmentId,
            deletedAt: null,
        });
    }

    //--------------------------------------------------
    // Detach All
    //--------------------------------------------------

    detachAll(
        invoiceId: string,
    ) {
        return this.prisma.invoiceAttachment.updateMany({
            where: {
                invoiceId,
                deletedAt: null,
            },
            data: {
                deletedAt: new Date(),
            },
        });
    }

    //--------------------------------------------------
    // Count By Invoice
    //--------------------------------------------------

    countByInvoice(
        invoiceId: string,
    ) {
        return this.prisma.invoiceAttachment.count({
            where: {
                invoiceId,
                deletedAt: null,
            },
        });
    }

    //--------------------------------------------------
    // Count By Attachment
    //--------------------------------------------------

    countByAttachment(
        attachmentId: string,
    ) {
        return this.prisma.invoiceAttachment.count({
            where: {
                attachmentId,
                deletedAt: null,
            },
        });
    }

}