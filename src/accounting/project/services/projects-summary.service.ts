import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { ProjectsRepository } from '../repositories/projects.repository';

@Injectable()
export class ProjectsSummaryService {
    constructor(
        private readonly repository: ProjectsRepository,
    ) { }

    async getSummary(
        organizationId: string,
    ) {
        const where: Prisma.ProjectWhereInput = {
            organizationId,
            deletedAt: null,
        };

        const projects =
            await this.repository.findMany(where);

        //--------------------------------------------------
        // ACTIVE
        //--------------------------------------------------

        const activeProjects =
            projects.filter(
                p => p.status === 'ACTIVE',
            ).length;

        //--------------------------------------------------
        // COMPLETED
        //--------------------------------------------------

        const completedProjects =
            projects.filter(
                p => p.status === 'COMPLETED',
            ).length;

        //--------------------------------------------------
        // ARCHIVED
        //--------------------------------------------------

        const archivedProjects =
            projects.filter(
                p => p.status === 'ARCHIVED',
            ).length;

        //--------------------------------------------------
        // TOTAL BUDGET
        //--------------------------------------------------

        const totalBudget =
            projects.reduce((sum, p) => {
                return (
                    sum +
                    Number(p.budget ?? 0)
                );
            }, 0);

        //--------------------------------------------------
        // AVG BUDGET
        //--------------------------------------------------

        const avgBudget =
            projects.length > 0
                ? totalBudget /
                projects.length
                : 0;

        return {
            totalProjects: projects.length,

            activeProjects,

            completedProjects,

            archivedProjects,

            totalBudget,

            avgBudget,
        };
    }

    //--------------------------------------------------
    // Status Breakdown
    //--------------------------------------------------

    async getStatusBreakdown(
        organizationId: string,
    ) {
        const where: Prisma.ProjectWhereInput = {
            organizationId,
            deletedAt: null,
        };

        const projects =
            await this.repository.findMany(where);

        const breakdown: Record<string, number> =
            {};

        for (const p of projects) {
            breakdown[p.status] =
                (breakdown[p.status] ?? 0) + 1;
        }

        return breakdown;
    }

    //--------------------------------------------------
    // Budget Overview
    //--------------------------------------------------

    async getBudgetOverview(
        organizationId: string,
    ) {
        const where: Prisma.ProjectWhereInput = {
            organizationId,
            deletedAt: null,
        };

        const projects =
            await this.repository.findMany(where);

        const budgets = projects.map(
            p => Number(p.budget ?? 0),
        );

        return {
            min: Math.min(...budgets, 0),
            max: Math.max(...budgets, 0),
            total: budgets.reduce(
                (a, b) => a + b,
                0,
            ),
            count: budgets.length,
        };
    }
}