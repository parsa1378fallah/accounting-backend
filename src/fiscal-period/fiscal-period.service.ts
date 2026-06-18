import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFiscalPeriodDto, UpdateFiscalPeriodDto } from './dto';

@Injectable()
export class FiscalPeriodService {
    constructor(private prisma: PrismaService) { }
    async create(orgId: string, dto: CreateFiscalPeriodDto) {
        const fiscalYear = await this.prisma.fiscalYear.findFirst({
            where: { id: dto.fiscalYearId, organizationId: orgId },
        })

        if (!fiscalYear) {
            throw new NotFoundException('fiscal year not found');
        }

        if (fiscalYear.isClosed) {
            throw new BadRequestException('fiscal year is closed')
        }

        const startDate = new Date(dto.startDate)
        const endDate = new Date(dto.endDate)

        if (startDate < fiscalYear.startAt || endDate > fiscalYear.endAt) {
            throw new BadRequestException('period must be inside the fiscal year')
        }

        const overlap = await this.prisma.fiscalPeriod.findFirst({
            where: {
                fiscalYearId: dto.fiscalYearId,
                startDate: { lte: endDate },
                endDate: { gte: startDate }
            }
        })

        if (overlap) {
            throw new BadRequestException('Period overlap existing priod')
        }

        return this.prisma.fiscalPeriod.create({
            data: {
                fiscalYearId: dto.fiscalYearId,
                name: dto.name,
                startDate,
                endDate
            }
        })

    }
    async update(
        orgId: string,
        id: string,
        dto: UpdateFiscalPeriodDto,
    ) {
        const period = await this.findOne(
            orgId,
            id,
        );

        if (period.isClosed) {
            throw new BadRequestException(
                'Period is closed',
            );
        }

        const fiscalYear =
            await this.prisma.fiscalYear.findFirst({
                where: {
                    id: period.fiscalYearId,
                    organizationId: orgId,
                },
            });

        if (!fiscalYear) {
            throw new NotFoundException(
                'Fiscal year not found',
            );
        }

        if (fiscalYear.isClosed) {
            throw new BadRequestException(
                'Fiscal year is closed',
            );
        }

        const startDate = dto.startDate
            ? new Date(dto.startDate)
            : period.startDate;

        const endDate = dto.endDate
            ? new Date(dto.endDate)
            : period.endDate;

        if (startDate >= endDate) {
            throw new BadRequestException(
                'Invalid date range',
            );
        }

        if (
            startDate < fiscalYear.startAt ||
            endDate > fiscalYear.endAt
        ) {
            throw new BadRequestException(
                'Period must be inside fiscal year',
            );
        }

        const overlap =
            await this.prisma.fiscalPeriod.findFirst({
                where: {
                    fiscalYearId: period.fiscalYearId,

                    id: {
                        not: id,
                    },

                    startDate: {
                        lte: endDate,
                    },

                    endDate: {
                        gte: startDate,
                    },
                },
            });

        if (overlap) {
            throw new BadRequestException(
                'Period overlaps existing period',
            );
        }

        return this.prisma.fiscalPeriod.update({
            where: {
                id,
            },

            data: {
                name: dto.name,
                startDate,
                endDate,
            },
        });
    }
    async findAll(orgId: string) {
        return this.prisma.fiscalPeriod.findMany({
            where: {
                fiscalYear: {
                    organizationId: orgId
                }
            },
            include: {
                fiscalYear: true
            },
            orderBy: {
                startDate: 'asc'
            }
        })
    }
    async findOne(orgId: string, id: string) {
        const fiscalPeriod = await this.prisma.fiscalPeriod.findUnique({
            where: { id, fiscalYear: { organizationId: orgId } },
            include: { fiscalYear: true }
        })
        if (!fiscalPeriod) {
            throw new NotFoundException('the fiscal period not found')
        }
        return fiscalPeriod
    }
    async close(
        orgId: string,
        id: string
    ) {
        const period = await this.findOne(orgId, id)
        if (period.isClosed) {
            throw new BadRequestException('Period already closed')
        }
        return this.prisma.fiscalPeriod.update({
            where: { id },
            data: { isClosed: true }
        })
    }


    async reopen(orgId: string, id: string) {
        const period = await this.findOne(orgId, id)
        if (!period.isClosed) {
            throw new BadRequestException('Period alreay open')
        }

        return this.prisma.fiscalPeriod.update({
            where: { id },
            data: {
                isClosed: false
            }
        })
    }

}
