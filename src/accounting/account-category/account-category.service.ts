import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

import {
    CreateAccountCategoryDto,
    UpdateAccountCategoryDto,
    AccountCategoryQueryDto,
} from './dto';

@Injectable()
export class AccountCategoriesService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async create(
        dto: CreateAccountCategoryDto,
    ) {
        const group =
            await this.prisma.accountGroup.findUnique({
                where: {
                    id: dto.accountGroupId,
                },
            });

        if (!group) {
            throw new NotFoundException(
                'Account group not found',
            );
        }

        const duplicate =
            await this.prisma.accountCategory.findFirst({
                where: {
                    accountGroupId: dto.accountGroupId,
                    code: dto.code,
                },
            });

        if (duplicate) {
            throw new ConflictException(
                'Category code already exists in this group',
            );
        }

        return this.prisma.accountCategory.create({
            data: {
                accountGroupId: dto.accountGroupId,
                code: dto.code.trim(),
                name: dto.name.trim(),
            },
        });
    }

    async findAll(
        query: AccountCategoryQueryDto,
    ) {
        const {
            search,
            accountGroupId,
        } = query;

        return this.prisma.accountCategory.findMany({
            where: {
                ...(accountGroupId && {
                    accountGroupId,
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
            },

            include: {
                accountGroup: true,

                _count: {
                    select: {
                        accounts: true,
                    },
                },
            },

            orderBy: {
                code: 'asc',
            },
        });
    }

    async findOne(id: string) {
        const category =
            await this.prisma.accountCategory.findUnique({
                where: { id },

                include: {
                    accountGroup: true,

                    accounts: true,
                },
            });

        if (!category) {
            throw new NotFoundException(
                'Account category not found',
            );
        }

        return category;
    }

    async update(
        id: string,
        dto: UpdateAccountCategoryDto,
    ) {
        await this.findOne(id);

        if (dto.code) {
            const current =
                await this.prisma.accountCategory.findUnique({
                    where: { id },
                });

            const duplicate =
                await this.prisma.accountCategory.findFirst({
                    where: {
                        accountGroupId:
                            current!.accountGroupId,

                        code: dto.code,

                        id: {
                            not: id,
                        },
                    },
                });

            if (duplicate) {
                throw new ConflictException(
                    'Category code already exists',
                );
            }
        }

        return this.prisma.accountCategory.update({
            where: { id },

            data: {
                ...(dto.code && {
                    code: dto.code.trim(),
                }),

                ...(dto.name && {
                    name: dto.name.trim(),
                }),

                ...(dto.accountGroupId && {
                    accountGroupId:
                        dto.accountGroupId,
                }),
            },
        });
    }

    async remove(id: string) {
        const count =
            await this.prisma.account.count({
                where: {
                    accountCategoryId: id,
                },
            });

        if (count > 0) {
            throw new BadRequestException(
                'Cannot delete category with accounts',
            );
        }

        return this.prisma.accountCategory.delete({
            where: { id },
        });
    }

    async summary() {
        const [
            totalCategories,
            totalAccounts,
        ] =
            await this.prisma.$transaction([
                this.prisma.accountCategory.count(),
                this.prisma.account.count(),
            ]);

        return {
            totalCategories,
            totalAccounts,
        };
    }
}