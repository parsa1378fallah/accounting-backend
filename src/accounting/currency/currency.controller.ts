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

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CurrencyService } from './currency.service';

import {
  CreateCurrencyDto,
  UpdateCurrencyDto,
  CurrencyQueryDto,
} from './dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Currencies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('currencies')
export class CurrencyController {
  constructor(
    private readonly currencyService: CurrencyService,
  ) { }

  // ============================================================
  // CREATE
  // ============================================================

  @Post()
  @ApiOperation({
    summary: 'Create currency',
  })
  @ApiResponse({
    status: 201,
    description: 'Currency created successfully',
  })
  create(
    @Body() dto: CreateCurrencyDto,
  ) {
    return this.currencyService.create(dto);
  }

  // ============================================================
  // FIND ALL
  // ============================================================

  @Get()
  @ApiOperation({
    summary: 'Get all currencies',
  })
  findAll(
    @Query() query: CurrencyQueryDto,
  ) {
    return this.currencyService.findAll(query);
  }

  // ============================================================
  // SUMMARY
  // ============================================================

  @Get('summary')
  @ApiOperation({
    summary: 'Currencies summary',
  })
  summary() {
    return this.currencyService.summary();
  }

  // ============================================================
  // FIND ONE
  // ============================================================

  @Get(':id')
  @ApiOperation({
    summary: 'Get currency by id',
  })
  @ApiParam({
    name: 'id',
  })
  findOne(
    @Param('id') id: string,
  ) {
    return this.currencyService.findOne(id);
  }

  // ============================================================
  // UPDATE
  // ============================================================

  @Patch(':id')
  @ApiOperation({
    summary: 'Update currency',
  })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCurrencyDto,
  ) {
    return this.currencyService.update(id, dto);
  }

  // ============================================================
  // DELETE
  // ============================================================

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete currency',
  })
  remove(
    @Param('id') id: string,
  ) {
    return this.currencyService.remove(id);
  }

  // ============================================================
  // RESTORE
  // ============================================================

  @Patch(':id/restore')
  @ApiOperation({
    summary: 'Restore currency',
  })
  restore(
    @Param('id') id: string,
  ) {
    return this.currencyService.restore(id);
  }

  // ============================================================
  // ACTIVATE
  // ============================================================

  @Patch(':id/activate')
  @ApiOperation({
    summary: 'Activate currency',
  })
  activate(
    @Param('id') id: string,
  ) {
    return this.currencyService.activate(id);
  }

  // ============================================================
  // DEACTIVATE
  // ============================================================

  @Patch(':id/deactivate')
  @ApiOperation({
    summary: 'Deactivate currency',
  })
  deactivate(
    @Param('id') id: string,
  ) {
    return this.currencyService.deactivate(id);
  }
}