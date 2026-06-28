import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';

import { CreateFxGainLossDto } from '../dto/create-fx-gain-loss.dto';
import { UpdateFxGainLossDto } from '../dto/update-fx-gain-loss.dto';
import { QueryFxGainLossDto } from '../dto/query-fx-gain-loss.dto';

@Injectable()
export class FxGainLossRepository {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    create(data: CreateFxGainLossDto) {
        return this.prisma.fxGainLossEntry.create({
            data,
        });
    }

    findMany(where: Prisma.FxGainLossEntryWhereInput) {
        return this.prisma.fxGainLossEntry.findMany({
            where,
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    findById(id: string) {
        return this.prisma.fxGainLossEntry.findUnique({
            where: {
                id,
            },
        });
    }

    update(
        id: string,
        data: UpdateFxGainLossDto,
    ) {
        return this.prisma.fxGainLossEntry.update({
            where: {
                id,
            },
            data,
        });
    }

    delete(id: string) {
        return this.prisma.fxGainLossEntry.delete({
            where: {
                id,
            },
        });
    }

    count(where: Prisma.FxGainLossEntryWhereInput) {
        return this.prisma.fxGainLossEntry.count({
            where,
        });
    }
}