import {
    Injectable,
    BadRequestException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { AssignPermissionDto } from './dto/assign-permission.dto';

@Injectable()
export class RolePermissionsService {
    constructor(private prisma: PrismaService) { }

    // =========================
    // ASSIGN PERMISSION TO ROLE
    // =========================
    async assign(dto: AssignPermissionDto) {
        const exists =
            await this.prisma.rolePermission.findUnique({
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
        });
    }

    // =========================
    // REMOVE PERMISSION FROM ROLE
    // =========================
    async remove(dto: AssignPermissionDto) {
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
        return this.prisma.rolePermission.findMany({
            where: {
                roleId,
            },
            include: {
                permission: true,
            },
        });
    }

    // =========================
    // GET ROLES BY PERMISSION
    // =========================
    async getRolesByPermission(permissionId: string) {
        return this.prisma.rolePermission.findMany({
            where: {
                permissionId,
            },
            include: {
                role: true,
            },
        });
    }
}