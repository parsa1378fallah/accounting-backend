import { Injectable } from '@nestjs/common';

@Injectable()
export class FxGainLossCalculationService {

    /**
     * Convert foreign amount to base currency.
     */
    convertToBase(
        foreignAmount: number,
        exchangeRate: number,
    ): number {
        return Number(
            (foreignAmount * exchangeRate).toFixed(4),
        );
    }

    /**
     * Calculate realized gain/loss.
     */
    calculateRealized(
        originalRate: number,
        settlementRate: number,
        foreignAmount: number,
    ) {
        const originalValue =
            foreignAmount * originalRate;

        const settlementValue =
            foreignAmount * settlementRate;

        const difference =
            settlementValue - originalValue;

        return {
            originalValue,
            settlementValue,
            difference,
            gain: difference > 0 ? difference : 0,
            loss: difference < 0 ? Math.abs(difference) : 0,
        };
    }

    /**
     * Calculate unrealized gain/loss.
     */
    calculateUnrealized(
        bookRate: number,
        currentRate: number,
        foreignAmount: number,
    ) {
        const bookValue =
            foreignAmount * bookRate;

        const marketValue =
            foreignAmount * currentRate;

        const difference =
            marketValue - bookValue;

        return {
            bookValue,
            marketValue,
            difference,
            gain: difference > 0 ? difference : 0,
            loss: difference < 0 ? Math.abs(difference) : 0,
        };
    }

    /**
     * Returns whether result is gain.
     */
    isGain(amount: number): boolean {
        return amount > 0;
    }

    /**
     * Returns whether result is loss.
     */
    isLoss(amount: number): boolean {
        return amount < 0;
    }

    /**
     * Absolute difference.
     */
    absoluteDifference(
        amountA: number,
        amountB: number,
    ): number {
        return Math.abs(amountA - amountB);
    }

    /**
     * Round accounting values.
     */
    round(
        value: number,
        decimals = 4,
    ): number {
        return Number(value.toFixed(decimals));
    }
}