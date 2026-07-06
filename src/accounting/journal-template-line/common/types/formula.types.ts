import { Decimal } from 'decimal.js';

export interface FormulaVariable {
    name: string;
    value: Decimal | number;
    type: 'number' | 'percentage' | 'currency';
}

export interface FormulaNode {
    type: 'operator' | 'operand' | 'function' | 'variable';
    value: string;
    left?: FormulaNode;
    right?: FormulaNode;
    args?: FormulaNode[];
}

export interface FormulaParseResult {
    valid: boolean;
    tree?: FormulaNode;
    variables: string[];
    errors: string[];
}

export interface FormulaEvaluationResult {
    success: boolean;
    value?: Decimal;
    error?: string;
    executionTime: number;
}