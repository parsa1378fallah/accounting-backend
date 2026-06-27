import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import {
    Prisma,
    JournalEntryStatus,
} from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';

import { JournalQueryDto } from '../dto/journal-query.dto';

@Injectable()
export class JournalQueryService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    /* ==========================================================
       Get By Id
    ========================================================== */

    async findById(id: string) {
        const journal = await this.prisma.journalEntry.findUnique({
            where: { id },
            include: {
                organization: true,
                fiscalYear: true,
                branch: true,

                lines: {
                    include: {
                        account: true,
                        costCenter: true,
                        project: true,
                        currency: true,
                    },
                    orderBy: {
                        sortOrder: 'asc',
                    },
                },

                approvals: {
                    include: {
                        approver: true,
                    },
                },

                attachments: {
                    include: {
                        attachment: true,
                    },
                },

                reversalOf: true,
                reversals: true,
            },
        });

        if (!journal) {
            throw new NotFoundException(
                'Journal not found',
            );
        }

        return journal;
    }

    /* ==========================================================
       Find
    ========================================================== */

    async find(query: JournalQueryDto) {
        const where = this.buildWhere(query);

        const page = query.page ?? 1;
        const limit = query.limit ?? 20;

        const skip = (page - 1) * limit;

        const [items, total] =
            await this.prisma.$transaction([

                this.prisma.journalEntry.findMany({
                    where,

                    skip,

                    take: limit,

                    include: {
                        branch: true,
                        fiscalYear: true,
                    },

                    orderBy: {
                        createdAt: 'desc',
                    },
                }),

                this.prisma.journalEntry.count({
                    where,
                }),
            ]);

        return {
            items,
            total,

            page,
            limit,

            totalPages: Math.ceil(total / limit),
        };
    }

    /* ==========================================================
       Exists
    ========================================================== */

    async exists(id: string) {
        const count =
            await this.prisma.journalEntry.count({
                where: {
                    id,
                },
            });

        return count > 0;
    }

    /* ==========================================================
       Count
    ========================================================== */

    async count(
        organizationId: string,
        status?: JournalEntryStatus,
    ) {
        return this.prisma.journalEntry.count({
            where: {
                organizationId,
                ...(status && { status }),
            },
        });
    }

    /* ==========================================================
       Last Journal
    ========================================================== */

    async getLastJournal(
        organizationId: string,
    ) {
        return this.prisma.journalEntry.findFirst({
            where: {
                organizationId,
            },

            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    /* ==========================================================
       Private
    ========================================================== */

    private buildWhere(
        query: JournalQueryDto,
    ): Prisma.JournalEntryWhereInput {

        const where: Prisma.JournalEntryWhereInput = {};

        if (query.organizationId) {
            where.organizationId =
                query.organizationId;
        }

        if (query.branchId) {
            where.branchId =
                query.branchId;
        }

        if (query.fiscalYearId) {
            where.fiscalYearId =
                query.fiscalYearId;
        }

        if (query.status) {
            where.status =
                query.status;
        }

        if (query.entryNumber) {
            where.entryNumber = {
                contains: query.entryNumber,
            };
        }

        if (
            query.fromDate ||
            query.toDate
        ) {
            where.createdAt = {};

            if (query.fromDate) {
                where.createdAt.gte =
                    new Date(query.fromDate);
            }

            if (query.toDate) {
                where.createdAt.lte =
                    new Date(query.toDate);
            }
        }

        return where;
    }
}