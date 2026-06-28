import {
    BadRequestException,
    Injectable,
} from '@nestjs/common';

import { CostCenter } from '@prisma/client';

import { CostCentersRepository } from '../repositories/cost-centers.repository';

@Injectable()
export class CostCentersTreeService {
    constructor(
        private readonly repository: CostCentersRepository,
    ) { }

    //--------------------------------------------------
    // Build Tree
    //--------------------------------------------------

    async buildTree(
        organizationId: string,
    ) {
        const nodes =
            await this.repository.findMany({
                organizationId,
                deletedAt: null,
            });

        return this.buildHierarchy(
            nodes,
            null,
        );
    }

    //--------------------------------------------------
    // Recursive Builder
    //--------------------------------------------------

    private buildHierarchy(
        nodes: CostCenter[],
        parentId: string | null,
    ): any[] {
        return nodes
            .filter(
                node => node.parentId === parentId,
            )
            .map(node => ({
                ...node,
                children: this.buildHierarchy(
                    nodes,
                    node.id,
                ),
            }));
    }

    //--------------------------------------------------
    // Prevent Circular Tree
    //--------------------------------------------------

    async ensureNoCycle(
        nodeId: string,
        parentId: string,
    ): Promise<void> {

        if (nodeId === parentId) {
            throw new BadRequestException(
                'Cost Center cannot be parent of itself.',
            );
        }

        const descendants =
            await this.getDescendants(nodeId);

        const ids =
            descendants.map(d => d.id);

        if (ids.includes(parentId)) {
            throw new BadRequestException(
                'Circular hierarchy detected.',
            );
        }
    }

    //--------------------------------------------------
    // Descendants
    //--------------------------------------------------

    async getDescendants(
        id: string,
    ): Promise<CostCenter[]> {

        const all =
            await this.repository.findMany({
                deletedAt: null,
            });

        const result: CostCenter[] = [];

        const visit = (
            parentId: string,
        ) => {

            const children =
                all.filter(
                    x => x.parentId === parentId,
                );

            for (const child of children) {

                result.push(child);

                visit(child.id);
            }
        };

        visit(id);

        return result;
    }

    //--------------------------------------------------
    // Ancestors
    //--------------------------------------------------

    async getAncestors(
        id: string,
    ): Promise<CostCenter[]> {

        const all =
            await this.repository.findMany({
                deletedAt: null,
            });

        const map =
            new Map(
                all.map(x => [x.id, x]),
            );

        const result: CostCenter[] = [];

        let current = map.get(id);

        while (
            current &&
            current.parentId
        ) {

            const parent =
                map.get(current.parentId);

            if (!parent) {
                break;
            }

            result.unshift(parent);

            current = parent;
        }

        return result;
    }

    //--------------------------------------------------
    // Level
    //--------------------------------------------------

    async calculateLevel(
        id: string,
    ): Promise<number> {

        const ancestors =
            await this.getAncestors(id);

        return ancestors.length;
    }

    //--------------------------------------------------
    // Flatten Tree
    //--------------------------------------------------

    flattenTree(
        tree: any[],
    ): any[] {

        const result: any[] = [];

        const visit = (
            nodes: any[],
        ) => {

            for (const node of nodes) {

                result.push(node);

                if (
                    node.children?.length
                ) {
                    visit(node.children);
                }
            }
        };

        visit(tree);

        return result;
    }
    async moveNode(
        nodeId: string,
        parentId: string | undefined,
    ) {

        if (parentId) {
            await this.ensureNoCycle(
                nodeId,
                parentId,
            );
        }

        return this.repository.update(
            nodeId,
            {
                parentId,
            },
        );
    }
    async getChildren(
        parentId: string | null,
        organizationId: string,
    ) {
        return this.repository.findMany({
            organizationId,
            parentId,
            deletedAt: null,
        });
    }
    async getParent(
        id: string,
    ) {
        const node =
            await this.repository.findById(id);

        if (!node) {
            throw new BadRequestException(
                'Cost Center not found.',
            );
        }

        if (!node.parentId) {
            return null;
        }

        return this.repository.findById(
            node.parentId,
        );
    }
    async getRootNodes(
        organizationId: string,
    ) {
        return this.repository.findMany({
            organizationId,
            parentId: null,
            deletedAt: null,
        });
    }
    //--------------------------------------------------
    // Get Ancestors
    //--------------------------------------------------


}