import {
    Controller,
    Post,
    Delete,
    Get,
    Body,
    Param,
    UseGuards,
} from '@nestjs/common';

import { UserRolesService } from './user-roles.service';
import { AssignRoleDto } from './dto/assign-role.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('user-roles')
@UseGuards(JwtAuthGuard)
export class UserRolesController {
    constructor(private service: UserRolesService) { }

    @Post()
    assign(@Body() dto: AssignRoleDto) {
        return this.service.assignRole(dto);
    }

    @Delete()
    remove(@Body() dto: AssignRoleDto) {
        return this.service.removeRole(dto);
    }

    @Get('user/:userId/:orgId')
    getUserRoles(
        @Param('userId') userId: string,
        @Param('orgId') orgId: string,
    ) {
        return this.service.getUserRoles(userId, orgId);
    }

    @Get('role/:roleId/:orgId')
    getRoleUsers(
        @Param('roleId') roleId: string,
        @Param('orgId') orgId: string,
    ) {
        return this.service.getRoleUsers(roleId, orgId);
    }
}