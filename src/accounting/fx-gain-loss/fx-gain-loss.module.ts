import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { PrismaModule } from 'src/prisma/prisma.module';

import { FxGainLossController } from './controllers/fx-gain-loss.controller';

import { FxGainLossService } from './services/fx-gain-loss.service';
import { FxGainLossQueryService } from './services/fx-gain-loss-query.service';
import { FxGainLossCalculationService } from './services/fx-gain-loss-calculation.service';
import { FxGainLossRealizedService } from './services/fx-gain-loss-realized.service';
import { FxGainLossUnrealizedService } from './services/fx-gain-loss-unrealized.service';
import { FxGainLossRevaluationService } from './services/fx-gain-loss-revaluation.service';

import { FxGainLossRepository } from './repositories/fx-gain-loss.repository';

import { FxGainLossValidator } from './validators/fx-gain-loss.validator';

import { FxGainLossMapper } from './mappers/fx-gain-loss.mapper';

@Module({
  imports: [
    PrismaModule,
    EventEmitterModule,
  ],

  controllers: [
    FxGainLossController,
  ],

  providers: [
    // Application Services
    FxGainLossService,
    FxGainLossQueryService,

    // Domain Services
    FxGainLossCalculationService,
    FxGainLossRealizedService,
    FxGainLossUnrealizedService,
    FxGainLossRevaluationService,

    // Repository
    FxGainLossRepository,

    // Validator
    FxGainLossValidator,

    // Mapper
    FxGainLossMapper,
  ],

  exports: [
    FxGainLossService,
    FxGainLossQueryService,

    FxGainLossCalculationService,
    FxGainLossRealizedService,
    FxGainLossUnrealizedService,
    FxGainLossRevaluationService,

    FxGainLossRepository,
  ],
})
export class FxGainLossModule { }