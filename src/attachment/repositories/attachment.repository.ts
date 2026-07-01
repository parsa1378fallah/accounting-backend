import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AttachmentRepository {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    //--------------------------------------------------
    // Create
    //--------------------------------------------------

    create(
        data: Prisma.AttachmentCreateInput,
    ) {
        return this.prisma.attachment.create({
            data,
        });
    }

    //--------------------------------------------------
    // Find Many
    //--------------------------------------------------

    findMany(
        where: Prisma.AttachmentWhereInput,
    ) {
        return this.prisma.attachment.findMany({
            where,
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    //--------------------------------------------------
    // Find Unique
    //--------------------------------------------------

    findById(
        id: string,
    ) {
        return this.prisma.attachment.findUnique({
            where: {
                id,
            },
        });
    }

    //--------------------------------------------------
    // Find First
    //--------------------------------------------------

    findFirst(
        where: Prisma.AttachmentWhereInput,
    ) {
        return this.prisma.attachment.findFirst({
            where,
        });
    }

    //--------------------------------------------------
    // Exists
    //--------------------------------------------------

    async exists(
        where: Prisma.AttachmentWhereInput,
    ): Promise<boolean> {
        const count =
            await this.prisma.attachment.count({
                where,
            });

        return count > 0;
    }

    //--------------------------------------------------
    // Update
    //--------------------------------------------------

    update(
        id: string,
        data: Prisma.AttachmentUpdateInput,
    ) {
        return this.prisma.attachment.update({
            where: {
                id,
            },
            data,
        });
    }

    //--------------------------------------------------
    // Soft Delete
    //--------------------------------------------------

    softDelete(
        id: string,
    ) {
        return this.prisma.attachment.update({
            where: {
                id,
            },
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
        return this.prisma.attachment.update({
            where: {
                id,
            },
            data: {
                deletedAt: null,
            },
        });
    }

    //--------------------------------------------------
    // Hard Delete
    //--------------------------------------------------

    delete(
        id: string,
    ) {
        return this.prisma.attachment.delete({
            where: {
                id,
            },
        });
    }

    //--------------------------------------------------
    // Count
    //--------------------------------------------------

    count(
        where: Prisma.AttachmentWhereInput,
    ) {
        return this.prisma.attachment.count({
            where,
        });
    }
    //--------------------------------------------------
    // Find By Checksum
    //--------------------------------------------------

    async findByChecksum(
        checksum: string,
    ) {
        return this.prisma.attachment.findFirst({
            where: {
                checksum,
                deletedAt: null,
            },
        });
    }
    //--------------------------------------------------
    // Exists By Checksum
    //--------------------------------------------------

    async existsByChecksum(
        checksum: string,
    ): Promise<boolean> {

        const count =
            await this.prisma.attachment.count({
                where: {
                    checksum,
                    deletedAt: null,
                },
            });

        return count > 0;
    }
    //--------------------------------------------------
    // Find By Path
    //--------------------------------------------------

    async findByPath(
        path: string,
    ) {
        return this.prisma.attachment.findFirst({
            where: {
                path,
                deletedAt: null,
            },
        });
    }
    //--------------------------------------------------
    // Exists By Path
    //--------------------------------------------------

    async existsByPath(
        path: string,
    ): Promise<boolean> {

        const count =
            await this.prisma.attachment.count({
                where: {
                    path,
                    deletedAt: null,
                },
            });

        return count > 0;
    }
    //--------------------------------------------------
    // Find By Filename
    //--------------------------------------------------

    async findByFilename(
        fileName: string,
    ) {
        return this.prisma.attachment.findMany({
            where: {
                fileName,
                deletedAt: null,
            },
        });
    }
    //--------------------------------------------------
    // Find Many By Ids
    //--------------------------------------------------

    async findManyByIds(
        ids: string[],
    ) {

        return this.prisma.attachment.findMany({
            where: {
                id: {
                    in: ids,
                },
                deletedAt: null,
            },
        });

    }
    //--------------------------------------------------
    // Count
    //--------------------------------------------------

    //--------------------------------------------------
    // Permanent Delete
    //--------------------------------------------------

    async permanentDelete(
        id: string,
    ) {

        return this.prisma.attachment.delete({
            where: {
                id,
            },
        });

    }
    //--------------------------------------------------
    // Update Path
    //--------------------------------------------------

    async updatePath(
        id: string,
        path: string,
    ) {

        return this.prisma.attachment.update({
            where: {
                id,
            },
            data: {
                path,
            },
        });

    }
    //--------------------------------------------------
    // Update Checksum
    //--------------------------------------------------

    async updateChecksum(
        id: string,
        checksum: string,
    ) {

        return this.prisma.attachment.update({
            where: {
                id,
            },
            data: {
                checksum,
            },
        });

    }
    //--------------------------------------------------
    // Total Size
    //--------------------------------------------------

    async getTotalSize(
        organizationId: string,
    ): Promise<number> {

        const result =
            await this.prisma.attachment.aggregate({

                where: {

                    organizationId,

                    deletedAt: null,

                },

                _sum: {

                    size: true,

                },

            });

        return result._sum.size ?? 0;

    }
    //--------------------------------------------------
    // Find Duplicates
    //--------------------------------------------------

    async findDuplicates(
        checksum: string,
    ) {

        return this.prisma.attachment.findMany({

            where: {

                checksum,

                deletedAt: null,

            },

        });

    }
    async createEntityLink(
        attachmentId: string,
        targetEntityId: string,
    ) {

        return this.prisma.invoiceAttachment.create({
            data: {
                attachmentId,
                entityId: targetEntityId,
                entityType: 'JOURNAL_ENTRY',
            },
        });

    }
    //--------------------------------------------------
    // Group By Checksum
    //--------------------------------------------------

    async groupByChecksum(
        organizationId: string,
    ) {

        return this.prisma.attachment.groupBy({

            by: [
                'checksum',
            ],

            where: {

                organizationId,

                deletedAt: null,

                checksum: {

                    not: null,

                },

            },

            _count: {

                _all: true,

            },

        });

    }
    async findByIdWithRelations(
        id: string,
    ) {

        return this.prisma.attachment.findUnique({

            where: {
                id,
            },

            include: {

                organization: true,







            },

        });

    }
}