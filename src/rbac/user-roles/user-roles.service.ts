import {
    Injectable,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AssignRoleDto } from './dto/assign-role.dto';

@Injectable()
export class UserRolesService {
    constructor(private prisma: PrismaService) { }

    // =====================
    // ASSIGN ROLE
    // =====================
    async assignRole(dto: AssignRoleDto) {
        const exists = await this.prisma.userRole.findUnique({
            where: {
                userId_roleId_organizationId: {
                    userId: dto.userId,
                    roleId: dto.roleId,
                    organizationId: dto.organizationId,
                },
            },
        });

        if (exists) {
            throw new BadRequestException('Role already assigned');
        }

        return this.prisma.userRole.create({
            data: {
                userId: dto.userId,
                roleId: dto.roleId,
                organizationId: dto.organizationId,
            },
        });
    }

    // =====================
    // REMOVE ROLE
    // =====================
    async removeRole(dto: AssignRoleDto) {
        return this.prisma.userRole.delete({
            where: {
                userId_roleId_organizationId: {
                    userId: dto.userId,
                    roleId: dto.roleId,
                    organizationId: dto.organizationId,
                },
            },
        });
    }

    // =====================
    // GET USER ROLES
    // =====================
    async getUserRoles(userId: string, organizationId: string) {
        return this.prisma.userRole.findMany({
            where: {
                userId,
                organizationId,
            },
            include: {
                role: true,
            },
        });
    }

    // =====================
    // GET ROLE USERS
    // =====================
    async getRoleUsers(roleId: string, organizationId: string) {
        return this.prisma.userRole.findMany({
            where: {
                roleId,
                organizationId,
            },
            include: {
                user: true,
            },
        });
    }
}