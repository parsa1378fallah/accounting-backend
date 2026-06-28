import { PartialType } from '@nestjs/swagger';

import { CreateFxGainLossDto } from './create-fx-gain-loss.dto';

export class UpdateFxGainLossDto extends PartialType(
    CreateFxGainLossDto,
) { }