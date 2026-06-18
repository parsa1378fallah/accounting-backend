import { Module } from '@nestjs/common';
import { FiscalPeriodController } from './fiscal-period.controller';
import { FiscalPeriodService } from './fiscal-period.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [FiscalPeriodController],
  providers: [FiscalPeriodService, PrismaService],
  imports: [PrismaModule],
  exports: [PrismaService]

})
export class FiscalPeriodModule { }
