import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { CostCentersRepository } from '../repositories/cost-centers.repository';
import { CostCentersValidator } from '../validators/cost-centers.validator';
import { CostCentersMapper } from '../mappers/cost-centers.mapper';
import { CostCentersTreeService } from './cost-centers-tree.service';

import { CreateCostCenterDto } from '../dto/create-cost-center.dto';
import { UpdateCostCenterDto } from '../dto/update-cost-center.dto';
import { QueryCostCenterDto } from '../dto/query-cost-center.dto';

@Injectable()
export class CostCentersService {
    constructor(
        private readonly repository: CostCentersRepository,
        private readonly validator: CostCentersValidator,
        private readonly mapper: CostCentersMapper,
        private readonly treeService: CostCentersTreeService,
    ) { }

    //--------------------------------------------------
    // Create
    //--------------------------------------------------

    async create(
        dto: CreateCostCenterDto,
    ) {
        await this.validator.validateCreate(dto);

        const entity =
            await this.repository.create(dto);

        return this.mapper.toResponse(entity);
    }

    //--------------------------------------------------
    // Find All
    //--------------------------------------------------

    async findAll(
        query: QueryCostCenterDto,
    ) {
        const where: Prisma.CostCenterWhereInput = {
            deletedAt: null,
        };

        if (query.organizationId) {
            where.organizationId = query.organizationId;
        }

        if (query.parentId !== undefined) {
            where.parentId = query.parentId;
        }

        if (query.isActive !== undefined) {
            where.isActive = query.isActive;
        }

        if (query.code) {
            where.code = {
                contains: query.code,
            };
        }

        if (query.name) {
            where.name = {
                contains: query.name,
            };
        }

        const entities =
            await this.repository.findMany(where);

        return this.mapper.toResponseList(entities);
    }

    //--------------------------------------------------
    // Find One
    //--------------------------------------------------

    async findOne(
        id: string,
    ) {
        const entity =
            await this.repository.findById(id);

        if (!entity) {
            throw new NotFoundException(
                'Cost Center not found.',
            );
        }

        return this.mapper.toResponse(entity);
    }

    //--------------------------------------------------
    // Update
    //--------------------------------------------------

    async update(
        id: string,
        dto: UpdateCostCenterDto,
    ) {
        await this.validator.validateUpdate(
            id,
            dto,
        );

        const entity =
            await this.repository.update(
                id,
                dto,
            );

        return this.mapper.toResponse(entity);
    }

    //--------------------------------------------------
    // Delete
    //--------------------------------------------------

    async remove(
        id: string,
    ) {
        await this.validator.validateDelete(id);

        await this.repository.softDelete(id);

        return {
            success: true,
        };
    }

    //--------------------------------------------------
    // Restore
    //--------------------------------------------------

    async restore(
        id: string,
    ) {
        await this.validator.validateActivate(id);

        const entity =
            await this.repository.restore(id);

        return this.mapper.toResponse(entity);
    }

    //--------------------------------------------------
    // Activate
    //--------------------------------------------------

    async activate(
        id: string,
    ) {
        await this.validator.validateActivate(id);

        const entity =
            await this.repository.activate(id);

        return this.mapper.toResponse(entity);
    }

    //--------------------------------------------------
    // Deactivate
    //--------------------------------------------------

    async deactivate(
        id: string,
    ) {
        await this.validator.validateDeactivate(id);

        const entity =
            await this.repository.deactivate(id);

        return this.mapper.toResponse(entity);
    }

    //--------------------------------------------------
    // Tree
    //--------------------------------------------------

    async tree(
        organizationId: string,
    ) {
        return this.treeService.buildTree(
            organizationId,
        );
    }

    async summary(
        organizationId: string,
    ) {

        const [
            total,
            active,
            inactive,
            roots,
            leafs,
        ] = await Promise.all([

            this.repository.count({
                organizationId,
                deletedAt: null,
            }),

            this.repository.count({
                organizationId,
                deletedAt: null,
                isActive: true,
            }),

            this.repository.count({
                organizationId,
                deletedAt: null,
                isActive: false,
            }),

            this.repository.findRoots(
                organizationId,
            ),

            this.repository.findLeafs(
                organizationId,
            ),
        ]);

        return {
            total,
            active,
            inactive,
            roots: roots.length,
            leafs: leafs.length,
        };
    }
    async move(
        id: string,
        parentId: string | null,
    ) {
        if (!parentId) return

        await this.validator.validateUpdate(
            id,
            {
                parentId,
            },
        );



        const entity =
            await this.treeService.moveNode(
                id,
                parentId,
            );



        return this.mapper.toResponse(entity);
    }
    async children(
        organizationId: string,
        parentId: string | null,
    ) {
        const children =
            await this.treeService.getChildren(
                parentId,
                organizationId,
            );

        return this.mapper.toResponseList(
            children,
        );
    }
    async parent(
        id: string,
    ) {
        const parent =
            await this.treeService.getParent(id);

        if (!parent) {
            return null;
        }

        return this.mapper.toResponse(parent);
    }
    async roots(
        organizationId: string,
    ) {
        const roots =
            await this.treeService.getRootNodes(
                organizationId,
            );

        return this.mapper.toResponseList(
            roots,
        );
    }
    async ancestors(
        id: string,
    ) {
        const ancestors =
            await this.treeService.getAncestors(
                id,
            );

        return this.mapper.toResponseList(
            ancestors,
        );
    }
}