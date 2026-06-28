import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { PrismaModule } from 'src/prisma/prisma.module';

import { CostCentersController } from './controllers/cost-centers.controller';

import { CostCentersService } from './services/cost-centers.service';
import { CostCentersTreeService } from './services/cost-centers-tree.service';

import { CostCentersRepository } from './repositories/cost-centers.repository';

import { CostCentersValidator } from './validators/cost-centers.validator';

import { CostCentersMapper } from './mappers/cost-centers.mapper';

@Module({
  imports: [
    PrismaModule,
    EventEmitterModule,
  ],

  controllers: [
    CostCentersController,
  ],

  providers: [
    //--------------------------------------------------
    // Services
    //--------------------------------------------------

    CostCentersService,
    CostCentersTreeService,

    //--------------------------------------------------
    // Repository
    //--------------------------------------------------

    CostCentersRepository,

    //--------------------------------------------------
    // Validator
    //--------------------------------------------------

    CostCentersValidator,

    //--------------------------------------------------
    // Mapper
    //--------------------------------------------------

    CostCentersMapper,
  ],

  exports: [
    CostCentersService,
    CostCentersTreeService,
  ],
})
export class CostCenterModule { }