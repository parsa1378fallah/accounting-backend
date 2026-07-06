import { DebitCreditType } from '../../common/enums/debit-credit-type.enum';

export class DebitCredit {
    private readonly _value: DebitCreditType;

    private constructor(value: DebitCreditType) {
        this._value = value;
    }

    static create(value: boolean | DebitCreditType | string): DebitCredit {
        if (typeof value === 'boolean') {
            return new DebitCredit(
                value ? DebitCreditType.DEBIT : DebitCreditType.CREDIT,
            );
        }

        const enumValue =
            value === DebitCreditType.DEBIT ||
                Boolean(value) === true ||
                value === 'DEBIT'
                ? DebitCreditType.DEBIT
                : DebitCreditType.CREDIT;

        return new DebitCredit(enumValue);
    }

    static debit(): DebitCredit {
        return new DebitCredit(DebitCreditType.DEBIT);
    }

    static credit(): DebitCredit {
        return new DebitCredit(DebitCreditType.CREDIT);
    }

    get value(): DebitCreditType {
        return this._value;
    }

    isDebit(): boolean {
        return this._value === DebitCreditType.DEBIT;
    }

    isCredit(): boolean {
        return this._value === DebitCreditType.CREDIT;
    }

    toggle(): DebitCredit {
        return this.isDebit() ? DebitCredit.credit() : DebitCredit.debit();
    }

    equals(other: DebitCredit): boolean {
        return this._value === other._value;
    }

    toString(): string {
        return this._value;
    }
}