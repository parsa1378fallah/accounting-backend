import {
    Body,
    Controller,
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

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentOrg } from 'src/common/decorators/current-org.decorator';

import { FiscalPeriodService } from './fiscal-period.service';

import {
    CreateFiscalPeriodDto,
    UpdateFiscalPeriodDto,
} from './dto';

@ApiTags('Fiscal Period')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('fiscal-period')
export class FiscalPeriodController {
    constructor(
        private readonly fiscalPeriodsService: FiscalPeriodService,
    ) { }

    /* ============================================================
        CREATE
    ============================================================ */
    @Post()
    @ApiOperation({ summary: 'Create fiscal period' })
    @ApiBody({ type: CreateFiscalPeriodDto })
    create(
        @CurrentOrg() orgId: string,
        @Body() dto: CreateFiscalPeriodDto,
    ) {
        return this.fiscalPeriodsService.create(
            orgId,
            dto,
        );
    }

    /* ============================================================
        FIND ALL
    ============================================================ */
    @Get()
    @ApiOperation({ summary: 'Get all fiscal periods' })
    findAll(
        @CurrentOrg() orgId: string,
    ) {
        return this.fiscalPeriodsService.findAll(orgId);
    }

    /* ============================================================
        UPDATE
    ============================================================ */
    @Patch(':id')
    @ApiOperation({ summary: 'Update fiscal period' })
    @ApiParam({ name: 'id', description: 'Fiscal period ID' })
    @ApiBody({ type: UpdateFiscalPeriodDto })
    update(
        @CurrentOrg() orgId: string,
        @Param('id') id: string,
        @Body() dto: UpdateFiscalPeriodDto,
    ) {
        return this.fiscalPeriodsService.update(
            orgId,
            id,
            dto,
        );
    }

    /* ============================================================
        CLOSE
    ============================================================ */
    @Post(':id/close')
    @ApiOperation({ summary: 'Close fiscal period' })
    @ApiParam({ name: 'id' })
    close(
        @CurrentOrg() orgId: string,
        @Param('id') id: string,
    ) {
        return this.fiscalPeriodsService.close(
            orgId,
            id,
        );
    }

    /* ============================================================
        REOPEN
    ============================================================ */
    @Post(':id/reopen')
    @ApiOperation({ summary: 'Reopen fiscal period' })
    @ApiParam({ name: 'id' })
    reopen(
        @CurrentOrg() orgId: string,
        @Param('id') id: string,
    ) {
        return this.fiscalPeriodsService.reopen(
            orgId,
            id,
        );
    }
}