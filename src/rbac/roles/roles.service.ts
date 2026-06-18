import { Permissions } from './../../auth/decorators/permisions.decorator';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AssignPermissionDto, CreateRoleDto, RoleFilterDto, UpdateRoleDto } from './dto';
import { ROLE_ERRORS } from './constants/role.constants';
import { PERMISSION_ERRORS } from '../permissions/constants/permission.constants';

@Injectable()
export class RolesService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateRoleDto) {
        const exist = await this.prisma.role.findUnique({
            where: { name: dto.name }
        })
        if (exist) {
            throw new BadRequestException(ROLE_ERRORS.ALREADY_EXISTS)
        }
        return this.prisma.role.create({
            data: { ...dto }
        })
    }

    async findAll(filter: RoleFilterDto) {
        return await this.prisma.role.findMany({
            where: { ...(filter.search && { name: { contains: filter.search } }) },
            include: {
                rolePermissions: {
                    include: { permission: true }
                },
                userRoles: true
            }
        })
    }

    async findOne(id: string) {

        const role = await this.prisma.role.findUnique({
            where: { id },
            include: {
                rolePermissions: {
                    include: {
                        permission: true
                    }
                },
                userRoles: {
                    include: {
                        user: true
                    }
                }
            }
        })
        if (!role) {
            throw new NotFoundException(ROLE_ERRORS.NOT_FOUND)
        }
        return role
    }
    async update(id: string, dto: UpdateRoleDto) {
        await this.findOne(id)
        if (dto.name) {
            const exist = await this.prisma.role.findFirst({
                where: { name: dto.name, NOT: { id } }
            })
            if (exist) {
                throw new BadRequestException(ROLE_ERRORS.ALREADY_EXISTS)
            }
        }
        return await this.prisma.role.update({
            where: { id },
            data: { ...dto }
        })
    }

    async remove(id: string) {
        const role = await this.findOne(id)

        if (role.userRoles.length > 0) {
            throw new BadRequestException(ROLE_ERRORS.IN_USE)
        }
        return this.prisma.role.delete({
            where: { id }
        })
    }

    async assignPermission(roleId: string, dto: AssignPermissionDto) {
        await this.findOne(roleId)
        const permission = await this.prisma.permission.findUnique({
            where: { id: dto.permissionId }
        })
        if (!permission) {
            throw new BadRequestException(PERMISSION_ERRORS.NOT_FOUND)
        }

        return this.prisma.rolePermission.create({
            data: {
                roleId,
                permissionId: dto.permissionId
            }
        })
    }

    async removePermission(roleId: string,)
}
