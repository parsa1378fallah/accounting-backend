import { Module } from '@nestjs/common';
import { BranchesController } from './branches.controller';
import { BranchesService } from './branches.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [BranchesController],
  providers: [BranchesService, PrismaService],
  imports: [PrismaModule]
})
export class BranchesModule { }
