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
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { FxGainLossService } from '../services/fx-gain-loss.service';
import { FxGainLossQueryService } from '../services/fx-gain-loss-query.service';
import { FxGainLossRealizedService } from '../services/fx-gain-loss-realized.service';
import { FxGainLossUnrealizedService } from '../services/fx-gain-loss-unrealized.service';
import { FxGainLossRevaluationService } from '../services/fx-gain-loss-revaluation.service';

import {
  CreateFxGainLossDto,
  UpdateFxGainLossDto,
  QueryFxGainLossDto,
  CreateRealizedFxDto,
  CreateUnrealizedFxDto,
  ExecuteRevaluationDto,
} from '../dto';

@ApiTags('FX Gain / Loss')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('fx-gain-loss')
export class FxGainLossController {
  constructor(
    private readonly service: FxGainLossService,
    private readonly queryService: FxGainLossQueryService,
    private readonly realizedService: FxGainLossRealizedService,
    private readonly unrealizedService: FxGainLossUnrealizedService,
    private readonly revaluationService: FxGainLossRevaluationService,
  ) { }

  // ======================================================
  // CRUD
  // ======================================================

  @Post()
  @ApiOperation({
    summary: 'Create FX Gain/Loss Entry',
  })
  create(
    @Body()
    dto: CreateFxGainLossDto,
  ) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get FX Gain/Loss Entries',
  })
  findAll(
    @Query()
    query: QueryFxGainLossDto,
  ) {
    return this.queryService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get FX Gain/Loss Entry',
  })
  findOne(
    @Param('id')
    id: string,
  ) {
    return this.queryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update FX Gain/Loss Entry',
  })
  update(
    @Param('id')
    id: string,

    @Body()
    dto: UpdateFxGainLossDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete FX Gain/Loss Entry',
  })
  remove(
    @Param('id')
    id: string,
  ) {
    return this.service.remove(id);
  }

  // ======================================================
  // Realized
  // ======================================================

  @Post('realized')
  @ApiOperation({
    summary: 'Create Realized FX Gain/Loss',
  })
  createRealized(
    @Body()
    dto: CreateRealizedFxDto,
  ) {
    return this.realizedService.createFromSettlement(dto);
  }

  // ======================================================
  // Unrealized
  // ======================================================

  @Post('unrealized')
  @ApiOperation({
    summary: 'Create Unrealized FX Gain/Loss',
  })
  createUnrealized(
    @Body()
    dto: CreateUnrealizedFxDto,
  ) {
    return this.unrealizedService.createRevaluation(dto);
  }

  // ======================================================
  // Period End Revaluation
  // ======================================================

  @Post('revaluation')
  @ApiOperation({
    summary: 'Execute Period End Revaluation',
  })
  executeRevaluation(
    @Body()
    dto: ExecuteRevaluationDto,
  ) {
    return this.revaluationService.execute(
      dto.organizationId,
      dto.baseCurrencyId,
    );
  }
}