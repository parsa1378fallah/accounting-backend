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

import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';

import { PermissionsService } from './permissions.service';
import {
    CreatePermissionDto,
    UpdatePermissionDto,
    PermissionFilterDto,
} from './dto';

@ApiTags('Permissions')
@Controller('permissions')
export class PermissionsController {
    constructor(private readonly service: PermissionsService) { }

    // =========================
    // CREATE PERMISSION
    // =========================
    @Post()
    @ApiOperation({ summary: 'Create permission' })
    @ApiResponse({ status: 201, description: 'Permission created' })
    create(@Body() dto: CreatePermissionDto) {
        return this.service.create(dto);
    }

    // =========================
    // GET ALL (WITH FILTER)
    // =========================
    @Get()
    @ApiOperation({ summary: 'Get all permissions' })
    @ApiResponse({ status: 200, description: 'List of permissions' })
    findAll(@Query() filter: PermissionFilterDto) {
        return this.service.findAll(filter);
    }

    // =========================
    // GET ONE
    // =========================
    @Get(':id')
    @ApiOperation({ summary: 'Get permission by id' })
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 200, description: 'Permission detail' })
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    // =========================
    // UPDATE
    // =========================
    @Patch(':id')
    @ApiOperation({ summary: 'Update permission' })
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 200, description: 'Permission updated' })
    update(
        @Param('id') id: string,
        @Body() dto: UpdatePermissionDto,
    ) {
        return this.service.update(id, dto);
    }

    // =========================
    // DELETE
    // =========================
    @Delete(':id')
    @ApiOperation({ summary: 'Delete permission' })
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 200, description: 'Permission deleted' })
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}