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
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

import { ExchangeRateService } from './exchange-rates.service';
import { CreateExchangeRateDto } from './dto/create-exchange-rate.dto';
import { UpdateExchangeRateDto } from './dto/update-exchange-rate.dto';
import { ExchangeRateQueryDto } from './dto/exchange-rate-query.dto';
import { CurrentOrg } from 'src/common/decorators/current-org.decorator';

@ApiTags('Exchange Rates')
@ApiBearerAuth()
@Controller('exchange-rates')
export class ExchangeRatesController {
  constructor(private readonly service: ExchangeRateService) { }

  // =====================================================
  // CREATE
  // =====================================================
  @Post()
  @ApiOperation({ summary: 'Create exchange rate' })
  @ApiResponse({ status: 201, description: 'Exchange rate created' })
  create(@Body() dto: CreateExchangeRateDto, @CurrentOrg() orgId: string,) {
    return this.service.create(orgId, dto);
  }

  // =====================================================
  // LIST (FILTER + PAGINATION)
  // =====================================================
  @Get()
  @ApiOperation({ summary: 'Get all exchange rates' })
  @ApiResponse({ status: 200, description: 'List of exchange rates' })
  findAll(@Query() query: ExchangeRateQueryDto) {
    return this.service.findAll(query);
  }

  // =====================================================
  // SUMMARY
  // =====================================================
  @Get('summary/:currencyId')
  @ApiOperation({ summary: 'Exchange rate summary by currency' })
  @ApiParam({ name: 'currencyId', description: 'Currency ID' })
  summary(@Param('currencyId') currencyId: string) {
    return this.service.summary(currencyId);
  }

  // =====================================================
  // LATEST RATE (IMPORTANT FOR ACCOUNTING)
  // =====================================================
  @Get('latest/:currencyId')
  @ApiOperation({ summary: 'Get latest exchange rate' })
  @ApiParam({ name: 'currencyId', description: 'Currency ID' })
  getLatest(@Param('currencyId') currencyId: string) {
    return this.service.getLatest(currencyId);
  }

  // =====================================================
  // HISTORICAL RATE (ACCOUNTING CORE)
  // =====================================================
  @Get('historical/:currencyId')
  @ApiOperation({ summary: 'Get exchange rate at specific date' })
  @ApiParam({ name: 'currencyId', description: 'Currency ID' })
  @ApiQuery({ name: 'date', description: 'ISO Date (YYYY-MM-DD)' })
  getAtDate(
    @Param('currencyId') currencyId: string,
    @Query('date') date: string,
  ) {
    return this.service.getRateAtDate(currencyId, date);
  }

  // =====================================================
  // GET BY ID
  // =====================================================
  @Get(':id')
  @ApiOperation({ summary: 'Get exchange rate by id' })
  @ApiParam({ name: 'id', description: 'Exchange Rate ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // =====================================================
  // UPDATE
  // =====================================================
  @Patch(':id')
  @ApiOperation({ summary: 'Update exchange rate' })
  @ApiParam({ name: 'id', description: 'Exchange Rate ID' })
  update(@Param('id') id: string, @Body() dto: UpdateExchangeRateDto) {
    return this.service.update(id, dto);
  }

  // =====================================================
  // SOFT DELETE
  // =====================================================
  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete exchange rate' })
  @ApiParam({ name: 'id', description: 'Exchange Rate ID' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  // =====================================================
  // RESTORE
  // =====================================================
  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore exchange rate' })
  @ApiParam({ name: 'id', description: 'Exchange Rate ID' })
  restore(@Param('id') id: string) {
    return this.service.restore(id);
  }

  // =====================================================
  // ACTIVATE
  // =====================================================
  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate exchange rate' })
  @ApiParam({ name: 'id', description: 'Exchange Rate ID' })
  activate(@Param('id') id: string) {
    return this.service.activate(id);
  }

  // =====================================================
  // DEACTIVATE
  // =====================================================
  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate exchange rate' })
  @ApiParam({ name: 'id', description: 'Exchange Rate ID' })
  deactivate(@Param('id') id: string) {
    return this.service.deactivate(id);
  }
}