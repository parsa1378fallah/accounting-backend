import {
    BadRequestException,
    Injectable,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CostCenterValidator {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async validate(
        organizationId: string,
        costCenterId?: string,
    ): Promise<void> {
        if (!costCenterId) {
            return;
        }

        const costCenter =
            await this.prisma.costCenter.findUnique({
                where: {
                    id: costCenterId,
                },
            });

        if (!costCenter) {
            throw new BadRequestException(
                'Cost center not found.',
            );
        }

        if (costCenter.organizationId !== organizationId) {
            throw new BadRequestException(
                'Cost center does not belong to the organization.',
            );
        }

        if (!costCenter.isActive) {
            throw new BadRequestException(
                'Cost center is inactive.',
            );
        }

        if (costCenter.deletedAt) {
            throw new BadRequestException(
                'Cost center has been deleted.',
            );
        }
    }
}