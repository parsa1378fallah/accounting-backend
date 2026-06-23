import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

import {
    CreateFiscalPeriodDto,
    UpdateFiscalPeriodDto,
} from './dto';

@Injectable()
export class FiscalPeriodService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    /* ============================================================
        CREATE
    ============================================================ */

    async create(
        organizationId: string,
        dto: CreateFiscalPeriodDto,
    ) {
        const fiscalYear =
            await this.getFiscalYearOrThrow(
                organizationId,
                dto.fiscalYearId,
            );

        this.ensureFiscalYearOpen(fiscalYear);

        const startDate = this.toDate(dto.startDate);
        const endDate = this.toDate(dto.endDate);

        this.validateRange(startDate, endDate);

        this.ensureWithinFiscalYear(
            fiscalYear,
            startDate,
            endDate,
        );

        await this.ensureNoOverlap(
            dto.fiscalYearId,
            startDate,
            endDate,
        );

        return this.prisma.fiscalPeriod.create({
            data: {
                fiscalYearId: dto.fiscalYearId,
                name: dto.name,
                startDate,
                endDate,
            },
        });
    }

    /* ============================================================
        UPDATE
    ============================================================ */

    async update(
        organizationId: string,
        id: string,
        dto: UpdateFiscalPeriodDto,
    ) {
        const period =
            await this.getPeriodOrThrow(
                organizationId,
                id,
            );

        this.ensurePeriodOpen(period);

        const fiscalYear =
            await this.getFiscalYearOrThrow(
                organizationId,
                period.fiscalYearId,
            );

        this.ensureFiscalYearOpen(fiscalYear);

        const startDate = dto.startDate
            ? this.toDate(dto.startDate)
            : period.startDate;

        const endDate = dto.endDate
            ? this.toDate(dto.endDate)
            : period.endDate;

        this.validateRange(startDate, endDate);

        this.ensureWithinFiscalYear(
            fiscalYear,
            startDate,
            endDate,
        );

        await this.ensureNoOverlap(
            period.fiscalYearId,
            startDate,
            endDate,
            id,
        );

        return this.prisma.fiscalPeriod.update({
            where: { id },
            data: {
                name: dto.name,
                startDate,
                endDate,
            },
        });
    }

    /* ============================================================
        READ
    ============================================================ */

    async findAll(organizationId: string) {
        return this.prisma.fiscalPeriod.findMany({
            where: {
                fiscalYear: {
                    organizationId,
                },
            },
            include: {
                fiscalYear: true,
            },
            orderBy: {
                startDate: 'asc',
            },
        });
    }

    async findOne(
        organizationId: string,
        id: string,
    ) {
        return this.getPeriodOrThrow(
            organizationId,
            id,
        );
    }

    /* ============================================================
        CLOSE / REOPEN
    ============================================================ */

    async close(
        organizationId: string,
        id: string,
    ) {
        const period =
            await this.getPeriodOrThrow(
                organizationId,
                id,
            );

        if (period.isClosed) {
            throw new BadRequestException(
                'PERIOD_ALREADY_CLOSED',
            );
        }

        return this.prisma.fiscalPeriod.update({
            where: { id },
            data: { isClosed: true },
        });
    }

    async reopen(
        organizationId: string,
        id: string,
    ) {
        const period =
            await this.getPeriodOrThrow(
                organizationId,
                id,
            );

        if (!period.isClosed) {
            throw new BadRequestException(
                'PERIOD_ALREADY_OPEN',
            );
        }

        return this.prisma.fiscalPeriod.update({
            where: { id },
            data: { isClosed: false },
        });
    }

    /* ============================================================
        PRIVATE HELPERS
    ============================================================ */

    private toDate(value: string | Date) {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            throw new BadRequestException(
                'INVALID_DATE',
            );
        }
        return date;
    }

    private validateRange(
        start: Date,
        end: Date,
    ) {
        if (start >= end) {
            throw new BadRequestException(
                'INVALID_DATE_RANGE',
            );
        }
    }

    private ensureWithinFiscalYear(
        fiscalYear: any,
        start: Date,
        end: Date,
    ) {
        if (
            start < fiscalYear.startAt ||
            end > fiscalYear.endAt
        ) {
            throw new BadRequestException(
                'PERIOD_OUTSIDE_FISCAL_YEAR',
            );
        }
    }

    private async ensureNoOverlap(
        fiscalYearId: string,
        start: Date,
        end: Date,
        excludeId?: string,
    ) {
        const overlap =
            await this.prisma.fiscalPeriod.findFirst({
                where: {
                    fiscalYearId,

                    ...(excludeId && {
                        id: { not: excludeId },
                    }),

                    startDate: { lte: end },
                    endDate: { gte: start },
                },
            });

        if (overlap) {
            throw new BadRequestException(
                'PERIOD_OVERLAP',
            );
        }
    }

    private ensurePeriodOpen(period: any) {
        if (period.isClosed) {
            throw new BadRequestException(
                'PERIOD_IS_CLOSED',
            );
        }
    }

    private ensureFiscalYearOpen(fy: any) {
        if (fy.isClosed) {
            throw new BadRequestException(
                'FISCAL_YEAR_IS_CLOSED',
            );
        }
    }

    private async getFiscalYearOrThrow(
        organizationId: string,
        id: string,
    ) {
        const fy =
            await this.prisma.fiscalYear.findFirst({
                where: {
                    id,
                    organizationId,
                },
            });

        if (!fy) {
            throw new NotFoundException(
                'FISCAL_YEAR_NOT_FOUND',
            );
        }

        return fy;
    }

    private async getPeriodOrThrow(
        organizationId: string,
        id: string,
    ) {
        const period =
            await this.prisma.fiscalPeriod.findFirst({
                where: {
                    id,
                    fiscalYear: {
                        organizationId,
                    },
                },
                include: {
                    fiscalYear: true,
                },
            });

        if (!period) {
            throw new NotFoundException(
                'FISCAL_PERIOD_NOT_FOUND',
            );
        }

        return period;
    }
}