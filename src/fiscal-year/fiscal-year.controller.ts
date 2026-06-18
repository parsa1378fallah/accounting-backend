import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CurrentOrg } from 'src/common/decorators/current-org.decorator';
import { CreateFiscalYearDto } from './dto';
import { FiscalYearService } from './fiscal-year.service';

@Controller('fiscal-year')
export class FiscalYearController {
    constructor(private fiscalYearService: FiscalYearService) { }


    @Post()
    create(@CurrentOrg() orgId: string, @Body() dto: CreateFiscalYearDto) {
        return this.fiscalYearService.create(orgId, dto)
    }
    @Get()
    findAll(@CurrentOrg() orgId: string) {
        return this.fiscalYearService.findAll(orgId)
    }
    @Get(':id')
    findOne(
        @CurrentOrg() orgId: string,
        @Param('id') id: string
    ) {
        return this.fiscalYearService.findOne(orgId, id)
    }

    @Patch(':id')
    update(
        @CurrentOrg() orgId: string,
        @Param('id') id: string,
        dto: CreateFiscalYearDto
    ) {
        return this.fiscalYearService.update(orgId, id, dto)
    }

    @Post(':id/close')
    close(
        @CurrentOrg() orgId: string,
        @Param('id') id: string
    ) {
        return this.fiscalYearService.close(orgId, id)
    }

    @Post(':id/reopen')
    reopen(
        @CurrentOrg() orgId: string,
        @Param('id') id: string
    ) {
        return this.fiscalYearService.reopen(orgId, id)
    }


    @Get('active')
    findActive(@CurrentOrg() orgId: string) {
        return this.fiscalYearService.findActive(orgId)
    }
}
