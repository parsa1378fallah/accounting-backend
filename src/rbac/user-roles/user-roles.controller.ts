import {
    Controller,
    Post,
    Delete,
    Get,
    Body,
    Param,
    UseGuards,
} from '@nestjs/common';

import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

import { UserRolesService } from './user-roles.service';
import { AssignRoleDto } from './dto/assign-role.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('User Roles')
@UseGuards(JwtAuthGuard)
@Controller('user-roles')
export class UserRolesController {
    constructor(private service: UserRolesService) { }

    // =====================
    // ASSIGN ROLE
    // =====================
    @Post()
    @ApiOperation({ summary: 'Assign role to user' })
    @ApiResponse({ status: 201, description: 'Role assigned successfully' })
    assign(@Body() dto: AssignRoleDto) {
        return this.service.assignRole(dto);
    }

    // =====================
    // REMOVE ROLE
    // =====================
    @Delete()
    @ApiOperation({ summary: 'Remove role from user' })
    @ApiResponse({ status: 200, description: 'Role removed successfully' })
    remove(@Body() dto: AssignRoleDto) {
        return this.service.removeRole(dto);
    }

    // =====================
    // GET USER ROLES
    // =====================
    @Get('user/:userId/:orgId')
    @ApiOperation({ summary: 'Get all roles of a user in an organization' })
    @ApiParam({ name: 'userId' })
    @ApiParam({ name: 'orgId' })
    @ApiResponse({ status: 200 })
    getUserRoles(
        @Param('userId') userId: string,
        @Param('orgId') orgId: string,
    ) {
        return this.service.getUserRoles(userId, orgId);
    }

    // =====================
    // GET ROLE USERS
    // =====================
    @Get('role/:roleId/:orgId')
    @ApiOperation({ summary: 'Get all users of a role in an organization' })
    @ApiParam({ name: 'roleId' })
    @ApiParam({ name: 'orgId' })
    @ApiResponse({ status: 200 })
    getRoleUsers(
        @Param('roleId') roleId: string,
        @Param('orgId') orgId: string,
    ) {
        return this.service.getRoleUsers(roleId, orgId);
    }
}