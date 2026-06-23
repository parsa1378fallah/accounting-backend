import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    UseGuards,
} from '@nestjs/common';

import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
} from '@nestjs/swagger';

import { RolePermissionsService } from './role-permissions.service';
import { AssignPermissionDto } from './dto/assign-permission.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Role Permissions')
@Controller('role-permissions')
@UseGuards(JwtAuthGuard)
export class RolePermissionsController {
    constructor(private readonly service: RolePermissionsService) { }

    // =========================
    // ASSIGN PERMISSION TO ROLE
    // =========================
    @Post()
    @ApiOperation({ summary: 'Assign permission to role' })
    @ApiResponse({ status: 201, description: 'Permission assigned successfully' })
    assign(@Body() dto: AssignPermissionDto) {
        return this.service.assign(dto);
    }

    // =========================
    // REMOVE PERMISSION FROM ROLE
    // =========================
    @Delete(':roleId/:permissionId')
    @ApiOperation({ summary: 'Remove permission from role' })
    @ApiParam({ name: 'roleId' })
    @ApiParam({ name: 'permissionId' })
    @ApiResponse({ status: 200, description: 'Permission removed successfully' })
    remove(
        @Param('roleId') roleId: string,
        @Param('permissionId') permissionId: string,
    ) {
        return this.service.remove({
            roleId,
            permissionId,
        });
    }

    // =========================
    // GET ROLE PERMISSIONS
    // =========================
    @Get('role/:roleId')
    @ApiOperation({ summary: 'Get permissions of a role' })
    @ApiParam({ name: 'roleId' })
    getRolePermissions(@Param('roleId') roleId: string) {
        return this.service.getRolePermissions(roleId);
    }

    // =========================
    // GET ROLES BY PERMISSION
    // =========================
    @Get('permission/:permissionId')
    @ApiOperation({ summary: 'Get roles by permission' })
    @ApiParam({ name: 'permissionId' })
    getRolesByPermission(@Param('permissionId') permissionId: string) {
        return this.service.getRolesByPermission(permissionId);
    }
}