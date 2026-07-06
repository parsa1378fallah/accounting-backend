import { Injectable, Logger } from '@nestjs/common';
import { Decimal } from 'decimal.js';
import { RoundingMode } from '../../common/enums/rounding-mode.enum';

@Injectable()
export class RoundingStrategyService {
    private readonly logger = new Logger(RoundingStrategyService.name);

    round(
        value: Decimal,
        precision: number,
        mode: RoundingMode = RoundingMode.ROUND_HALF_UP,
    ): Decimal {
        this.logger.debug(
            `Rounding ${value} to ${precision} decimals using ${mode}`,
        );

        const roundingMode = this.mapRoundingMode(mode);

        return value.toDecimalPlaces(precision, roundingMode);
    }

    private mapRoundingMode(mode: RoundingMode): Decimal.Rounding {
        switch (mode) {
            case RoundingMode.ROUND_UP:
                return Decimal.ROUND_UP;

            case RoundingMode.ROUND_DOWN:
                return Decimal.ROUND_DOWN;

            case RoundingMode.ROUND_HALF_UP:
                return Decimal.ROUND_HALF_UP;

            case RoundingMode.ROUND_HALF_DOWN:
                return Decimal.ROUND_HALF_DOWN;

            default:
                return Decimal.ROUND_HALF_UP;
        }
    }
    roundByStrategy(
        value: Decimal,
        precision: number,
        strategy: 'NORMAL' | 'UP' | 'DOWN' = 'NORMAL',
    ): Decimal {
        switch (strategy) {
            case 'UP':
                return this.round(value, precision, RoundingMode.ROUND_UP);
            case 'DOWN':
                return this.round(value, precision, RoundingMode.ROUND_DOWN);
            default:
                return this.round(value, precision, RoundingMode.ROUND_HALF_UP);
        }
    }
}