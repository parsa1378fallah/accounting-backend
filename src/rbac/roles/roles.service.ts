import { Permissions } from './../../auth/decorators/permisions.decorator';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AssignPermissionDto, CreateRoleDto, RemovePermissionDto, RoleFilterDto, UpdateRoleDto } from './dto';
import { ROLE_ERRORS } from './constants/role.constants';
import { PERMISSION_ERRORS } from '../permissions/constants/permission.constants';
import { ROLE_PERMISSION_ERRORS } from '../role-permissions/constants/role-permissions.constats';

@Injectable()
export class RolesService {
    constructor(private prisma: PrismaService) { }

    async create(organizationId: string, dto: CreateRoleDto) {
        const exist = await this.prisma.role.findFirst({
            where: {
                organizationId,
                code: dto.code,
            },
        });

        if (exist) {
            throw new BadRequestException(ROLE_ERRORS.ALREADY_EXISTS);
        }

        return this.prisma.role.create({
            data: {
                ...dto,
                organizationId,
            },
        });
    }

    async findAll(organizationId: string, filter?: RoleFilterDto) {
        return this.prisma.role.findMany({
            where: {
                organizationId,
                ...(filter?.search && {
                    OR: [
                        { name: { contains: filter.search } },
                        { code: { contains: filter.search } },
                    ],
                }),
            },
            include: {
                rolePermissions: {
                    include: { permission: true },
                },
                userRoles: true,
            },
        });
    }

    async findOne(organizationId: string, id: string) {
        const role = await this.prisma.role.findFirst({
            where: {
                id,
                organizationId,
            },
            include: {
                rolePermissions: {
                    include: { permission: true },
                },
                userRoles: {
                    include: { user: true },
                },
            },
        });

        if (!role) {
            throw new NotFoundException(ROLE_ERRORS.NOT_FOUND);
        }

        return role;
    }

    async update(organizationId: string, id: string, dto: UpdateRoleDto) {
        await this.findOne(organizationId, id);

        if (dto.code) {
            const exist = await this.prisma.role.findFirst({
                where: {
                    organizationId,
                    code: dto.code,
                    NOT: { id },
                },
            });

            if (exist) {
                throw new BadRequestException(ROLE_ERRORS.ALREADY_EXISTS);
            }
        }

        return this.prisma.role.update({
            where: { id },
            data: dto,
        });
    }

    async remove(organizationId: string, id: string) {
        const role = await this.findOne(organizationId, id);

        if (role.userRoles.length > 0) {
            throw new BadRequestException(ROLE_ERRORS.IN_USE);
        }

        return this.prisma.role.delete({
            where: { id },
        });
    }

    async assignPermission(roleId: string, dto: AssignPermissionDto) {
        const permission = await this.prisma.permission.findUnique({
            where: { id: dto.permissionId },
        });

        if (!permission) {
            throw new NotFoundException(PERMISSION_ERRORS.NOT_FOUND);
        }

        return this.prisma.rolePermission.create({
            data: {
                roleId,
                permissionId: dto.permissionId,
            },
        });
    }

    async removePermission(roleId: string, dto: RemovePermissionDto) {
        const existing = await this.prisma.rolePermission.findUnique({
            where: {
                roleId_permissionId: {
                    roleId,
                    permissionId: dto.permissionId,
                },
            },
        });

        if (!existing) {
            throw new NotFoundException(ROLE_PERMISSION_ERRORS.NOT_FOUND);
        }

        return this.prisma.rolePermission.delete({
            where: {
                roleId_permissionId: {
                    roleId,
                    permissionId: dto.permissionId,
                },
            },
        });
    }

    async getPermissions(roleId: string) {
        return this.prisma.rolePermission.findMany({
            where: { roleId },
            include: { permission: true },
        });
    }
}
