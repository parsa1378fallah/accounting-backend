import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { AssignPermissionDto, CreateRoleDto, RemovePermissionDto, RoleFilterDto, UpdateRoleDto } from './dto';

@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    @Post()
    create(@Body() dto: CreateRoleDto) {
        return this.rolesService.create(dto)
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.rolesService.findOne(id)
    }

    @Get()
    findAll(@Query('filter') filter: RoleFilterDto) {
        return this.rolesService.findAll(filter)
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
        return this.rolesService.update(id, dto)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.rolesService.remove(id)
    }

    @Post(':roleId/permissions')
    assignPermission(@Param('roleId') roleId: string, @Body() dto: AssignPermissionDto) {
        return this.assignPermission(roleId, dto)
    }
    @Delete(':roleId/permissions')
    async removePermission(
        @Param('roleId') roleId: string,
        @Body() dto: RemovePermissionDto,
    ) {
        return this.rolesService.removePermission(roleId, dto);
    }

    @Get(':roleId/permissions')
    async getPermissions(@Param('roleId') roleId: string) {
        return this.rolesService.getPermissions(roleId);
    }

}
