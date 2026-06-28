import {
    BadRequestException,
    Injectable,
} from '@nestjs/common';

import { CostCentersRepository } from '../repositories/cost-centers.repository';
import { CostCentersTreeService } from '../services/cost-centers-tree.service';

import { CreateCostCenterDto } from '../dto/create-cost-center.dto';
import { UpdateCostCenterDto } from '../dto/update-cost-center.dto';

@Injectable()
export class CostCentersValidator {
    constructor(
        private readonly repository: CostCentersRepository,
        private readonly treeService: CostCentersTreeService,
    ) { }

    //--------------------------------------------------
    // Create
    //--------------------------------------------------

    async validateCreate(
        dto: CreateCostCenterDto,
    ): Promise<void> {

        await this.ensureUniqueCode(
            dto.organizationId,
            dto.code,
        );

        if (dto.parentId) {
            await this.ensureParentExists(
                dto.parentId,
            );
        }
    }

    //--------------------------------------------------
    // Update
    //--------------------------------------------------

    async validateUpdate(
        id: string,
        dto: UpdateCostCenterDto,
    ): Promise<void> {

        await this.ensureExists(id);

        if (dto.parentId) {

            await this.ensureParentExists(
                dto.parentId,
            );

            await this.treeService.ensureNoCycle(
                id,
                dto.parentId,
            );
        }
    }

    //--------------------------------------------------
    // Delete
    //--------------------------------------------------

    async validateDelete(
        id: string,
    ): Promise<void> {

        await this.ensureExists(id);

        const hasChildren =
            await this.repository.hasChildren(id);

        if (hasChildren) {
            throw new BadRequestException(
                'Cost center has child nodes.',
            );
        }

        /**
         * بعداً بررسی می‌شود:
         *
         * Journal Lines
         * Allocation
         * Budget
         */
    }

    //--------------------------------------------------
    // Activate
    //--------------------------------------------------

    async validateActivate(
        id: string,
    ) {
        await this.ensureExists(id);
    }

    //--------------------------------------------------
    // Deactivate
    //--------------------------------------------------

    async validateDeactivate(
        id: string,
    ) {
        await this.ensureExists(id);
    }

    //--------------------------------------------------
    // Exists
    //--------------------------------------------------

    private async ensureExists(
        id: string,
    ) {

        const exists =
            await this.repository.exists(id);

        if (!exists) {
            throw new BadRequestException(
                'Cost Center not found.',
            );
        }
    }

    //--------------------------------------------------
    // Parent
    //--------------------------------------------------

    private async ensureParentExists(
        id: string,
    ) {

        const exists =
            await this.repository.exists(id);

        if (!exists) {
            throw new BadRequestException(
                'Parent Cost Center not found.',
            );
        }
    }

    //--------------------------------------------------
    // Unique Code
    //--------------------------------------------------

    private async ensureUniqueCode(
        organizationId: string,
        code: string,
    ) {

        const exists =
            await this.repository.findByCode(
                organizationId,
                code,
            );

        if (exists) {
            throw new BadRequestException(
                'Cost Center code already exists.',
            );
        }
    }
}