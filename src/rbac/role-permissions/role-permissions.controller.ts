import {
    Controller,
    Post,
    Delete,
    Get,
    Body,
    Param,
    UseGuards,
} from '@nestjs/common';

import { RolePermissionsService } from './role-permissions.service';
import { AssignPermissionDto } from './dto/assign-permission.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('role-permissions')
@UseGuards(JwtAuthGuard)
export class RolePermissionsController {
    constructor(private service: RolePermissionsService) { }

    // assign permission to role
    @Post()
    assign(@Body() dto: AssignPermissionDto) {
        return this.service.assign(dto);
    }

    // remove permission
    @Delete()
    remove(@Body() dto: AssignPermissionDto) {
        return this.service.remove(dto);
    }

    // get permissions of role
    @Get('role/:roleId')
    getRolePermissions(@Param('roleId') roleId: string) {
        return this.service.getRolePermissions(roleId);
    }

    // get roles of permission
    @Get('permission/:permissionId')
    getRolesByPermission(@Param('permissionId') permissionId: string) {
        return this.service.getRolesByPermission(permissionId);
    }
}