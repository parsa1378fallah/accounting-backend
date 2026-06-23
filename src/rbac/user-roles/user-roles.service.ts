import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { AssignRoleDto } from './dto/assign-role.dto';

@Injectable()
export class UserRolesService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    // ======================================================
    // ASSIGN ROLE
    // ======================================================
    async assignRole(dto: AssignRoleDto) {
        await this.ensureUserExists(dto.userId);
        await this.ensureRoleExists(dto.roleId);
        await this.ensureOrganizationExists(dto.organizationId);

        await this.ensureNotAlreadyAssigned(dto);

        return this.prisma.userRole.create({
            data: {
                userId: dto.userId,
                roleId: dto.roleId,
                organizationId: dto.organizationId,
            },
            include: {
                role: true,
                user: true,
                organization: true,
            },
        });
    }

    // ======================================================
    // REMOVE ROLE
    // ======================================================
    async removeRole(dto: AssignRoleDto) {
        await this.ensureAssignmentExists(dto);

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

    // ======================================================
    // GET USER ROLES
    // ======================================================
    async getUserRoles(userId: string, organizationId: string) {
        await this.ensureUserExists(userId);
        await this.ensureOrganizationExists(organizationId);

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

    // ======================================================
    // GET ROLE USERS
    // ======================================================
    async getRoleUsers(roleId: string, organizationId: string) {
        await this.ensureRoleExists(roleId);
        await this.ensureOrganizationExists(organizationId);

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

    // ======================================================
    // HELPERS
    // ======================================================

    private async ensureUserExists(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }
    }

    private async ensureRoleExists(roleId: string) {
        const role = await this.prisma.role.findUnique({
            where: { id: roleId },
        });

        if (!role) {
            throw new NotFoundException('Role not found');
        }
    }

    private async ensureOrganizationExists(orgId: string) {
        const org = await this.prisma.organization.findUnique({
            where: { id: orgId },
        });

        if (!org) {
            throw new NotFoundException('Organization not found');
        }
    }

    private async ensureNotAlreadyAssigned(dto: AssignRoleDto) {
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
    }

    private async ensureAssignmentExists(dto: AssignRoleDto) {
        const exists = await this.prisma.userRole.findUnique({
            where: {
                userId_roleId_organizationId: {
                    userId: dto.userId,
                    roleId: dto.roleId,
                    organizationId: dto.organizationId,
                },
            },
        });

        if (!exists) {
            throw new NotFoundException('Role assignment not found');
        }
    }
}