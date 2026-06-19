import { Module } from '@nestjs/common';
import { NumberSequenceService } from './number-sequence.service';
import { NumberSequenceController } from './number-sequence.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NumberSequenceController],
  providers: [NumberSequenceService],
  exports: [NumberSequenceService],
})
export class NumberSequenceModule { }