import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

import {
    CreateFiscalYearDto,
    UpdateFiscalYearDto,
} from './dto';

import { FISCAL_YEAR_ERRORS } from './constants/fiscal-year.constants';

@Injectable()
export class FiscalYearService {
    constructor(private readonly prisma: PrismaService) { }

    /* ============================================================
        CREATE
    ============================================================ */

    async create(organizationId: string, dto: CreateFiscalYearDto) {
        this.validateDateRange(dto.startAt, dto.endAt);

        await this.ensureNoOverlap(
            organizationId,
            dto.startAt,
            dto.endAt,
        );

        return this.prisma.fiscalYear.create({
            data: {
                organizationId,
                ...dto,
            },
        });
    }

    /* ============================================================
        READ
    ============================================================ */

    async findAll(organizationId: string) {
        return this.prisma.fiscalYear.findMany({
            where: { organizationId },
            include: { periods: true },
            orderBy: { startAt: 'desc' },
        });
    }

    async findOne(organizationId: string, id: string) {
        return this.getFiscalYearOrThrow(organizationId, id);
    }

    async findActive(organizationId: string) {
        return this.prisma.fiscalYear.findFirst({
            where: {
                organizationId,
                isClosed: false,
            },
            orderBy: { startAt: 'desc' },
        });
    }

    /* ============================================================
        UPDATE
    ============================================================ */

    async update(
        organizationId: string,
        id: string,
        dto: UpdateFiscalYearDto,
    ) {
        const fiscalYear = await this.getFiscalYearOrThrow(
            organizationId,
            id,
        );

        this.ensureNotClosed(fiscalYear);

        const startAt = dto.startAt ?? fiscalYear.startAt;
        const endAt = dto.endAt ?? fiscalYear.endAt;

        this.validateDateRange(startAt, endAt);

        await this.ensureNoOverlap(
            organizationId,
            startAt,
            endAt,
            id,
        );

        return this.prisma.fiscalYear.update({
            where: { id },
            data: {
                ...dto,
                startAt,
                endAt,
            },
        });
    }

    /* ============================================================
        CLOSE
    ============================================================ */

    async close(organizationId: string, id: string) {
        const fiscalYear = await this.getFiscalYearOrThrow(
            organizationId,
            id,
        );

        if (fiscalYear.isClosed) {
            throw new BadRequestException(
                FISCAL_YEAR_ERRORS.ALREADY_CLOSED,
            );
        }

        const hasOpenPeriods = fiscalYear.periods.some(
            (p) => !p.isClosed,
        );

        if (hasOpenPeriods) {
            throw new BadRequestException(
                FISCAL_YEAR_ERRORS.OPEN_PERIOD_EXISTS,
            );
        }

        return this.prisma.fiscalYear.update({
            where: { id },
            data: { isClosed: true },
        });
    }

    /* ============================================================
        REOPEN
    ============================================================ */

    async reopen(organizationId: string, id: string) {
        const fiscalYear = await this.getFiscalYearOrThrow(
            organizationId,
            id,
        );

        if (!fiscalYear.isClosed) {
            throw new BadRequestException(
                FISCAL_YEAR_ERRORS.ALREADY_OPEN,
            );
        }

        return this.prisma.fiscalYear.update({
            where: { id },
            data: { isClosed: false },
        });
    }

    /* ============================================================
        HELPERS
    ============================================================ */

    private async getFiscalYearOrThrow(
        organizationId: string,
        id: string,
    ) {
        const fiscalYear = await this.prisma.fiscalYear.findFirst({
            where: { id, organizationId },
            include: { periods: true, closing: true },
        });

        if (!fiscalYear) {
            throw new NotFoundException(
                FISCAL_YEAR_ERRORS.NOT_FOUND,
            );
        }

        return fiscalYear;
    }

    private validateDateRange(startAt: Date, endAt: Date) {
        if (startAt >= endAt) {
            throw new BadRequestException(
                FISCAL_YEAR_ERRORS.INVALID_DATE_RANGE,
            );
        }
    }

    private async ensureNoOverlap(
        organizationId: string,
        startAt: Date,
        endAt: Date,
        excludeId?: string,
    ) {
        const overlap = await this.prisma.fiscalYear.findFirst({
            where: {
                organizationId,
                ...(excludeId && {
                    id: { not: excludeId },
                }),
                startAt: { lte: endAt },
                endAt: { gte: startAt },
            },
        });

        if (overlap) {
            throw new BadRequestException(
                FISCAL_YEAR_ERRORS.OVERLAP,
            );
        }
    }

    private ensureNotClosed(fiscalYear: { isClosed: boolean }) {
        if (fiscalYear.isClosed) {
            throw new BadRequestException(
                FISCAL_YEAR_ERRORS.ALREADY_CLOSED,
            );
        }
    }
}