import { Module } from '@nestjs/common';
import { ExchangeRateService } from './exchange-rates.service';
import { ExchangeRatesController } from './exchange-rates.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ExchangeRatesController],
  providers: [ExchangeRateService],
})
export class ExchangeRatesModule { }
