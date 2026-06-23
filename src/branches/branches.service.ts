import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBrachDto } from './dto/update-branch.dto';

@Injectable()
export class BranchesService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    /* ============================================================
        CREATE
    ============================================================ */

    async create(
        organizationId: string,
        dto: CreateBranchDto,
    ) {
        await this.ensureCodeUnique(
            organizationId,
            dto.code,
        );

        return this.prisma.branch.create({
            data: {
                ...dto,
                organizationId,
                isActive: true,
            },
        });
    }

    /* ============================================================
        FIND ALL
    ============================================================ */

    async findAll(organizationId: string) {
        return this.prisma.branch.findMany({
            where: {
                organizationId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    /* ============================================================
        FIND ONE
    ============================================================ */

    async findOne(
        organizationId: string,
        id: string,
    ) {
        const branch =
            await this.prisma.branch.findFirst({
                where: {
                    id,
                    organizationId,
                },
            });

        if (!branch) {
            throw new NotFoundException(
                'BRANCH_NOT_FOUND',
            );
        }

        return branch;
    }

    /* ============================================================
        UPDATE
    ============================================================ */

    async update(
        organizationId: string,
        id: string,
        dto: UpdateBrachDto,
    ) {
        const branch = await this.findOne(
            organizationId,
            id,
        );

        if (dto.code && dto.code !== branch.code) {
            await this.ensureCodeUnique(
                organizationId,
                dto.code,
                id,
            );
        }

        return this.prisma.branch.update({
            where: { id },
            data: {
                ...dto,
            },
        });
    }

    /* ============================================================
        REMOVE (SOFT DELETE)
    ============================================================ */

    async remove(
        organizationId: string,
        id: string,
    ) {
        await this.findOne(organizationId, id);

        return this.prisma.branch.update({
            where: { id },
            data: {
                isActive: false,
            },
        });
    }

    /* ============================================================
        BUSINESS RULES
    ============================================================ */

    private async ensureCodeUnique(
        organizationId: string,
        code: string,
        excludeId?: string,
    ) {
        const exists =
            await this.prisma.branch.findFirst({
                where: {
                    organizationId,
                    code,

                    ...(excludeId && {
                        id: {
                            not: excludeId,
                        },
                    }),
                },
            });

        if (exists) {
            throw new BadRequestException(
                'BRANCH_CODE_ALREADY_EXISTS',
            );
        }
    }
}