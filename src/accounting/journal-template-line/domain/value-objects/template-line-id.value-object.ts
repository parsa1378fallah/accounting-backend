const { v4: uuid } = require('uuid');

export class TemplateLineId {
    private readonly _value: string;

    private constructor(value: string) {
        if (!value || typeof value !== 'string') {
            throw new Error('TemplateLineId must be a non-empty string');
        }
        this._value = value;
    }

    static create(value?: string): TemplateLineId {
        return new TemplateLineId(value || uuid());
    }

    static of(value: string): TemplateLineId {
        return new TemplateLineId(value);
    }

    get value(): string {
        return this._value;
    }

    equals(other: TemplateLineId): boolean {
        return this._value === other._value;
    }

    toString(): string {
        return this._value;
    }
}