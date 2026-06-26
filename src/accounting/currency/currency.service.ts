import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import {
    Currency,
    Prisma,
} from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';

import {
    CreateCurrencyDto,
    CurrencyQueryDto,
    UpdateCurrencyDto,
} from './dto';

@Injectable()
export class CurrencyService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    // ============================================================
    // Create
    // ============================================================

    async create(dto: CreateCurrencyDto) {
        await this.validateCreate(dto);

        const payload =
            this.buildCreatePayload(dto);

        if (dto.isBase) {
            await this.clearCurrentBaseCurrency();
        }

        return this.prisma.currency.create({
            data: payload,
        });
    }

    // ============================================================
    // Find All
    // ============================================================

    async findAll(query: CurrencyQueryDto) {
        const {
            page = 1,
            limit = 20,
            sortBy = 'createdAt',
            order = 'desc',
        } = query;

        const where =
            this.buildWhereClause(query);

        const skip =
            (Number(page) - 1) *
            Number(limit);

        const [items, total] =
            await this.prisma.$transaction([
                this.prisma.currency.findMany({
                    where,
                    skip,
                    take: Number(limit),
                    orderBy: {
                        [sortBy]: order,
                    },
                }),

                this.prisma.currency.count({
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
                    total / Number(limit),
                ),
            },
        };
    }

    // ============================================================
    // Find One
    // ============================================================

    async findOne(id: string) {
        return this.ensureExists(id);
    }

    // ============================================================
    // Update
    // ============================================================

    async update(
        id: string,
        dto: UpdateCurrencyDto,
    ) {
        const current =
            await this.ensureExists(id);

        await this.validateUpdate(
            current,
            dto,
        );

        const payload =
            this.buildUpdatePayload(dto);

        if (dto.isBase === true) {
            await this.clearCurrentBaseCurrency(
                id,
            );
        }

        return this.prisma.currency.update({
            where: { id },
            data: payload,
        });
    }

    // ============================================================
    // Delete
    // ============================================================

    async remove(id: string) {
        await this.validateDelete(id);

        return this.prisma.currency.update({
            where: { id },

            data: {
                deletedAt: new Date(),
                isActive: false,
            },
        });
    }

    // ============================================================
    // Activate
    // ============================================================

    async activate(id: string) {
        await this.ensureExists(id);

        return this.prisma.currency.update({
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
        const currency =
            await this.ensureExists(id);

        await this.ensureCanDeactivate(
            currency,
        );

        return this.prisma.currency.update({
            where: { id },

            data: {
                isActive: false,
            },
        });
    }

    // ============================================================
    // Set Base Currency
    // ============================================================

    async setBaseCurrency(id: string) {
        await this.ensureExists(id);

        await this.clearCurrentBaseCurrency(
            id,
        );

        await this.prisma.currency.update({
            where: { id },

            data: {
                isBase: true,
                isActive: true,
            },
        });

        return this.findOne(id);
    }
    async restore(id: string) {
        const currency = await this.prisma.currency.findUnique({
            where: { id },
        });

        if (!currency) {
            throw new NotFoundException(
                'Currency not found',
            );
        }

        if (!currency.deletedAt) {
            throw new BadRequestException(
                'Currency is already active',
            );
        }

        return this.prisma.currency.update({
            where: { id },

            data: {
                deletedAt: null,
                isActive: true,
            },
        });
    }

    // ============================================================
    // Summary
    // ============================================================

    async summary() {
        const [
            total,
            active,
            inactive,
            baseCurrencies,
        ] =
            await this.prisma.$transaction([
                this.prisma.currency.count({
                    where: {
                        deletedAt: null,
                    },
                }),

                this.prisma.currency.count({
                    where: {
                        deletedAt: null,
                        isActive: true,
                    },
                }),

                this.prisma.currency.count({
                    where: {
                        deletedAt: null,
                        isActive: false,
                    },
                }),

                this.prisma.currency.count({
                    where: {
                        deletedAt: null,
                        isBase: true,
                    },
                }),
            ]);

        return {
            total,
            active,
            inactive,
            baseCurrencies,
        };
    }

    // ============================================================
    // Validation Layer
    // ============================================================

    private async validateCreate(
        dto: CreateCurrencyDto,
    ) {
        await this.ensureCodeUnique(
            dto.code,
        );
    }

    private async validateUpdate(
        current: Currency,
        dto: UpdateCurrencyDto,
    ) {
        if (
            dto.code &&
            dto.code.toUpperCase() !==
            current.code
        ) {
            await this.ensureCodeUnique(
                dto.code,
                current.id,
            );
        }

        if (
            current.isBase &&
            dto.isActive === false
        ) {
            throw new BadRequestException(
                'Base currency cannot be deactivated',
            );
        }
    }

    private async validateDelete(
        id: string,
    ) {
        const currency =
            await this.ensureExists(id);

        await this.ensureCanDelete(
            currency,
        );
    }

    // ============================================================
    // Business Rules
    // ============================================================

    private async ensureExists(
        id: string,
    ): Promise<Currency> {
        const currency =
            await this.prisma.currency.findFirst({
                where: {
                    id,
                    deletedAt: null,
                },
            });

        if (!currency) {
            throw new NotFoundException(
                'Currency not found',
            );
        }

        return currency;
    }

    private async ensureCodeUnique(
        code: string,
        ignoreId?: string,
    ) {
        const currency =
            await this.prisma.currency.findFirst({
                where: {
                    code: code.toUpperCase(),

                    deletedAt: null,

                    ...(ignoreId && {
                        id: {
                            not: ignoreId,
                        },
                    }),
                },
            });

        if (currency) {
            throw new ConflictException(
                'Currency code already exists',
            );
        }
    }

    private async ensureCanDelete(
        currency: Currency,
    ) {
        if (currency.isBase) {
            throw new BadRequestException(
                'Base currency cannot be deleted',
            );
        }
    }

    private async ensureCanDeactivate(
        currency: Currency,
    ) {
        if (currency.isBase) {
            throw new BadRequestException(
                'Base currency cannot be deactivated',
            );
        }
    }

    // ============================================================
    // Query Builders
    // ============================================================

    private buildWhereClause(
        query: CurrencyQueryDto,
    ): Prisma.CurrencyWhereInput {
        const where:
            Prisma.CurrencyWhereInput = {
            deletedAt: null,
        };

        if (query.search) {
            where.OR = [
                {
                    code: {
                        contains:
                            query.search,
                    },
                },
                {
                    name: {
                        contains:
                            query.search,
                    },
                },
                {
                    symbol: {
                        contains:
                            query.search,
                    },
                },
            ];
        }

        if (
            query.isActive !== undefined
        ) {
            where.isActive =
                query.isActive === 'true';
        }

        return where;
    }

    private buildCreatePayload(
        dto: CreateCurrencyDto,
    ): Prisma.CurrencyCreateInput {
        return {
            code:
                dto.code.toUpperCase(),

            name: dto.name,

            symbol: dto.symbol,

            isBase:
                dto.isBase ?? false,

            isActive:
                dto.isActive ?? true,

            decimalPlaces:
                dto.decimalPlaces ?? 2,
        };
    }

    private buildUpdatePayload(
        dto: UpdateCurrencyDto,
    ): Prisma.CurrencyUpdateInput {
        return {
            ...(dto.code && {
                code:
                    dto.code.toUpperCase(),
            }),

            ...(dto.name !== undefined && {
                name: dto.name,
            }),

            ...(dto.symbol !== undefined && {
                symbol: dto.symbol,
            }),

            ...(dto.isBase !== undefined && {
                isBase: dto.isBase,
            }),

            ...(dto.isActive !== undefined && {
                isActive: dto.isActive,
            }),

            ...(dto.decimalPlaces !==
                undefined && {
                decimalPlaces:
                    dto.decimalPlaces,
            }),
        };
    }

    // ============================================================
    // Internal Helpers
    // ============================================================

    private async clearCurrentBaseCurrency(
        ignoreId?: string,
    ) {
        await this.prisma.currency.updateMany({
            where: {
                isBase: true,

                ...(ignoreId && {
                    id: {
                        not: ignoreId,
                    },
                }),
            },

            data: {
                isBase: false,
            },
        });
    }
}