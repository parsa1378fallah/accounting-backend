import {
    BadRequestException,
    Injectable,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { ProjectStatus } from '@prisma/client';

@Injectable()
export class ProjectValidator {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async validate(
        organizationId: string,
        projectId?: string,
    ): Promise<void> {
        if (!projectId) {
            return;
        }

        const project = await this.prisma.project.findUnique({
            where: {
                id: projectId,
            },
        });

        if (!project) {
            throw new BadRequestException(
                'Project not found.',
            );
        }

        if (project.organizationId !== organizationId) {
            throw new BadRequestException(
                'Project does not belong to the organization.',
            );
        }

        if (project.deletedAt) {
            throw new BadRequestException(
                'Project has been deleted.',
            );
        }

        if (project.status !== ProjectStatus.ACTIVE) {
            throw new BadRequestException(
                'Project is not active.',
            );
        }
    }

    async validatePostingDate(
        projectId: string,
        journalDate: Date,
    ): Promise<void> {
        const project = await this.prisma.project.findUnique({
            where: {
                id: projectId,
            },
        });

        if (!project) {
            return;
        }

        if (
            project.startDate &&
            journalDate < project.startDate
        ) {
            throw new BadRequestException(
                'Journal date is before project start date.',
            );
        }

        if (
            project.endDate &&
            journalDate > project.endDate
        ) {
            throw new BadRequestException(
                'Journal date is after project end date.',
            );
        }
    }
}