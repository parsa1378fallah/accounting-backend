import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';

import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';

@Injectable()
export class ProjectsRepository {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    //--------------------------------------------------
    // Create
    //--------------------------------------------------

    async create(
        data: Prisma.ProjectCreateInput,
    ) {
        return this.prisma.project.create({
            data,
        });
    }

    //--------------------------------------------------
    // Find Many
    //--------------------------------------------------

    async findMany(
        where: Prisma.ProjectWhereInput,
    ) {
        return this.prisma.project.findMany({
            where,
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    //--------------------------------------------------
    // Find Unique
    //--------------------------------------------------

    async findById(
        id: string,
    ) {
        return this.prisma.project.findUnique({
            where: {
                id,
            },
        });
    }

    //--------------------------------------------------
    // Find First
    //--------------------------------------------------

    async findFirst(
        where: Prisma.ProjectWhereInput,
    ) {
        return this.prisma.project.findFirst({
            where,
        });
    }

    //--------------------------------------------------
    // Update
    //--------------------------------------------------

    async update(
        id: string,
        data: Prisma.ProjectUpdateInput,
    ) {
        return this.prisma.project.update({
            where: {
                id,
            },
            data,
        });
    }

    //--------------------------------------------------
    // Soft Delete
    //--------------------------------------------------

    async softDelete(
        id: string,
    ) {
        return this.prisma.project.update({
            where: {
                id,
            },
            data: {
                deletedAt: new Date(),
            },
        });
    }

    //--------------------------------------------------
    // Restore
    //--------------------------------------------------

    async restore(
        id: string,
    ) {
        return this.prisma.project.update({
            where: {
                id,
            },
            data: {
                deletedAt: null,
            },
        });
    }

    //--------------------------------------------------
    // Hard Delete
    //--------------------------------------------------

    async delete(
        id: string,
    ) {
        return this.prisma.project.delete({
            where: {
                id,
            },
        });
    }

    //--------------------------------------------------
    // Count
    //--------------------------------------------------

    async count(
        where: Prisma.ProjectWhereInput,
    ) {
        return this.prisma.project.count({
            where,
        });
    }

    //--------------------------------------------------
    // Exists
    //--------------------------------------------------

    async exists(
        where: Prisma.ProjectWhereInput,
    ) {
        const count =
            await this.prisma.project.count({
                where,
            });

        return count > 0;
    }
}