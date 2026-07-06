import { TemplateAmountType } from '../../common/enums/template-amount-type.enum';
import { InvalidAmountTypeException } from '../../common/exceptions/invalid-amount-type.exception';

export class AmountType {
    private readonly _value: TemplateAmountType;

    private constructor(value: TemplateAmountType) {
        this._value = value;
    }

    static create(value: string | TemplateAmountType): AmountType {
        const enumValue = Object.values(TemplateAmountType).find(
            v => v === value,
        );

        if (!enumValue) {
            throw new InvalidAmountTypeException(value as string);
        }

        return new AmountType(enumValue);
    }

    static fixed(): AmountType {
        return new AmountType(TemplateAmountType.FIXED);
    }

    static percentage(): AmountType {
        return new AmountType(TemplateAmountType.PERCENT);
    }

    static formula(): AmountType {
        return new AmountType(TemplateAmountType.FORMULA);
    }

    get value(): TemplateAmountType {
        return this._value;
    }

    isFixed(): boolean {
        return this._value === TemplateAmountType.FIXED;
    }

    isPercentage(): boolean {
        return this._value === TemplateAmountType.PERCENT;
    }

    isFormula(): boolean {
        return this._value === TemplateAmountType.FORMULA;
    }

    equals(other: AmountType): boolean {
        return this._value === other._value;
    }

    toString(): string {
        return this._value;
    }
}