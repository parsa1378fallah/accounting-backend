import { Decimal } from 'decimal.js';
import { AmountCalculation } from '../entities/amount-calculation.entity';
import { DebitCreditImbalanceException } from '../../common/exceptions/calculation-error.exception';

export class DebitCreditBalancePolicy {
    validate(calculations: AmountCalculation[]): void {
        let totalDebit = new Decimal(0);
        let totalCredit = new Decimal(0);

        calculations.forEach(calc => {
            if (calc.isDebit) {
                totalDebit = totalDebit.plus(calc.amount);
            } else {
                totalCredit = totalCredit.plus(calc.amount);
            }
        });

        if (!totalDebit.equals(totalCredit)) {
            throw new DebitCreditImbalanceException(totalDebit, totalCredit);
        }
    }

    isBalanced(calculations: AmountCalculation[]): boolean {
        let totalDebit = new Decimal(0);
        let totalCredit = new Decimal(0);

        calculations.forEach(calc => {
            if (calc.isDebit) {
                totalDebit = totalDebit.plus(calc.amount);
            } else {
                totalCredit = totalCredit.plus(calc.amount);
            }
        });

        return totalDebit.equals(totalCredit);
    }
}