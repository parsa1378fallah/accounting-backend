import { Decimal } from 'decimal.js';
import { InvalidFormulaException } from '../../common/exceptions/formula-validation.exception';
import { FormulaNode, FormulaVariable } from '../../common/types/formula.types';

export class Formula {
    private readonly _expression: string;
    private readonly _variables: Set<string>;
    private _parsedTree?: FormulaNode;

    private constructor(expression: string, variables: Set<string>) {
        if (!expression || expression.trim().length === 0) {
            throw new InvalidFormulaException(expression, 'Formula cannot be empty');
        }
        this._expression = expression;
        this._variables = variables;
    }

    static create(expression: string): Formula {
        // ساده‌ترین تجزیه‌کننده
        const variables = new Set<string>();
        const varPattern = /\$[a-zA-Z_][a-zA-Z0-9_]*/g;
        const matches = expression.match(varPattern);

        if (matches) {
            matches.forEach(match => variables.add(match));
        }

        return new Formula(expression, variables);
    }

    get expression(): string {
        return this._expression;
    }

    get variables(): string[] {
        return Array.from(this._variables);
    }

    hasVariable(varName: string): boolean {
        return this._variables.has(varName);
    }

    getVariableNames(): string[] {
        return this.variables.map(v => v.substring(1)); // بدون $
    }

    equals(other: Formula): boolean {
        return this._expression === other._expression;
    }

    toString(): string {
        return this._expression;
    }

    toJSON() {
        return {
            expression: this._expression,
            variables: this.variables,
        };
    }
}