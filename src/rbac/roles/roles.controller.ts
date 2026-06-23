import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { RolesService } from './roles.service';
import {
    AssignPermissionDto,
    CreateRoleDto,
    RemovePermissionDto,
    RoleFilterDto,
    UpdateRoleDto,
} from './dto';

import { CurrentOrg } from 'src/common/decorators/current-org.decorator';

@ApiTags('Roles')
@ApiBearerAuth()
@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new role for organization' })
    create(
        @CurrentOrg() orgId: string,
        @Body() dto: CreateRoleDto,
    ) {
        return this.rolesService.create(orgId, dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all roles of organization' })
    findAll(
        @CurrentOrg() orgId: string,
        @Query() filter: RoleFilterDto,
    ) {
        return this.rolesService.findAll(orgId, filter);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get role by id' })
    findOne(
        @CurrentOrg() orgId: string,
        @Param('id') id: string,
    ) {
        return this.rolesService.findOne(orgId, id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update role' })
    update(
        @CurrentOrg() orgId: string,
        @Param('id') id: string,
        @Body() dto: UpdateRoleDto,
    ) {
        return this.rolesService.update(orgId, id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete role' })
    remove(
        @CurrentOrg() orgId: string,
        @Param('id') id: string,
    ) {
        return this.rolesService.remove(orgId, id);
    }

    @Post(':roleId/permissions')
    @ApiOperation({ summary: 'Assign permission to role' })
    assignPermission(
        @Param('roleId') roleId: string,
        @Body() dto: AssignPermissionDto,
    ) {
        return this.rolesService.assignPermission(roleId, dto);
    }

    @Delete(':roleId/permissions')
    @ApiOperation({ summary: 'Remove permission from role' })
    removePermission(
        @Param('roleId') roleId: string,
        @Body() dto: RemovePermissionDto,
    ) {
        return this.rolesService.removePermission(roleId, dto);
    }

    @Get(':roleId/permissions')
    @ApiOperation({ summary: 'Get all permissions of a role' })
    getPermissions(@Param('roleId') roleId: string) {
        return this.rolesService.getPermissions(roleId);
    }
}