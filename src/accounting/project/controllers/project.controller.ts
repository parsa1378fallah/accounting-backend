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

import { ProjectsService } from '../services/projects.service';

import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { QueryProjectDto } from '../dto/query-project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly service: ProjectsService,
  ) { }

  //--------------------------------------------------
  // CREATE
  //--------------------------------------------------

  @Post()
  create(
    @Body() dto: CreateProjectDto,
  ) {
    return this.service.create(dto);
  }

  //--------------------------------------------------
  // FIND ALL
  //--------------------------------------------------

  @Get()
  findAll(
    @Query() query: QueryProjectDto,
  ) {
    return this.service.findAll(query);
  }

  //--------------------------------------------------
  // FIND ONE
  //--------------------------------------------------

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.service.findOne(id);
  }

  //--------------------------------------------------
  // UPDATE
  //--------------------------------------------------

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.service.update(id, dto);
  }

  //--------------------------------------------------
  // DELETE (Soft Delete)
  //--------------------------------------------------

  @Delete(':id')
  remove(
    @Param('id') id: string,
  ) {
    return this.service.remove(id);
  }

  //--------------------------------------------------
  // SUMMARY
  //--------------------------------------------------

  @Get('summary/:organizationId')
  summary(
    @Param('organizationId')
    organizationId: string,
  ) {
    return this.service.getSummary(
      organizationId,
    );
  }

  //--------------------------------------------------
  // STATUS BREAKDOWN
  //--------------------------------------------------

  @Get('status/:organizationId')
  status(
    @Param('organizationId')
    organizationId: string,
  ) {
    return this.service.getStatusBreakdown(
      organizationId,
    );
  }

  //--------------------------------------------------
  // BUDGET OVERVIEW
  //--------------------------------------------------

  @Get('budget/:organizationId')
  budget(
    @Param('organizationId')
    organizationId: string,
  ) {
    return this.service.getBudgetOverview(
      organizationId,
    );
  }
}