export class FormulaValidationException extends Error {
    constructor(
        public readonly errors: string[],
        public readonly formula: string,
    ) {
        super(`Formula validation failed: ${errors.join(', ')}`);
    }
}

export class InvalidFormulaException extends Error {
    constructor(formula: string, reason: string) {
        super(`Invalid formula: ${formula}. Reason: ${reason}`);
    }
}

export class MissingFormulaVariablesException extends Error {
    constructor(missingVars: string[]) {
        super(`Missing formula variables: ${missingVars.join(', ')}`);
    }
}