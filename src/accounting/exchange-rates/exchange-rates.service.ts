import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExchangeRateDto } from './dto/create-exchange-rate.dto';
import { UpdateExchangeRateDto } from './dto/update-exchange-rate.dto';
import { ExchangeRateQueryDto } from './dto/exchange-rate-query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ExchangeRateService {
    constructor(private readonly prisma: PrismaService) { }

    // =====================================================
    // INTERNAL: COMMON WHERE BUILDER
    // =====================================================
    private buildWhere(query: ExchangeRateQueryDto): Prisma.ExchangeRateWhereInput {
        const where: Prisma.ExchangeRateWhereInput = {
            deletedAt: null,
        };

        if (query.currencyId) {
            where.currencyId = query.currencyId;
        }

        if (query.search) {
            where.OR = [
                {
                    source: {
                        contains: query.search,

                    },
                },
            ];
        }

        if (query.fromDate || query.toDate) {
            where.effectiveDate = {
                gte: query.fromDate ? new Date(query.fromDate) : undefined,
                lte: query.toDate ? new Date(query.toDate) : undefined,
            };
        }

        return where;
    }

    // =====================================================
    // CREATE (SAFE + IDENTITY GUARANTEE)
    // =====================================================
    async create(orgId: string, dto: CreateExchangeRateDto) {
        if (dto.rate <= 0) {
            throw new BadRequestException('Exchange rate must be greater than zero');
        }

        const date = new Date(dto.effectiveDate);

        // جلوگیری از duplicate در یک تاریخ
        const existing = await this.prisma.exchangeRate.findFirst({
            where: {
                currencyId: dto.currencyId,
                effectiveDate: date,
                deletedAt: null,
            },
        });

        if (existing) {
            throw new BadRequestException(
                'Exchange rate already exists for this currency and date',
            );
        }

        return this.prisma.exchangeRate.create({
            data: {
                organizationId: orgId,
                currencyId: dto.currencyId,
                rate: dto.rate,
                effectiveDate: date,
                source: dto.source,
            },
        });
    }

    // =====================================================
    // FIND ALL (ENTERPRISE LISTING)
    // =====================================================
    async findAll(query: ExchangeRateQueryDto) {
        const page = Math.max(Number(query.page || 1), 1);
        const limit = Math.min(Math.max(Number(query.limit || 20), 1), 100);
        const skip = (page - 1) * limit;

        const where = this.buildWhere(query);

        const orderBy: Prisma.ExchangeRateOrderByWithRelationInput = {
            [query.sortBy || 'effectiveDate']: query.sortOrder || 'desc',
        };

        const [data, total] = await this.prisma.$transaction([
            this.prisma.exchangeRate.findMany({
                where,
                skip,
                take: limit,
                orderBy,
            }),
            this.prisma.exchangeRate.count({ where }),
        ]);

        return {
            data,
            meta: {
                total,
                page,
                limit,
                lastPage: Math.ceil(total / limit),
            },
        };
    }

    // =====================================================
    // FIND ONE (SAFE READ)
    // =====================================================
    async findOne(id: string) {
        const item = await this.prisma.exchangeRate.findFirst({
            where: {
                id,
                deletedAt: null,
            },
        });

        if (!item) {
            throw new NotFoundException('Exchange rate not found');
        }

        return item;
    }

    // =====================================================
    // UPDATE (HISTORICAL SAFETY RULE)
    // =====================================================
    async update(id: string, dto: UpdateExchangeRateDto) {
        const existing = await this.findOne(id);

        // جلوگیری از تغییر تاریخ گذشته در سیستم مالی
        const isPast = new Date(existing.effectiveDate) < new Date();

        if (isPast && dto.rate) {
            throw new BadRequestException(
                'Cannot modify historical exchange rate',
            );
        }

        return this.prisma.exchangeRate.update({
            where: { id },
            data: {
                ...dto,
                effectiveDate: dto.effectiveDate
                    ? new Date(dto.effectiveDate)
                    : undefined,
            },
        });
    }

    // =====================================================
    // SOFT DELETE
    // =====================================================
    async remove(id: string) {
        await this.findOne(id);

        return this.prisma.exchangeRate.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                isActive: false,
            },
        });
    }

    // =====================================================
    // RESTORE (SAFE CHECK)
    // =====================================================
    async restore(id: string) {
        const item = await this.prisma.exchangeRate.findUnique({
            where: { id },
        });

        if (!item) {
            throw new NotFoundException('Exchange rate not found');
        }

        return this.prisma.exchangeRate.update({
            where: { id },
            data: {
                deletedAt: null,
                isActive: true,
            },
        });
    }

    // =====================================================
    // ACTIVATE / DEACTIVATE
    // =====================================================
    async activate(id: string) {
        await this.findOne(id);

        return this.prisma.exchangeRate.update({
            where: { id },
            data: { isActive: true },
        });
    }

    async deactivate(id: string) {
        await this.findOne(id);

        return this.prisma.exchangeRate.update({
            where: { id },
            data: { isActive: false },
        });
    }

    // =====================================================
    // SUMMARY (FINANCIAL SAFE)
    // =====================================================
    async summary(currencyId: string) {
        const rates = await this.prisma.exchangeRate.findMany({
            where: {
                currencyId,
                deletedAt: null,
            },
            orderBy: {
                effectiveDate: 'desc',
            },
        });

        if (rates.length === 0) {
            return {
                total: 0,
                latest: null,
                min: null,
                max: null,
            };
        }

        const values = rates.map((r) => Number(r.rate));

        return {
            total: rates.length,
            latest: rates[0],
            min: Math.min(...values),
            max: Math.max(...values),
        };
    }

    // =====================================================
    // LATEST RATE (CRITICAL FOR JOURNAL)
    // =====================================================
    async getLatest(currencyId: string) {
        const rate = await this.prisma.exchangeRate.findFirst({
            where: {
                currencyId,
                deletedAt: null,
                isActive: true,
            },
            orderBy: {
                effectiveDate: 'desc',
            },
        });

        if (!rate) {
            throw new NotFoundException('No exchange rate found');
        }

        return rate;
    }

    // =====================================================
    // HISTORICAL RATE (ACCOUNTING CORE)
    // =====================================================
    async getRateAtDate(currencyId: string, date: string) {
        const targetDate = new Date(date);

        const rate = await this.prisma.exchangeRate.findFirst({
            where: {
                currencyId,
                deletedAt: null,
                isActive: true,
                effectiveDate: {
                    lte: targetDate,
                },
            },
            orderBy: {
                effectiveDate: 'desc',
            },
        });

        if (!rate) {
            throw new NotFoundException(
                'No exchange rate found for selected date',
            );
        }

        return rate;
    }
}