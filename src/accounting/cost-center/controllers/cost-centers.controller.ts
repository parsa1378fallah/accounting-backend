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

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { CostCentersService } from '../services/cost-centers.service';

import { CreateCostCenterDto } from '../dto/create-cost-center.dto';
import { UpdateCostCenterDto } from '../dto/update-cost-center.dto';
import { QueryCostCenterDto } from '../dto/query-cost-center.dto';
import { MoveCostCenterDto } from '../dto';

@Controller('cost-centers')
@UseGuards(JwtAuthGuard)
export class CostCentersController {
    constructor(
        private readonly service: CostCentersService,
    ) { }

    //--------------------------------------------------
    // Create
    //--------------------------------------------------

    @Post()
    create(
        @Body()
        dto: CreateCostCenterDto,
    ) {
        return this.service.create(dto);
    }

    //--------------------------------------------------
    // Find All
    //--------------------------------------------------

    @Get()
    findAll(
        @Query()
        query: QueryCostCenterDto,
    ) {
        return this.service.findAll(query);
    }

    //--------------------------------------------------
    // Tree
    //--------------------------------------------------

    @Get('tree/:organizationId')
    tree(
        @Param('organizationId')
        organizationId: string,
    ) {
        return this.service.tree(
            organizationId,
        );
    }

    //--------------------------------------------------
    // Find One
    //--------------------------------------------------

    @Get(':id')
    findOne(
        @Param('id')
        id: string,
    ) {
        return this.service.findOne(id);
    }

    //--------------------------------------------------
    // Update
    //--------------------------------------------------

    @Patch(':id')
    update(
        @Param('id')
        id: string,

        @Body()
        dto: UpdateCostCenterDto,
    ) {
        return this.service.update(
            id,
            dto,
        );
    }

    //--------------------------------------------------
    // Delete
    //--------------------------------------------------

    @Delete(':id')
    remove(
        @Param('id')
        id: string,
    ) {
        return this.service.remove(id);
    }

    //--------------------------------------------------
    // Restore
    //--------------------------------------------------

    @Patch(':id/restore')
    restore(
        @Param('id')
        id: string,
    ) {
        return this.service.restore(id);
    }

    //--------------------------------------------------
    // Activate
    //--------------------------------------------------

    @Patch(':id/activate')
    activate(
        @Param('id')
        id: string,
    ) {
        return this.service.activate(id);
    }

    //--------------------------------------------------
    // Deactivate
    //--------------------------------------------------

    @Patch(':id/deactivate')
    deactivate(
        @Param('id')
        id: string,
    ) {
        return this.service.deactivate(id);
    }
    @Get('summary/:organizationId')
    summary(
        @Param('organizationId')
        organizationId: string,
    ) {
        return this.service.summary(
            organizationId,
        );
    }
    @Patch(':id/move')
    move(
        @Param('id')
        id: string,

        @Body()
        dto: MoveCostCenterDto,
    ) {
        return this.service.move(
            id,
            dto.parentId ?? null,
        );
    }
    @Get('children/:organizationId')
    children(
        @Param('organizationId')
        organizationId: string,

        @Query('parentId')
        parentId?: string,
    ) {
        return this.service.children(
            organizationId,
            parentId ?? null,
        );
    }
    @Get(':id/parent')
    parent(
        @Param('id')
        id: string,
    ) {
        return this.service.parent(id);
    }
    @Get('roots/:organizationId')
    roots(
        @Param('organizationId')
        organizationId: string,
    ) {
        return this.service.roots(
            organizationId,
        );
    }
}