import { Decimal } from 'decimal.js';

export class AmountDistributorHelper {
    static distributeByPercentage(
        totalAmount: Decimal,
        percentages: Map<string, Decimal>,
    ): Map<string, Decimal> {
        const result = new Map<string, Decimal>();

        const totalPercentage = Array.from(percentages.values()).reduce(
            (sum, pct) => sum.plus(pct),
            new Decimal(0),
        );

        percentages.forEach((percentage, id) => {
            const amount = totalAmount
                .times(percentage)
                .dividedBy(totalPercentage);

            result.set(id, amount);
        });

        return result;
    }

    static distributeEvenly(
        totalAmount: Decimal,
        count: number,
    ): Decimal {
        return totalAmount.dividedBy(count);
    }

    static distributeWithRemainder(
        totalAmount: Decimal,
        count: number,
        precision: number,
    ): Decimal[] {
        const perItem = totalAmount.dividedBy(count);
        const items: Decimal[] = [];

        for (let i = 0; i < count - 1; i++) {
            items.push(perItem.toDecimalPlaces(precision));
        }

        // آخرین آیتم شامل باقی‌مانده است
        let remaining = totalAmount;
        for (const item of items) {
            remaining = remaining.minus(item);
        }

        items.push(remaining);

        return items;
    }

    static validateDistribution(
        distributed: Map<string, Decimal>,
        totalAmount: Decimal,
        tolerance: Decimal = new Decimal('0.01'),
    ): boolean {
        const sum = Array.from(distributed.values()).reduce(
            (acc, val) => acc.plus(val),
            new Decimal(0),
        );

        const difference = sum.minus(totalAmount).abs();
        return difference.lessThanOrEqualTo(tolerance);
    }
}