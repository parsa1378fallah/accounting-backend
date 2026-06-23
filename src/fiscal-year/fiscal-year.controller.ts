import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
} from '@nestjs/common';

import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';

import { CurrentOrg } from 'src/common/decorators/current-org.decorator';

import { CreateFiscalYearDto } from './dto/create-fiscal-year.dto';
import { UpdateFiscalYearDto } from './dto/update-fiscal-year.dto';

import { FiscalYearService } from './fiscal-year.service';

@ApiTags('Fiscal Year')
@Controller('fiscal-year')
export class FiscalYearController {
    constructor(
        private readonly fiscalYearService: FiscalYearService,
    ) { }

    /* ============================================================
        Create
    ============================================================ */
    @Post()
    @ApiOperation({ summary: 'Create fiscal year' })
    @ApiBody({ type: CreateFiscalYearDto })
    create(
        @CurrentOrg() orgId: string,
        @Body() dto: CreateFiscalYearDto,
    ) {
        return this.fiscalYearService.create(orgId, dto);
    }

    /* ============================================================
        Read All
    ============================================================ */
    @Get()
    @ApiOperation({ summary: 'Get all fiscal years' })
    findAll(@CurrentOrg() orgId: string) {
        return this.fiscalYearService.findAll(orgId);
    }

    /* ============================================================
        Active (IMPORTANT: before :id route)
    ============================================================ */
    @Get('active')
    @ApiOperation({ summary: 'Get active fiscal year' })
    findActive(@CurrentOrg() orgId: string) {
        return this.fiscalYearService.findActive(orgId);
    }

    /* ============================================================
        Get One
    ============================================================ */
    @Get(':id')
    @ApiOperation({ summary: 'Get fiscal year by id' })
    @ApiParam({ name: 'id' })
    findOne(
        @CurrentOrg() orgId: string,
        @Param('id') id: string,
    ) {
        return this.fiscalYearService.findOne(orgId, id);
    }

    /* ============================================================
        Update
    ============================================================ */
    @Patch(':id')
    @ApiOperation({ summary: 'Update fiscal year' })
    @ApiParam({ name: 'id' })
    @ApiBody({ type: UpdateFiscalYearDto })
    update(
        @CurrentOrg() orgId: string,
        @Param('id') id: string,
        @Body() dto: UpdateFiscalYearDto,
    ) {
        return this.fiscalYearService.update(orgId, id, dto);
    }

    /* ============================================================
        Close
    ============================================================ */
    @Post(':id/close')
    @ApiOperation({ summary: 'Close fiscal year' })
    @ApiParam({ name: 'id' })
    close(
        @CurrentOrg() orgId: string,
        @Param('id') id: string,
    ) {
        return this.fiscalYearService.close(orgId, id);
    }

    /* ============================================================
        Reopen
    ============================================================ */
    @Post(':id/reopen')
    @ApiOperation({ summary: 'Reopen fiscal year' })
    @ApiParam({ name: 'id' })
    reopen(
        @CurrentOrg() orgId: string,
        @Param('id') id: string,
    ) {
        return this.fiscalYearService.reopen(orgId, id);
    }
}