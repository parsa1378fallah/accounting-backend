import { Module } from '@nestjs/common';
import { FiscalYearController } from './fiscal-year.controller';
import { FiscalYearService } from './fiscal-year.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [FiscalYearController],
  providers: [FiscalYearService, PrismaService],
  exports: [PrismaService, FiscalYearService],
  imports: [PrismaModule]
})
export class FiscalYearModule { }
