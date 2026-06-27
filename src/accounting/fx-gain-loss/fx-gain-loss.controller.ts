import { Controller } from '@nestjs/common';
import { FxGainLossService } from './fx-gain-loss.service';

@Controller('fx-gain-loss')
export class FxGainLossController {
  constructor(private readonly fxGainLossService: FxGainLossService) {}
}
