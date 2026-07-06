export const FORMULA_CONSTANTS = {
    MAX_FORMULA_LENGTH: 1000,
    MAX_NESTING_LEVEL: 10,
    ALLOWED_FUNCTIONS: ['SUM', 'AVG', 'MIN', 'MAX', 'ABS', 'ROUND'],
    ALLOWED_OPERATORS: ['+', '-', '*', '/', '%', '(', ')'],
    FORMULA_VARIABLE_PREFIX: '$',
    FORMULA_PATTERN: /^\$[a-zA-Z_][a-zA-Z0-9_]*$/,
};