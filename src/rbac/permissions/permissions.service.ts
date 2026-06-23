import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

import {
    CreatePermissionDto,
    PermissionFilterDto,
    UpdatePermissionDto,
} from './dto';

import { PERMISSION_ERRORS } from './constants/permission.constants';

@Injectable()
export class PermissionsService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    // ============================================================
    // CREATE
    // ============================================================
    async create(dto: CreatePermissionDto) {
        const exist = await this.prisma.permission.findUnique({
            where: { key: dto.key },
        });

        if (exist) {
            throw new BadRequestException(
                PERMISSION_ERRORS.ALREADY_EXISTS,
            );
        }

        return this.prisma.permission.create({
            data: dto,
        });
    }

    // ============================================================
    // FIND ALL
    // ============================================================
    async findAll(filter: PermissionFilterDto) {
        return this.prisma.permission.findMany({
            where: {
                ...(filter.search && {
                    key: { contains: filter.search },
                }),
                ...(filter.module && {
                    module: { contains: filter.module },
                }),
            },
            orderBy: {
                module: 'asc',
            },
        });
    }

    // ============================================================
    // FIND ONE
    // ============================================================
    async findOne(id: string) {
        const permission = await this.prisma.permission.findUnique({
            where: { id },
        });

        if (!permission) {
            throw new NotFoundException(
                PERMISSION_ERRORS.NOT_FOUND,
            );
        }

        return permission;
    }

    // ============================================================
    // UPDATE (FIXED)
    // ============================================================
    async update(id: string, dto: UpdatePermissionDto) {
        await this.findOne(id);

        if (dto.key) {
            const exist = await this.prisma.permission.findFirst({
                where: {
                    key: dto.key,
                    NOT: { id },
                },
            });

            if (exist) {
                throw new BadRequestException(
                    PERMISSION_ERRORS.ALREADY_EXISTS,
                );
            }
        }

        return this.prisma.permission.update({
            where: { id },
            data: dto,
        });
    }

    // ============================================================
    // REMOVE
    // ============================================================
    async remove(id: string) {
        await this.findOne(id);

        const used = await this.prisma.rolePermission.findFirst({
            where: { permissionId: id },
        });

        if (used) {
            throw new BadRequestException(
                PERMISSION_ERRORS.IS_ASSIGNED_TO_ROLES,
            );
        }

        return this.prisma.permission.delete({
            where: { id },
        });
    }
}