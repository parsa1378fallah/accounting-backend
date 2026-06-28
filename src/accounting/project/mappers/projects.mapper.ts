import { Injectable } from '@nestjs/common';

import {
    Prisma,
    Project,
} from '@prisma/client';

import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { ProjectResponseDto } from '../dto/project-response.dto';

@Injectable()
export class ProjectsMapper {

    //--------------------------------------------------
    // DTO -> Prisma Create
    //--------------------------------------------------

    toCreateInput(
        dto: CreateProjectDto,
    ): Prisma.ProjectCreateInput {

        return {
            organization: {
                connect: {
                    id: dto.organizationId,
                },
            },

            code: dto.code,

            name: dto.name,

            status: dto.status,

            startDate: dto.startDate,

            endDate: dto.endDate,

            budget: dto.budget,
        };
    }

    //--------------------------------------------------
    // DTO -> Prisma Update
    //--------------------------------------------------

    toUpdateInput(
        dto: UpdateProjectDto,
    ): Prisma.ProjectUpdateInput {

        const data: Prisma.ProjectUpdateInput = {};

        if (dto.code !== undefined) {
            data.code = dto.code;
        }

        if (dto.name !== undefined) {
            data.name = dto.name;
        }

        if (dto.status !== undefined) {
            data.status = dto.status;
        }

        if (dto.startDate !== undefined) {
            data.startDate = dto.startDate;
        }

        if (dto.endDate !== undefined) {
            data.endDate = dto.endDate;
        }

        if (dto.budget !== undefined) {
            data.budget = dto.budget;
        }

        return data;
    }

    //--------------------------------------------------
    // Entity -> Response
    //--------------------------------------------------

    toResponse(
        entity: Project,
    ): ProjectResponseDto {

        return {
            id: entity.id,

            organizationId: entity.organizationId,

            code: entity.code,

            name: entity.name,

            status: entity.status,

            startDate: entity.startDate,

            endDate: entity.endDate,

            budget: entity.budget,

            createdAt: entity.createdAt,

            updatedAt: entity.updatedAt,
        };
    }

    //--------------------------------------------------
    // Entity[] -> Response[]
    //--------------------------------------------------

    toResponseList(
        entities: Project[],
    ): ProjectResponseDto[] {

        return entities.map(entity =>
            this.toResponse(entity),
        );
    }
}