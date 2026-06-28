import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { ProjectsRepository } from '../repositories/projects.repository';

import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';

@Injectable()
export class ProjectsValidator {
    constructor(
        private readonly repository: ProjectsRepository,
    ) { }

    //--------------------------------------------------
    // Validate Create
    //--------------------------------------------------

    async validateCreate(
        dto: CreateProjectDto,
    ): Promise<void> {

        await this.validateUniqueCode(
            dto.organizationId,
            dto.code,
        );

        this.validateDates(
            dto.startDate,
            dto.endDate,
        );
    }

    //--------------------------------------------------
    // Validate Update
    //--------------------------------------------------

    async validateUpdate(
        id: string,
        dto: UpdateProjectDto,
    ): Promise<void> {

        const entity =
            await this.repository.findById(id);

        if (!entity) {
            throw new NotFoundException(
                'Project not found.',
            );
        }

        if (
            dto.code &&
            dto.code !== entity.code
        ) {
            await this.validateUniqueCode(
                entity.organizationId,
                dto.code,
            );
        }

        this.validateDates(
            dto.startDate ?? entity.startDate ?? undefined,
            dto.endDate ?? entity.endDate ?? undefined,
        );
    }

    //--------------------------------------------------
    // Validate Delete
    //--------------------------------------------------

    async validateDelete(
        id: string,
    ): Promise<void> {

        const entity =
            await this.repository.findById(id);

        if (!entity) {
            throw new NotFoundException(
                'Project not found.',
            );
        }

        /**
         * بعداً:
         *
         * بررسی JournalEntryLine
         * بررسی Allocation
         * بررسی Budget
         */
    }

    //--------------------------------------------------
    // Unique Code
    //--------------------------------------------------

    async validateUniqueCode(
        organizationId: string,
        code: string,
    ): Promise<void> {

        const exists =
            await this.repository.findFirst({
                organizationId,
                code,
                deletedAt: null,
            });

        if (exists) {
            throw new BadRequestException(
                'Project code already exists.',
            );
        }
    }

    //--------------------------------------------------
    // Dates
    //--------------------------------------------------

    validateDates(
        startDate?: Date,
        endDate?: Date,
    ): void {

        if (
            startDate &&
            endDate &&
            endDate < startDate
        ) {
            throw new BadRequestException(
                'End date cannot be before start date.',
            );
        }
    }

    //--------------------------------------------------
    // Budget
    //--------------------------------------------------

    validateBudget(
        budget?: number,
    ): void {

        if (
            budget !== undefined &&
            budget < 0
        ) {
            throw new BadRequestException(
                'Budget cannot be negative.',
            );
        }
    }
}