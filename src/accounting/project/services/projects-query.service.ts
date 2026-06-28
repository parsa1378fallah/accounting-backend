import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { ProjectsRepository } from '../repositories/projects.repository';

import { QueryProjectDto } from '../dto/query-project.dto';

@Injectable()
export class ProjectsQueryService {
    constructor(
        private readonly repository: ProjectsRepository,
    ) { }

    //--------------------------------------------------
    // Find All (with filters)
    //--------------------------------------------------

    async findAll(
        query: QueryProjectDto,
    ) {
        const where: Prisma.ProjectWhereInput =
        {
            organizationId:
                query.organizationId,

            deletedAt:
                query.includeDeleted
                    ? undefined
                    : null,
        };

        //--------------------------------------------------
        // Search
        //--------------------------------------------------

        if (query.search) {
            where.OR = [
                {
                    name: {
                        contains: query.search,
                    },
                },
                {
                    code: {
                        contains: query.search,
                    },
                },
            ];
        }

        //--------------------------------------------------
        // Status Filter
        //--------------------------------------------------

        if (query.status) {
            where.status = query.status;
        }

        //--------------------------------------------------
        // Date Filters
        //--------------------------------------------------

        if (query.startDateFrom || query.startDateTo) {
            where.startDate = {};

            if (query.startDateFrom) {
                where.startDate.gte =
                    query.startDateFrom;
            }

            if (query.startDateTo) {
                where.startDate.lte =
                    query.startDateTo;
            }
        }

        //--------------------------------------------------
        // Pagination
        //--------------------------------------------------

        const page = query.page ?? 1;
        const limit = query.limit ?? 20;

        const skip =
            (page - 1) * limit;

        const [data, total] =
            await Promise.all([
                this.repository.findMany(where),
                this.repository.count(where),
            ]);

        return {
            data,
            meta: {
                total,
                page,
                limit,
                lastPage: Math.ceil(
                    total / limit,
                ),
            },
        };
    }

    //--------------------------------------------------
    // Find One
    //--------------------------------------------------

    async findOne(id: string) {
        const entity =
            await this.repository.findById(id);

        if (!entity) {
            throw new NotFoundException(
                'Project not found.',
            );
        }

        return entity;
    }
}