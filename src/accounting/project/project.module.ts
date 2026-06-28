import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './controllers/project.controller';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule { }
