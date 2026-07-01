import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { PrismaModule } from 'src/prisma/prisma.module';

import { ProjectsController } from './controllers/project.controller';

import { ProjectsService } from './services/projects.service';
import { ProjectsQueryService } from './services/projects-query.service';
import { ProjectsSummaryService } from './services/projects-summary.service';

import { ProjectsRepository } from './repositories/projects.repository';

import { ProjectsValidator } from './validators/projects.validator';

import { ProjectsMapper } from './mappers/projects.mapper';

@Module({
  imports: [
    PrismaModule,
    EventEmitterModule,
  ],

  controllers: [
    ProjectsController,
  ],

  providers: [
    //-------------------------------------
    // Services
    //-------------------------------------

    ProjectsService,
    ProjectsQueryService,
    ProjectsSummaryService,

    //-------------------------------------
    // Repository
    //-------------------------------------

    ProjectsRepository,

    //-------------------------------------
    // Validator
    //-------------------------------------

    ProjectsValidator,

    //-------------------------------------
    // Mapper
    //-------------------------------------

    ProjectsMapper,
  ],

  exports: [
    ProjectsService,
    ProjectsQueryService,
    ProjectsSummaryService,
  ],
})
export class ProjectModule { }