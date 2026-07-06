import { Formula } from '../../domain/value-objects/formula.value-object';
import { FORMULA_CONSTANTS } from '../constants/formula.constants';

export class FormulaHelper {
    static isValidFormulaLength(formula: string): boolean {
        return formula.length <= FORMULA_CONSTANTS.MAX_FORMULA_LENGTH;
    }

    static extractVariableNames(formula: Formula): string[] {
        return formula
            .getVariableNames()
            .map(name => name.replace(/^\$/, ''));
    }

    static hasVariable(formula: Formula, variableName: string): boolean {
        const fullName = variableName.startsWith('$')
            ? variableName
            : `$${variableName}`;
        return formula.hasVariable(fullName);
    }

    static getVariableCount(formula: Formula): number {
        return formula.variables.length;
    }

    static isComplexFormula(formula: Formula): boolean {
        const expression = formula.expression;
        const operators = expression.match(/[+\-*/%^]/g) || [];
        const functions =
            (expression.match(/[A-Z]+\(/g) || []).length +
            (expression.match(/\(/g) || []).length;

        return operators.length + functions > 3;
    }

    static sanitizeFormula(formula: string): string {
        return formula
            .trim()
            .replace(/\s+/g, ' ')
            .toUpperCase();
    }

    static validateFormulaVariableFormat(variable: string): boolean {
        const pattern = FORMULA_CONSTANTS.FORMULA_PATTERN;
        return pattern.test(variable);
    }
}