import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFiscalYearDto } from './dto';
import { UpdateFiscalaYearDto } from './dto/update-fiscal-year.dto';

@Injectable()
export class FiscalYearService {
    constructor(private prisma: PrismaService) { }

    async create(orgId: string, dto: CreateFiscalYearDto) {
        const startAt = dto.startAt;
        const endAt = dto.endAt;
        if (startAt >= endAt) {
            throw new BadRequestException("End date must be greater than start date")
        }

        const overlap = await this.prisma.fiscalYear.findFirst({
            where: {
                organizationId: orgId,
                startAt: {
                    lte: endAt
                },
                endAt: {
                    gte: startAt
                }
            }
        })

        if (overlap) {
            throw new BadRequestException("fiscal year overlaps with existing fiscal year")
        }
        return await this.prisma.fiscalYear.create({
            data: {
                organizationId: orgId,
                name: dto.name,
                startAt,
                endAt
            }
        })
    }

    async findAll(orgId: string) {
        return this.prisma.fiscalYear.findMany({
            where: { organizationId: orgId },
            include: {
                periods: true
            },
            orderBy: { startAt: 'desc' }
        })
    }
    async findOne(orgId: string, id: string) {
        const fiscalYear = await this.prisma.fiscalYear.findFirst({
            where: { id, organizationId: orgId },
            include: {
                periods: true,
                closing: true
            }
        })
        if (!fiscalYear) {
            throw new NotFoundException('fiscal year not found')
        }
        return fiscalYear
    }
    async update(orgId: string, id: string, dto: UpdateFiscalaYearDto) {
        const fiscalYear = await this.findOne(orgId, id);
        if (fiscalYear.isClosed) {
            throw new BadRequestException('Fiscal year is closed')
        }
        const startAt = dto.startAt ? new Date(dto.startAt) : fiscalYear.startAt;
        const endAt = dto.endAt ? new Date(dto.endAt) : fiscalYear.endAt

        if (startAt >= endAt) {
            throw new BadRequestException("Invalid date range")
        }

        const overlap = await this.prisma.fiscalYear.findFirst({
            where: {
                organizationId: orgId,
                id: {
                    not: id
                },
                startAt: { lte: endAt },
                endAt: { gte: startAt }
            }

        })
        if (overlap) {
            throw new BadRequestException('fiscal year overlaps with existing fiscal year')
        }

        return this.prisma.fiscalYear.update({
            where: { id },
            data: {
                ...dto,
                startAt,
                endAt
            }
        })
    }
    async close(orgId: string, id: string) {
        const fiscalYear = await this.findOne(orgId, id)
        if (fiscalYear.isClosed) {
            throw new BadRequestException('fiscal year is already closed')
        }
        const openPeriods = fiscalYear.periods.filter(p => !p.isClosed)
        if (openPeriods.length > 0) {
            throw new BadRequestException('all periods must be closed first')
        }
        return this.prisma.fiscalYear.update({
            where: { id },
            data: { isClosed: true }
        })
    }
    async reopen(orgId: string, id: string) {
        const fiscalYear = await this.findOne(orgId, id)
        if (!fiscalYear.closing) {
            throw new BadRequestException('fiscal year is already open')
        }
        return this.prisma.fiscalYear.update({
            where: { id },
            data: { isClosed: false }
        })
    }
    async findActive(orgId: string) {
        return this.prisma.fiscalYear.findFirst({
            where: { organizationId: orgId, isClosed: false },
            orderBy: { startAt: 'desc' }
        })
    }
}
