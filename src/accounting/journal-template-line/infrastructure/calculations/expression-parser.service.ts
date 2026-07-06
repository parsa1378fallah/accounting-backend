import { Injectable, Logger } from '@nestjs/common';
import { FORMULA_CONSTANTS } from '../../common/constants/formula.constants';
import { InvalidFormulaException } from '../../common/exceptions/formula-validation.exception';

export interface ExpressionNode {
    type: 'BinaryExpression' | 'UnaryExpression' | 'CallExpression' | 'Literal' | 'Variable';
    operator?: string;
    left?: any;
    right?: any;
    argument?: any;
    value?: number | string;
    callee?: { name: string };
    arguments?: any[];
    name?: string;
}

@Injectable()
export class ExpressionParserService {
    private readonly logger = new Logger(ExpressionParserService.name);
    private tokenIndex = 0;
    private tokens: string[] = [];

    parse(expression: string): ExpressionNode {
        this.logger.debug(`Parsing expression: ${expression}`);

        try {
            // بررسی طول
            if (expression.length > FORMULA_CONSTANTS.MAX_FORMULA_LENGTH) {
                throw new InvalidFormulaException(
                    expression,
                    'Formula too long',
                );
            }

            // Tokenization
            this.tokens = this.tokenize(expression);
            this.tokenIndex = 0;

            const ast = this.parseExpression();

            if (this.tokenIndex < this.tokens.length) {
                throw new InvalidFormulaException(
                    expression,
                    'Unexpected tokens after expression',
                );
            }

            return ast;
        } catch (error) {
            this.logger.error(`Parse failed: ${error.message}`);
            throw error;
        }
    }

    private tokenize(expression: string): string[] {
        const tokens: string[] = [];
        let current = 0;

        while (current < expression.length) {
            const char = expression[current];

            // Whitespace
            if (/\s/.test(char)) {
                current++;
                continue;
            }

            // Numbers
            if (/\d/.test(char)) {
                let value = '';
                while (current < expression.length && /[\d.]/.test(expression[current])) {
                    value += expression[current];
                    current++;
                }
                tokens.push(value);
                continue;
            }

            // Variables ($name)
            if (char === '$') {
                let value = '';
                while (
                    current < expression.length &&
                    /[a-zA-Z0-9_$]/.test(expression[current])
                ) {
                    value += expression[current];
                    current++;
                }
                if (value === '$') {
                    throw new InvalidFormulaException(expression, 'Invalid variable name');
                }
                tokens.push(value);
                continue;
            }

            // Functions
            if (/[a-zA-Z_]/.test(char)) {
                let value = '';
                while (
                    current < expression.length &&
                    /[a-zA-Z0-9_]/.test(expression[current])
                ) {
                    value += expression[current];
                    current++;
                }
                tokens.push(value);
                continue;
            }

            // Operators & Parentheses
            if (FORMULA_CONSTANTS.ALLOWED_OPERATORS.includes(char)) {
                tokens.push(char);
                current++;
                continue;
            }

            throw new InvalidFormulaException(
                expression,
                `Unexpected character: ${char}`,
            );
        }

        return tokens;
    }

    private parseExpression(): ExpressionNode {
        return this.parseAdditive();
    }

    private parseAdditive(): ExpressionNode {
        let left = this.parseMultiplicative();

        while (
            this.tokenIndex < this.tokens.length &&
            ['+', '-'].includes(this.tokens[this.tokenIndex])
        ) {
            const operator = this.tokens[this.tokenIndex++];
            const right = this.parseMultiplicative();
            left = {
                type: 'BinaryExpression',
                operator,
                left,
                right,
            };
        }

        return left;
    }

    private parseMultiplicative(): ExpressionNode {
        let left = this.parsePower();

        while (
            this.tokenIndex < this.tokens.length &&
            ['*', '/', '%'].includes(this.tokens[this.tokenIndex])
        ) {
            const operator = this.tokens[this.tokenIndex++];
            const right = this.parsePower();
            left = {
                type: 'BinaryExpression',
                operator,
                left,
                right,
            };
        }

        return left;
    }

    private parsePower(): ExpressionNode {
        let left = this.parseUnary();

        if (
            this.tokenIndex < this.tokens.length &&
            this.tokens[this.tokenIndex] === '^'
        ) {
            this.tokenIndex++;
            const right = this.parseUnary();
            return {
                type: 'BinaryExpression',
                operator: '^',
                left,
                right,
            };
        }

        return left;
    }

    private parseUnary(): ExpressionNode {
        if (
            this.tokenIndex < this.tokens.length &&
            ['+', '-'].includes(this.tokens[this.tokenIndex])
        ) {
            const operator = this.tokens[this.tokenIndex++];
            const argument = this.parseUnary();
            return {
                type: 'UnaryExpression',
                operator,
                argument,
            };
        }

        return this.parsePrimary();
    }

    private parsePrimary(): ExpressionNode {
        const token = this.tokens[this.tokenIndex];

        if (!token) {
            throw new InvalidFormulaException(
                this.tokens.join(' '),
                'Unexpected end of expression',
            );
        }

        // Parentheses
        if (token === '(') {
            this.tokenIndex++;
            const expr = this.parseExpression();
            if (this.tokens[this.tokenIndex] !== ')') {
                throw new InvalidFormulaException(
                    this.tokens.join(' '),
                    'Missing closing parenthesis',
                );
            }
            this.tokenIndex++;
            return expr;
        }

        // Numbers
        if (/^\d+\.?\d*$/.test(token)) {
            this.tokenIndex++;
            return {
                type: 'Literal',
                value: parseFloat(token),
            };
        }

        // Variables
        if (token.startsWith('$')) {
            this.tokenIndex++;
            return {
                type: 'Variable',
                name: token,
            };
        }

        // Functions
        if (/^[a-zA-Z_]/.test(token)) {
            const functionName = token;
            this.tokenIndex++;

            if (this.tokens[this.tokenIndex] !== '(') {
                throw new InvalidFormulaException(
                    this.tokens.join(' '),
                    `Expected ( after function name ${functionName}`,
                );
            }

            this.tokenIndex++; // skip (

            const args: ExpressionNode[] = [];

            if (this.tokens[this.tokenIndex] !== ')') {
                args.push(this.parseExpression());

                while (this.tokens[this.tokenIndex] === ',') {
                    this.tokenIndex++; // skip ,
                    args.push(this.parseExpression());
                }
            }

            if (this.tokens[this.tokenIndex] !== ')') {
                throw new InvalidFormulaException(
                    this.tokens.join(' '),
                    'Missing closing parenthesis in function call',
                );
            }

            this.tokenIndex++; // skip )

            return {
                type: 'CallExpression',
                callee: { name: functionName },
                arguments: args,
            };
        }

        throw new InvalidFormulaException(
            this.tokens.join(' '),
            `Unexpected token: ${token}`,
        );
    }

    extractVariables(expression: string): Set<string> {
        const variables = new Set<string>();
        const tokens = this.tokenize(expression);

        tokens.forEach(token => {
            if (token.startsWith('$')) {
                variables.add(token);
            }
        });

        return variables;
    }
}