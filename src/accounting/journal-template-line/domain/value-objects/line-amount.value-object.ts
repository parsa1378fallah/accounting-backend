import { Decimal } from 'decimal.js';
import { JOURNAL_TEMPLATE_LINE_CONSTANTS } from '../../common/constants/journal-template-line.constants';

export class LineAmount {
    private readonly _value: Decimal;

    private constructor(value: Decimal | number | string) {
        const decimal = new Decimal(value);

        if (decimal.isNaN()) {
            throw new Error('Invalid amount: NaN');
        }

        if (
            decimal.lessThan(0) ||
            decimal.greaterThan(JOURNAL_TEMPLATE_LINE_CONSTANTS.MAX_AMOUNT)
        ) {
            throw new Error(
                `Amount must be between 0 and ${JOURNAL_TEMPLATE_LINE_CONSTANTS.MAX_AMOUNT}`,
            );
        }

        this._value = decimal;
    }

    static create(value: Decimal | number | string): LineAmount {
        return new LineAmount(value);
    }

    static zero(): LineAmount {
        return new LineAmount(0);
    }

    get value(): Decimal {
        return this._value;
    }

    add(other: LineAmount): LineAmount {
        return new LineAmount(this._value.plus(other._value));
    }

    subtract(other: LineAmount): LineAmount {
        return new LineAmount(this._value.minus(other._value));
    }

    multiply(multiplier: Decimal | number): LineAmount {
        return new LineAmount(this._value.times(multiplier));
    }

    divide(divisor: Decimal | number): LineAmount {
        if (new Decimal(divisor).isZero()) {
            throw new Error('Division by zero');
        }
        return new LineAmount(this._value.dividedBy(divisor));
    }

    equals(other: LineAmount): boolean {
        return this._value.equals(other._value);
    }

    toString(): string {
        return this._value.toString();
    }

    toJSON() {
        return this._value.toJSON();
    }
}