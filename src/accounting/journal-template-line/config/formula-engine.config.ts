import { registerAs } from '@nestjs/config';

export default registerAs('formula-engine', () => ({
    // Parser
    parser: {
        maxNestingLevel: parseInt(process.env.FORMULA_MAX_NESTING || '10'),
        maxFormulaLength: parseInt(process.env.FORMULA_MAX_LENGTH || '1000'),
    },

    // Evaluator
    evaluator: {
        timeoutMs: parseInt(process.env.FORMULA_TIMEOUT || '5000'),
        maxCalculationTime: parseInt(process.env.FORMULA_MAX_CALC_TIME || '5000'),
    },

    // Functions
    functions: {
        allowed: [
            'SUM',
            'AVG',
            'MIN',
            'MAX',
            'ABS',
            'ROUND',
            'CEIL',
            'FLOOR',
        ],
    },

    // Operators
    operators: {
        allowed: ['+', '-', '*', '/', '%', '^'],
    },

    // Precision
    precision: {
        default: parseInt(process.env.FORMULA_PRECISION || '4'),
        currency: parseInt(process.env.FORMULA_CURRENCY_PRECISION || '2'),
    },

    // Validation
    validation: {
        validateSyntax: process.env.FORMULA_VALIDATE_SYNTAX !== 'false',
        validateVariables: process.env.FORMULA_VALIDATE_VARS !== 'false',
        validateFunctions: process.env.FORMULA_VALIDATE_FUNCS !== 'false',
    },
}));