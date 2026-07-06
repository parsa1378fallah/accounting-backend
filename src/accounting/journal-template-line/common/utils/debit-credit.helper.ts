import { DebitCredit } from '../../domain/value-objects/debit-credit.value-object';
import { DebitCreditType } from '../enums/debit-credit-type.enum';

export class DebitCreditHelper {
    static format(isDebit: boolean | DebitCredit): string {
        if (isDebit instanceof DebitCredit) {
            return isDebit.isDebit() ? 'DEBIT' : 'CREDIT';
        }
        return isDebit ? 'DEBIT' : 'CREDIT';
    }

    static formatAsSymbol(isDebit: boolean | DebitCredit): string {
        if (isDebit instanceof DebitCredit) {
            return isDebit.isDebit() ? 'Dr' : 'Cr';
        }
        return isDebit ? 'Dr' : 'Cr';
    }

    static parse(value: string | boolean | DebitCredit): DebitCredit {
        if (value instanceof DebitCredit) {
            return value;
        }

        if (typeof value === 'boolean') {
            return DebitCredit.create(value);
        }

        const normalized = value.toUpperCase();
        if (normalized === 'DEBIT' || normalized === 'DR' || normalized === 'D') {
            return DebitCredit.debit();
        }

        return DebitCredit.credit();
    }

    static toggle(isDebit: boolean | DebitCredit): boolean {
        if (isDebit instanceof DebitCredit) {
            return isDebit.toggle().isDebit();
        }
        return !isDebit;
    }

    static areOpposite(
        first: boolean | DebitCredit,
        second: boolean | DebitCredit,
    ): boolean {
        const firstIsDebit =
            first instanceof DebitCredit ? first.isDebit() : first;
        const secondIsDebit =
            second instanceof DebitCredit ? second.isDebit() : second;

        return firstIsDebit !== secondIsDebit;
    }
}