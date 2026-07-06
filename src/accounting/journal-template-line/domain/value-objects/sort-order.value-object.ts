import { JOURNAL_TEMPLATE_LINE_CONSTANTS } from '../../common/constants/journal-template-line.constants';

export class SortOrder {
    private readonly _value: number;

    private constructor(value: number) {
        if (
            value < JOURNAL_TEMPLATE_LINE_CONSTANTS.MIN_SORT_ORDER ||
            value > JOURNAL_TEMPLATE_LINE_CONSTANTS.MAX_SORT_ORDER
        ) {
            throw new Error(
                `Sort order must be between ${JOURNAL_TEMPLATE_LINE_CONSTANTS.MIN_SORT_ORDER} and ${JOURNAL_TEMPLATE_LINE_CONSTANTS.MAX_SORT_ORDER}`,
            );
        }
        this._value = value;
    }

    static create(value: number): SortOrder {
        return new SortOrder(value);
    }

    static default(): SortOrder {
        return new SortOrder(JOURNAL_TEMPLATE_LINE_CONSTANTS.DEFAULT_SORT_ORDER);
    }

    get value(): number {
        return this._value;
    }

    increment(): SortOrder {
        return new SortOrder(this._value + 1);
    }

    decrement(): SortOrder {
        return new SortOrder(Math.max(0, this._value - 1));
    }

    equals(other: SortOrder): boolean {
        return this._value === other._value;
    }

    toString(): string {
        return this._value.toString();
    }
}