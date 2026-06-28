import { Injectable } from '@nestjs/common';

import { CostCenter } from '@prisma/client';

@Injectable()
export class CostCentersMapper {
    toResponse(entity: CostCenter) {
        return {
            id: entity.id,

            organizationId: entity.organizationId,

            code: entity.code,

            name: entity.name,

            parentId: entity.parentId,

            isActive: entity.isActive,

            deletedAt: entity.deletedAt,

            createdAt: entity.createdAt,

            updatedAt: entity.updatedAt,
        };
    }

    toResponseList(
        entities: CostCenter[],
    ) {
        return entities.map((entity) =>
            this.toResponse(entity),
        );
    }
}