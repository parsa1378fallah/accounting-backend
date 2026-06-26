import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import {
    Account,
    AccountLevel,
    Prisma,
} from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';

import {
    CreateAccountDto,
    UpdateAccountDto,
    AccountQueryDto,
} from './dto';

@Injectable()
export class AccountsService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    // ============================================================
    // CREATE
    // ============================================================

    async create(dto: CreateAccountDto) {
        await this.validateCategory(
            dto.accountCategoryId,
        );

        await this.checkDuplicateCode(
            dto.organizationId,
            dto.code,
        );

        let level: AccountLevel = AccountLevel.GROUP;
        if (dto.parentId) {
            const parent =
                await this.validateParent(
                    dto.parentId,
                    dto.organizationId,
                );

            level =
                this.calculateLevel(parent);

            await this.prisma.account.update({
                where: {
                    id: parent.id,
                },
                data: {
                    isLeaf: false,
                },
            });
        }

        return this.prisma.account.create({
            data: {
                organizationId:
                    dto.organizationId,

                accountCategoryId:
                    dto.accountCategoryId,

                parentId: dto.parentId,

                code: dto.code.trim(),

                name: dto.name.trim(),

                level,

                isLeaf: true,
            },
        });
    }

    // ============================================================
    // FIND ALL
    // ============================================================

    async findAll(
        query: AccountQueryDto,
    ) {
        const {
            page = 1,
            limit = 20,
            search,
            organizationId,
            accountCategoryId,
            level,
            isActive,
            sortBy = 'code',
            order = 'asc',
        } = query;

        const where: Prisma.AccountWhereInput =
        {
            deletedAt: null,

            ...(organizationId && {
                organizationId,
            }),

            ...(accountCategoryId && {
                accountCategoryId,
            }),

            ...(level && {
                level,
            }),

            ...(isActive !== undefined && {
                isActive:
                    isActive === true

            }),

            ...(search && {
                OR: [
                    {
                        code: {
                            contains: search,
                        },
                    },
                    {
                        name: {
                            contains: search,
                        },
                    },
                ],
            }),
        };

        const skip =
            (page - 1) * limit;

        const [items, total] =
            await this.prisma.$transaction([
                this.prisma.account.findMany({
                    where,
                    skip,
                    take: Number(limit),

                    include: {
                        parent: true,
                        accountCategory: {
                            include: {
                                accountGroup: true,
                            },
                        },
                    },

                    orderBy: {
                        [sortBy]: order,
                    },
                }),

                this.prisma.account.count({
                    where,
                }),
            ]);

        return {
            data: items,

            meta: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(
                    total / limit,
                ),
            },
        };
    }

    // ============================================================
    // FIND ONE
    // ============================================================

    async findOne(id: string) {
        const account =
            await this.prisma.account.findFirst({
                where: {
                    id,
                    deletedAt: null,
                },

                include: {
                    parent: true,

                    children: true,

                    accountCategory: {
                        include: {
                            accountGroup: true,
                        },
                    },
                },
            });

        if (!account) {
            throw new NotFoundException(
                'Account not found',
            );
        }

        return account;
    }

    // ============================================================
    // UPDATE
    // ============================================================

    async update(
        id: string,
        dto: UpdateAccountDto,
    ) {
        const account =
            await this.findOne(id);

        if (
            dto.code &&
            dto.code !== account.code
        ) {
            await this.checkDuplicateCode(
                account.organizationId,
                dto.code,
                id,
            );
        }

        return this.prisma.account.update({
            where: { id },

            data: {
                ...(dto.name && {
                    name: dto.name.trim(),
                }),

                ...(dto.code && {
                    code: dto.code.trim(),
                }),

                ...(dto.accountCategoryId && {
                    accountCategoryId:
                        dto.accountCategoryId,
                }),
            },
        });
    }

    // ============================================================
    // DELETE
    // ============================================================

    async remove(id: string) {
        const account =
            await this.findOne(id);

        await this.ensureNotUsed(id);

        if (
            account.children.length > 0
        ) {
            throw new BadRequestException(
                'Account has child accounts',
            );
        }

        return this.prisma.account.update({
            where: { id },

            data: {
                deletedAt: new Date(),
                isActive: false,
            },
        });
    }

    // ============================================================
    // RESTORE
    // ============================================================

    async restore(id: string) {
        const account =
            await this.prisma.account.findUnique({
                where: { id },
            });

        if (!account) {
            throw new NotFoundException(
                'Account not found',
            );
        }

        if (!account.deletedAt) {
            throw new BadRequestException(
                'Account already active',
            );
        }

        return this.prisma.account.update({
            where: { id },

            data: {
                deletedAt: null,
                isActive: true,
            },
        });
    }

    // ============================================================
    // ACTIVATE
    // ============================================================

    async activate(id: string) {
        await this.findOne(id);

        return this.prisma.account.update({
            where: { id },

            data: {
                isActive: true,
            },
        });
    }

    // ============================================================
    // DEACTIVATE
    // ============================================================

    async deactivate(id: string) {
        await this.findOne(id);

        return this.prisma.account.update({
            where: { id },

            data: {
                isActive: false,
            },
        });
    }

    // ============================================================
    // SUMMARY
    // ============================================================

    async summary(
        organizationId?: string,
    ) {
        const where = {
            deletedAt: null,

            ...(organizationId && {
                organizationId,
            }),
        };

        const [
            total,
            active,
            inactive,
        ] =
            await this.prisma.$transaction([
                this.prisma.account.count({
                    where,
                }),

                this.prisma.account.count({
                    where: {
                        ...where,
                        isActive: true,
                    },
                }),

                this.prisma.account.count({
                    where: {
                        ...where,
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
    // TREE
    // ============================================================

    async tree(
        organizationId: string,
    ) {
        const accounts =
            await this.prisma.account.findMany({
                where: {
                    organizationId,
                    deletedAt: null,
                },

                orderBy: {
                    code: 'asc',
                },
            });

        return this.buildTree(
            accounts,
        );
    }

    // ============================================================
    // HELPERS
    // ============================================================

    private async validateCategory(
        categoryId: string,
    ) {
        const category =
            await this.prisma.accountCategory.findUnique({
                where: {
                    id: categoryId,
                },
            });

        if (!category) {
            throw new NotFoundException(
                'Account category not found',
            );
        }
    }

    private async checkDuplicateCode(
        organizationId: string,
        code: string,
        ignoreId?: string,
    ) {
        const account =
            await this.prisma.account.findFirst({
                where: {
                    organizationId,

                    code,

                    deletedAt: null,

                    ...(ignoreId && {
                        id: {
                            not: ignoreId,
                        },
                    }),
                },
            });

        if (account) {
            throw new ConflictException(
                'Account code already exists',
            );
        }
    }

    private async validateParent(
        parentId: string,
        organizationId: string,
    ) {
        const parent =
            await this.prisma.account.findFirst({
                where: {
                    id: parentId,
                    organizationId,
                    deletedAt: null,
                },
            });

        if (!parent) {
            throw new NotFoundException(
                'Parent account not found',
            );
        }

        if (
            parent.level ===
            AccountLevel.DETAIL
        ) {
            throw new BadRequestException(
                'Detail account cannot have children',
            );
        }

        return parent;
    }

    private calculateLevel(
        parent: Account,
    ): AccountLevel {
        switch (parent.level) {
            case AccountLevel.GROUP:
                return AccountLevel.GENERAL;

            case AccountLevel.GENERAL:
                return AccountLevel.SUBSIDIARY;

            case AccountLevel.SUBSIDIARY:
                return AccountLevel.DETAIL;

            default:
                throw new BadRequestException(
                    'Invalid account hierarchy',
                );
        }
    }

    private async ensureNotUsed(
        accountId: string,
    ) {
        const count =
            await this.prisma.journalEntryLine.count({
                where: {
                    accountId,
                },
            });

        if (count > 0) {
            throw new BadRequestException(
                'Account is used in journal entries',
            );
        }
    }

    private buildTree(
        accounts: Account[],
    ) {
        const map = new Map();

        accounts.forEach((item) =>
            map.set(item.id, {
                ...item,
                children: [],
            }),
        );

        const roots: any[] = [];

        accounts.forEach((item) => {
            if (!item.parentId) {
                roots.push(
                    map.get(item.id),
                );

                return;
            }

            const parent =
                map.get(item.parentId);

            if (parent) {
                parent.children.push(
                    map.get(item.id),
                );
            }
        });

        return roots;
    }
}