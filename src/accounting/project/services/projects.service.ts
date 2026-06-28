import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { ProjectsRepository } from '../repositories/projects.repository';
import { ProjectsValidator } from '../validators/projects.validator';
import { ProjectsMapper } from '../mappers/projects.mapper';

import { ProjectsQueryService } from './projects-query.service';
import { ProjectsSummaryService } from './projects-summary.service';

import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';

@Injectable()
export class ProjectsService {
    constructor(
        private readonly repository: ProjectsRepository,
        private readonly validator: ProjectsValidator,
        private readonly mapper: ProjectsMapper,
        private readonly queryService: ProjectsQueryService,
        private readonly summaryService: ProjectsSummaryService,
    ) { }

    //--------------------------------------------------
    // CREATE
    //--------------------------------------------------

    async create(dto: CreateProjectDto) {

        await this.validator.validateCreate(dto);

        const input =
            this.mapper.toCreateInput(dto);

        const entity =
            await this.repository.create(input);

        return this.mapper.toResponse(entity);
    }

    //--------------------------------------------------
    // FIND ALL
    //--------------------------------------------------

    async findAll(query) {
        return this.queryService.findAll(query);
    }

    //--------------------------------------------------
    // FIND ONE
    //--------------------------------------------------

    async findOne(id: string) {
        return this.queryService.findOne(id);
    }

    //--------------------------------------------------
    // UPDATE
    //--------------------------------------------------

    async update(
        id: string,
        dto: UpdateProjectDto,
    ) {
        await this.validator.validateUpdate(
            id,
            dto,
        );

        const input =
            this.mapper.toUpdateInput(dto);

        const entity =
            await this.repository.update(
                id,
                input,
            );

        return this.mapper.toResponse(entity);
    }

    //--------------------------------------------------
    // DELETE (Soft Delete Recommended)
    //--------------------------------------------------

    async remove(id: string) {
        await this.validator.validateDelete(id);

        const entity =
            await this.repository.update(id, {
                deletedAt: new Date(),
            });

        return {
            success: true,
            id: entity.id,
        };
    }

    //--------------------------------------------------
    // SUMMARY
    //--------------------------------------------------

    async getSummary(
        organizationId: string,
    ) {
        return this.summaryService.getSummary(
            organizationId,
        );
    }

    //--------------------------------------------------
    // EXTRA ANALYTICS
    //--------------------------------------------------

    async getStatusBreakdown(
        organizationId: string,
    ) {
        return this.summaryService.getStatusBreakdown(
            organizationId,
        );
    }

    async getBudgetOverview(
        organizationId: string,
    ) {
        return this.summaryService.getBudgetOverview(
            organizationId,
        );
    }
}