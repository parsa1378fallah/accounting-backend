import { Injectable, Logger } from '@nestjs/common';
import { ExpressionParserService } from '../calculations/expression-parser.service';
import { InvalidFormulaException, MissingFormulaVariablesException } from '../../common/exceptions/formula-validation.exception';
import { FORMULA_CONSTANTS } from '../../common/constants/formula.constants';

@Injectable()
export class FormulaSyntaxValidatorService {
    private readonly logger = new Logger(FormulaSyntaxValidatorService.name);

    constructor(
        private readonly parser: ExpressionParserService,
    ) { }

    validateSyntax(formula: string): { valid: boolean; errors: string[] } {
        this.logger.debug(`Validating formula syntax: ${formula}`);

        const errors: string[] = [];

        // بررسی طول
        if (formula.length > FORMULA_CONSTANTS.MAX_FORMULA_LENGTH) {
            errors.push(
                `Formula length exceeds maximum of ${FORMULA_CONSTANTS.MAX_FORMULA_LENGTH} characters`,
            );
        }

        // بررسی توازن پرانتز
        if (!this.hasBalancedParentheses(formula)) {
            errors.push('Parentheses are not balanced');
        }

        // تجزیه
        try {
            this.parser.parse(formula);
        } catch (error) {
            errors.push(`Parse error: ${error.message}`);
        }

        return {
            valid: errors.length === 0,
            errors,
        };
    }

    validateVariables(
        formula: string,
        availableVariables: string[],
    ): { valid: boolean; missingVariables: string[] } {
        this.logger.debug(`Validating formula variables: ${formula}`);

        const missingVariables: string[] = [];

        const requiredVars = this.parser.extractVariables(formula);

        requiredVars.forEach(varName => {
            if (!availableVariables.includes(varName)) {
                missingVariables.push(varName);
            }
        });

        return {
            valid: missingVariables.length === 0,
            missingVariables,
        };
    }

    private hasBalancedParentheses(formula: string): boolean {
        let count = 0;

        for (const char of formula) {
            if (char === '(') {
                count++;
            } else if (char === ')') {
                count--;
            }

            if (count < 0) {
                return false;
            }
        }

        return count === 0;
    }
}