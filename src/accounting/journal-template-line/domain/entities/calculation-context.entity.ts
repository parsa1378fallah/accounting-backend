import { Decimal } from 'decimal.js';

export class CalculationContext {
    constructor(
        public readonly templateId: string,
        public readonly organizationId: string,
        public readonly variables: Record<string, Decimal | number> = {},
        public readonly currencyId?: string,
        public readonly currencyPrecision: number = 2,
        public readonly exchangeRate?: Decimal,
        public readonly calculationDate: Date = new Date(),
    ) { }

    getVariable(name: string): Decimal | number | undefined {
        return this.variables[name];
    }

    hasVariable(name: string): boolean {
        return name in this.variables;
    }

    setVariable(name: string, value: Decimal | number): CalculationContext {
        return new CalculationContext(
            this.templateId,
            this.organizationId,
            { ...this.variables, [name]: value },
            this.currencyId,
            this.currencyPrecision,
            this.exchangeRate,
            this.calculationDate,
        );
    }

    toJSON() {
        return {
            templateId: this.templateId,
            organizationId: this.organizationId,
            variables: this.variables,
            currencyId: this.currencyId,
            currencyPrecision: this.currencyPrecision,
            exchangeRate: this.exchangeRate?.toString(),
            calculationDate: this.calculationDate,
        };
    }
}