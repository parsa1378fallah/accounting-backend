import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { AssignPermissionDto } from './dto/assign-permission.dto';
import { PERMISSION_ERRORS } from '../permissions/constants/permission.constants';
import { ROLE_ERRORS } from '../roles/constants/role.constants';

@Injectable()
export class RolePermissionsService {
    constructor(private readonly prisma: PrismaService) { }

    // =========================
    // ASSIGN PERMISSION TO ROLE
    // =========================
    async assign(dto: AssignPermissionDto) {
        await this.ensureRoleExists(dto.roleId);
        await this.ensurePermissionExists(dto.permissionId);

        const exists = await this.prisma.rolePermission.findUnique({
            where: {
                roleId_permissionId: {
                    roleId: dto.roleId,
                    permissionId: dto.permissionId,
                },
            },
        });

        if (exists) {
            throw new BadRequestException(
                'Permission already assigned to role',
            );
        }

        return this.prisma.rolePermission.create({
            data: {
                roleId: dto.roleId,
                permissionId: dto.permissionId,
            },
            include: {
                role: true,
                permission: true,
            },
        });
    }

    // =========================
    // REMOVE PERMISSION FROM ROLE
    // =========================
    async remove(dto: AssignPermissionDto) {
        await this.ensureRelationExists(dto.roleId, dto.permissionId);

        return this.prisma.rolePermission.delete({
            where: {
                roleId_permissionId: {
                    roleId: dto.roleId,
                    permissionId: dto.permissionId,
                },
            },
        });
    }

    // =========================
    // GET ROLE PERMISSIONS
    // =========================
    async getRolePermissions(roleId: string) {
        await this.ensureRoleExists(roleId);

        return this.prisma.rolePermission.findMany({
            where: { roleId },
            include: {
                permission: true,
            },
            orderBy: {
                permission: {
                    module: 'asc',
                },
            },
        });
    }

    // =========================
    // GET ROLES BY PERMISSION
    // =========================
    async getRolesByPermission(permissionId: string) {
        await this.ensurePermissionExists(permissionId);

        return this.prisma.rolePermission.findMany({
            where: { permissionId },
            include: {
                role: true,
            },
        });
    }

    // ============================================================
    // PRIVATE HELPERS
    // ============================================================

    private async ensureRoleExists(roleId: string) {
        const role = await this.prisma.role.findUnique({
            where: { id: roleId },
        });

        if (!role) {
            throw new NotFoundException(ROLE_ERRORS.NOT_FOUND);
        }
    }

    private async ensurePermissionExists(permissionId: string) {
        const permission = await this.prisma.permission.findUnique({
            where: { id: permissionId },
        });

        if (!permission) {
            throw new NotFoundException(PERMISSION_ERRORS.NOT_FOUND);
        }
    }

    private async ensureRelationExists(roleId: string, permissionId: string) {
        const relation = await this.prisma.rolePermission.findUnique({
            where: {
                roleId_permissionId: {
                    roleId,
                    permissionId,
                },
            },
        });

        if (!relation) {
            throw new NotFoundException(
                'Role permission relation not found',
            );
        }
    }
}