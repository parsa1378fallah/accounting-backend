import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';

import { CreateCostCenterDto } from '../dto/create-cost-center.dto';
import { UpdateCostCenterDto } from '../dto/update-cost-center.dto';

@Injectable()
export class CostCentersRepository {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    //--------------------------------------------------
    // Create
    //--------------------------------------------------

    create(data: CreateCostCenterDto) {
        return this.prisma.costCenter.create({
            data,
        });
    }

    //--------------------------------------------------
    // Find Many
    //--------------------------------------------------

    findMany(
        where: Prisma.CostCenterWhereInput,
    ) {
        return this.prisma.costCenter.findMany({
            where,
            orderBy: [
                {
                    code: 'asc',
                },
            ],
        });
    }

    //--------------------------------------------------
    // Find By Id
    //--------------------------------------------------

    findById(id: string) {
        return this.prisma.costCenter.findFirst({
            where: {
                id,
                deletedAt: null,
            },
        });
    }

    //--------------------------------------------------
    // Find By Code
    //--------------------------------------------------

    findByCode(
        organizationId: string,
        code: string,
    ) {
        return this.prisma.costCenter.findFirst({
            where: {
                organizationId,
                code,
                deletedAt: null,
            },
        });
    }

    //--------------------------------------------------
    // Exists
    //--------------------------------------------------

    async exists(
        id: string,
    ): Promise<boolean> {
        const count =
            await this.prisma.costCenter.count({
                where: {
                    id,
                    deletedAt: null,
                },
            });

        return count > 0;
    }

    //--------------------------------------------------
    // Update
    //--------------------------------------------------

    update(
        id: string,
        data: UpdateCostCenterDto,
    ) {
        return this.prisma.costCenter.update({
            where: {
                id,
            },
            data,
        });
    }

    //--------------------------------------------------
    // Soft Delete
    //--------------------------------------------------

    softDelete(id: string) {
        return this.prisma.costCenter.update({
            where: {
                id,
            },
            data: {
                deletedAt: new Date(),
                isActive: false,
            },
        });
    }

    //--------------------------------------------------
    // Restore
    //--------------------------------------------------

    restore(id: string) {
        return this.prisma.costCenter.update({
            where: {
                id,
            },
            data: {
                deletedAt: null,
            },
        });
    }

    //--------------------------------------------------
    // Count
    //--------------------------------------------------

    count(
        where: Prisma.CostCenterWhereInput,
    ) {
        return this.prisma.costCenter.count({
            where,
        });
    }

    //--------------------------------------------------
    // Tree
    //--------------------------------------------------

    findChildren(
        parentId: string,
    ) {
        return this.prisma.costCenter.findMany({
            where: {
                parentId,
                deletedAt: null,
            },
            orderBy: {
                code: 'asc',
            },
        });
    }

    async hasChildren(
        id: string,
    ): Promise<boolean> {
        const count =
            await this.prisma.costCenter.count({
                where: {
                    parentId: id,
                    deletedAt: null,
                },
            });

        return count > 0;
    }

    //--------------------------------------------------
    // Tree (Recursive Support)
    //--------------------------------------------------

    findRootNodes(
        organizationId: string,
    ) {
        return this.prisma.costCenter.findMany({
            where: {
                organizationId,
                parentId: null,
                deletedAt: null,
            },
            orderBy: {
                code: 'asc',
            },
        });
    }

    //--------------------------------------------------
    // Activation
    //--------------------------------------------------

    activate(id: string) {
        return this.prisma.costCenter.update({
            where: {
                id,
            },
            data: {
                isActive: true,
            },
        });
    }

    deactivate(id: string) {
        return this.prisma.costCenter.update({
            where: {
                id,
            },
            data: {
                isActive: false,
            },
        });
    }
    async findRoots(
        organizationId: string,
    ) {
        return this.prisma.costCenter.findMany({
            where: {
                organizationId,
                parentId: null,
                deletedAt: null,
            },
            select: {
                id: true,
            },
        });
    }

    async findLeafs(
        organizationId: string,
    ) {
        return this.prisma.costCenter.findMany({
            where: {
                organizationId,
                deletedAt: null,
                children: {
                    none: {},
                },
            },
            select: {
                id: true,
            },
        });
    }
}