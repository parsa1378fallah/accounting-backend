import { Module } from '@nestjs/common';
import { FxGainLossService } from './fx-gain-loss.service';
import { FxGainLossController } from './fx-gain-loss.controller';

@Module({
  controllers: [FxGainLossController],
  providers: [FxGainLossService],
})
export class FxGainLossModule {}
