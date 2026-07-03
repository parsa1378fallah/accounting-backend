import { Decimal } from '@prisma/client/runtime/library';

export class DecimalMapper {
    static toString(
        value?: Decimal | number | string | null,
        scale = 4,
    ): string {
        if (value === null || value === undefined) {
            return '0.0000';
        }

        if (value instanceof Decimal) {
            return value.toFixed(scale);
        }

        if (typeof value === 'number') {
            return value.toFixed(scale);
        }

        return new Decimal(value).toFixed(scale);
    }

    static toNumber(
        value?: Decimal | number | string | null,
    ): number {
        if (value === null || value === undefined) {
            return 0;
        }

        return Number(value);
    }

    static isZero(
        value?: Decimal | number | string | null,
    ): boolean {
        return this.toNumber(value) === 0;
    }
}