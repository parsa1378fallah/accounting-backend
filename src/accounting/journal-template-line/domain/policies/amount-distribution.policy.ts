import { Decimal } from 'decimal.js';
import { JournalTemplateLine } from '../entities/journal-template-line.entity';

export class AmountDistributionPolicy {
    validateDistribution(
        lines: JournalTemplateLine[],
        totalAmount: Decimal,
    ): boolean {
        const percentageLines = lines.filter(l =>
            l.getAmountType().isPercentage(),
        );

        const totalPercentage = percentageLines.reduce((sum, line) => {
            const pct = line.getPercentage();
            return sum + (pct ? pct.toNumber() : 0);
        }, 0);

        return totalPercentage <= 100;
    }
}