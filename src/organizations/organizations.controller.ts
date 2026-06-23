import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';

import { OrganizationsService } from './organizations.service';

import {
    CreateOrganizationDto,
    UpdateOrganizationDto,
    OrganizationQueryDto,
} from './dto';

// اگر داری این‌ها را در پروژه:
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/auth/guards/permision.guard';
import { Permissions } from 'src/auth/decorators/permisions.decorator';

// Swagger
import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Organizations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('organizations')
export class OrganizationsController {
    constructor(
        private readonly organizationService: OrganizationsService,
    ) { }

    // ============================================================
    // Create
    // ============================================================

    @Post()
    @Permissions('organization:create')
    @ApiOperation({ summary: 'Create organization' })
    create(@Body() dto: CreateOrganizationDto) {
        return this.organizationService.create(dto);
    }

    // ============================================================
    // Find All (Pagination + Search + Filter)
    // ============================================================

    @Get()
    @Permissions('organization:read')
    @ApiOperation({ summary: 'Get all organizations' })
    findAll(@Query() query: OrganizationQueryDto) {
        return this.organizationService.findAll(query);
    }

    // ============================================================
    // Summary
    // ============================================================

    @Get('summary')
    @Permissions('organization:summary')
    @ApiOperation({
        summary: 'Get organizations summary',
    })
    summary() {
        return this.organizationService.summary();
    }

    // ============================================================
    // Find One
    // ============================================================

    @Get(':id')
    @Permissions('organization:read')
    @ApiOperation({ summary: 'Get organization by id' })
    findOne(@Param('id') id: string) {
        return this.organizationService.findOne(id);
    }

    // ============================================================
    // Update
    // ============================================================

    @Patch(':id')
    @Permissions('organization:update')
    @ApiOperation({ summary: 'Update organization' })
    update(
        @Param('id') id: string,
        @Body() dto: UpdateOrganizationDto,
    ) {
        return this.organizationService.update(id, dto);
    }

    // ============================================================
    // Delete (Soft Delete)
    // ============================================================

    @Delete(':id')
    @Permissions('organization:delete')
    @ApiOperation({ summary: 'Delete organization' })
    remove(@Param('id') id: string) {
        return this.organizationService.remove(id);
    }

    // ============================================================
    // Restore
    // ============================================================

    @Patch(':id/restore')
    @Permissions('organization:restore')
    @ApiOperation({ summary: 'Restore organization' })
    restore(@Param('id') id: string) {
        return this.organizationService.restore(id);
    }

    // ============================================================
    // Activate
    // ============================================================

    @Patch(':id/activate')
    @Permissions('organization:activate')
    @ApiOperation({ summary: 'Activate organization' })
    activate(@Param('id') id: string) {
        return this.organizationService.activate(id);
    }

    // ============================================================
    // Deactivate
    // ============================================================

    @Patch(':id/deactivate')
    @Permissions('organization:activate')
    @ApiOperation({
        summary: 'Deactivate organization',
    })
    deactivate(@Param('id') id: string) {
        return this.organizationService.deactivate(id);
    }
}