import { FiscalPeriodService } from './fiscal-period.service';
import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentOrg } from 'src/common/decorators/current-org.decorator';
import { CreateFiscalPeriodDto, UpdateFiscalPeriodDto } from './dto';

@Controller('fiscal-period')
@UseGuards(JwtAuthGuard)
export class FiscalPeriodController {
    constructor(private readonly fiscalPeriodsService: FiscalPeriodService) { }

    @Post()
    create(
        @CurrentOrg() orgId: string,
        @Body() dto: CreateFiscalPeriodDto
    ) {
        return this.fiscalPeriodsService.create(orgId, dto)
    }

    @Get()
    findAll(
        @CurrentOrg() orgId: string,
    ) {
        return this.fiscalPeriodsService.findAll(orgId)
    }

    @Patch(':id')
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

    @Post(':id/close')
    close(
        @CurrentOrg() orgId: string,
        @Param('id') id: string,
    ) {
        return this.fiscalPeriodsService.close(
            orgId,
            id,
        );
    }

    @Post(':id/reopen')
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
