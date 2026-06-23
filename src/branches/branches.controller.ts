import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';

import {
    ApiTags,
    ApiOperation,
    ApiParam,
    ApiBody,
    ApiBearerAuth,
} from '@nestjs/swagger';

import { BranchesService } from './branches.service';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentOrg } from 'src/common/decorators/current-org.decorator';

import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBrachDto } from './dto/update-branch.dto';

@ApiTags('Branches')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('branches')
export class BranchesController {
    constructor(
        private readonly branchService: BranchesService,
    ) { }

    /* ============================================================
        CREATE
    ============================================================ */
    @Post()
    @ApiOperation({ summary: 'Create a new branch' })
    @ApiBody({ type: CreateBranchDto })
    create(
        @CurrentOrg() orgId: string,
        @Body() dto: CreateBranchDto,
    ) {
        return this.branchService.create(
            orgId,
            dto,
        );
    }

    /* ============================================================
        FIND ALL
    ============================================================ */
    @Get()
    @ApiOperation({ summary: 'Get all branches' })
    findAll(@CurrentOrg() orgId: string) {
        return this.branchService.findAll(orgId);
    }

    /* ============================================================
        FIND ONE
    ============================================================ */
    @Get(':id')
    @ApiOperation({ summary: 'Get branch by id' })
    @ApiParam({ name: 'id', description: 'Branch ID' })
    findOne(
        @CurrentOrg() orgId: string,
        @Param('id') id: string,
    ) {
        return this.branchService.findOne(
            orgId,
            id,
        );
    }

    /* ============================================================
        UPDATE
    ============================================================ */
    @Patch(':id')
    @ApiOperation({ summary: 'Update branch' })
    @ApiParam({ name: 'id' })
    @ApiBody({ type: UpdateBrachDto })
    update(
        @CurrentOrg() orgId: string,
        @Param('id') id: string,
        @Body() dto: UpdateBrachDto,
    ) {
        return this.branchService.update(
            orgId,
            id,
            dto,
        );
    }

    /* ============================================================
        DELETE (SOFT DELETE)
    ============================================================ */
    @Delete(':id')
    @ApiOperation({ summary: 'Deactivate branch (soft delete)' })
    @ApiParam({ name: 'id' })
    remove(
        @CurrentOrg() orgId: string,
        @Param('id') id: string,
    ) {
        return this.branchService.remove(
            orgId,
            id,
        );
    }
}