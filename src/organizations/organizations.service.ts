import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { Prisma, PrismaClient } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';

import {
    CreateOrganizationDto,
    UpdateOrganizationDto,
    OrganizationQueryDto,
} from './dto';

@Injectable()
export class OrganizationsService {
    constructor(private readonly prisma: PrismaService) { }

    // ============================================================
    // Create
    // ============================================================

    async create(dto: CreateOrganizationDto) {
        await this.checkDuplicate(dto);

        const organizationCode =
            await this.generateOrganizationCode();

        return this.prisma.organization.create({
            data: {
                code: organizationCode,

                name: dto.name,
                legalName: dto.legalName,
                nationalId: dto.nationalId,
                taxNumber: dto.taxNumber,
                phone: dto.phone,
                email: dto.email,
                address: dto.address,
            },
        });
    }

    // ============================================================
    // Find All
    // ============================================================

    async findAll(query: OrganizationQueryDto) {
        const {
            page = 1,
            limit = 20,
            search,
            isActive,
            sortBy = 'createdAt',
            order = 'desc',
        } = query;

        const skip = (page - 1) * limit;

        const where: Prisma.OrganizationWhereInput = {
            deletedAt: null,

            ...(isActive !== undefined && {
                isActive:
                    isActive === true || isActive === 'true',
            }),

            ...(search && {
                OR: [
                    {
                        name: {
                            contains: search,
                        },
                    },
                    {
                        legalName: {
                            contains: search,
                        },
                    },
                    {
                        nationalId: {
                            contains: search,
                        },
                    },
                    {
                        taxNumber: {
                            contains: search,
                        },
                    },
                    {
                        email: {
                            contains: search,
                        },
                    },
                    {
                        phone: {
                            contains: search,
                        },
                    },
                ],
            }),
        };

        const [items, total] =
            await this.prisma.$transaction([
                this.prisma.organization.findMany({
                    where,
                    skip,
                    take: Number(limit),
                    orderBy: {
                        [sortBy]: order,
                    },
                }),

                this.prisma.organization.count({
                    where,
                }),
            ]);

        return {
            data: items,

            meta: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    // ============================================================
    // Find One
    // ============================================================

    async findOne(id: string) {
        const organization =
            await this.prisma.organization.findFirst({
                where: {
                    id,
                    deletedAt: null,
                },
            });

        if (!organization) {
            throw new NotFoundException(
                'Organization not found',
            );
        }

        return organization;
    }

    // ============================================================
    // Update
    // ============================================================

    async update(
        id: string,
        dto: UpdateOrganizationDto,
    ) {
        await this.findOne(id);

        await this.checkDuplicate(dto, id);

        return this.prisma.organization.update({
            where: { id },
            data: dto,
        });
    }

    // ============================================================
    // Delete
    // ============================================================

    async remove(id: string) {
        await this.findOne(id);

        return this.prisma.organization.update({
            where: { id },

            data: {
                deletedAt: new Date(),
                isActive: false,
            },
        });
    }

    // ============================================================
    // Restore
    // ============================================================

    async restore(id: string) {
        const organization =
            await this.prisma.organization.findUnique({
                where: { id },
            });

        if (!organization) {
            throw new NotFoundException(
                'Organization not found',
            );
        }

        if (!organization.deletedAt) {
            throw new BadRequestException(
                'Organization is already active',
            );
        }

        return this.prisma.organization.update({
            where: { id },

            data: {
                deletedAt: null,
                isActive: true,
            },
        });
    }

    // ============================================================
    // Activate
    // ============================================================

    async activate(id: string) {
        await this.findOne(id);

        return this.prisma.organization.update({
            where: { id },

            data: {
                isActive: true,
            },
        });
    }

    // ============================================================
    // Deactivate
    // ============================================================

    async deactivate(id: string) {
        await this.findOne(id);

        return this.prisma.organization.update({
            where: { id },

            data: {
                isActive: false,
            },
        });
    }

    // ============================================================
    // Summary
    // ============================================================

    async summary() {
        const [total, active, inactive] =
            await this.prisma.$transaction([
                this.prisma.organization.count({
                    where: {
                        deletedAt: null,
                    },
                }),

                this.prisma.organization.count({
                    where: {
                        deletedAt: null,
                        isActive: true,
                    },
                }),

                this.prisma.organization.count({
                    where: {
                        deletedAt: null,
                        isActive: false,
                    },
                }),
            ]);

        return {
            total,
            active,
            inactive,
        };
    }

    // ============================================================
    // Duplicate Check
    // ============================================================

    private async checkDuplicate(
        dto: Partial<CreateOrganizationDto>,
        ignoreId?: string,
    ) {
        if (!dto.nationalId && !dto.taxNumber) {
            return;
        }

        const organization =
            await this.prisma.organization.findFirst({
                where: {
                    deletedAt: null,

                    ...(ignoreId && {
                        id: {
                            not: ignoreId,
                        },
                    }),

                    OR: [
                        dto.nationalId
                            ? {
                                nationalId: dto.nationalId,
                            }
                            : undefined,

                        dto.taxNumber
                            ? {
                                taxNumber: dto.taxNumber,
                            }
                            : undefined,
                    ].filter(Boolean) as Prisma.OrganizationWhereInput[],
                },
            });

        if (organization) {
            throw new ConflictException(
                'Organization already exists.',
            );
        }
    }
    private async generateOrganizationCode(): Promise<string> {
        const count = await this.prisma.organization.count();

        return `ORG${String(count + 1).padStart(5, '0')}`;
    }
}