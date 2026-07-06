import { Injectable, Logger } from '@nestjs/common';
import { Decimal } from 'decimal.js';
import { ExpressionParserService } from './expression-parser.service';
import { CalculationErrorException, CalculationTimeoutException } from '../../common/exceptions/calculation-error.exception';
import { CALCULATION_CONSTANTS } from '../../common/constants/calculation.constants';

@Injectable()
export class FormulaEvaluatorService {
    private readonly logger = new Logger(FormulaEvaluatorService.name);

    constructor(
        private readonly parser: ExpressionParserService,
    ) { }

    async evaluate(
        expression: string,
        variables: Record<string, Decimal | number>,
    ): Promise<Decimal> {
        const startTime = Date.now();

        try {
            this.logger.debug(`Evaluating expression: ${expression}`);

            // تجزیه expression
            const tree = this.parser.parse(expression);

            // ارزیابی
            const result = await this.evaluateTree(tree, variables);

            const executionTime = Date.now() - startTime;

            if (executionTime > CALCULATION_CONSTANTS.MAX_CALCULATION_TIME_MS) {
                throw new CalculationTimeoutException(
                    CALCULATION_CONSTANTS.MAX_CALCULATION_TIME_MS,
                );
            }

            this.logger.debug(
                `Expression evaluated: ${result} (${executionTime}ms)`,
            );

            return new Decimal(result);
        } catch (error) {
            this.logger.error(`Evaluation failed: ${error.message}`);

            if (error instanceof CalculationTimeoutException) {
                throw error;
            }

            throw new CalculationErrorException(error.message, expression, variables);
        }
    }

    private async evaluateTree(
        tree: any,
        variables: Record<string, Decimal | number>,
    ): Promise<string | number> {
        if (typeof tree === 'number') {
            return tree;
        }

        if (typeof tree === 'string') {
            // متغیر
            if (tree.startsWith('$')) {
                const value = variables[tree];
                if (value === undefined) {
                    throw new Error(`Undefined variable: ${tree}`);
                }
                return new Decimal(value).toNumber();
            }
            return tree;
        }

        if (tree.type === 'BinaryExpression') {
            const left = await this.evaluateTree(tree.left, variables);
            const right = await this.evaluateTree(tree.right, variables);

            return this.evaluateBinaryOperation(
                tree.operator,
                new Decimal(left),
                new Decimal(right),
            ).toNumber();
        }

        if (tree.type === 'UnaryExpression') {
            const arg = await this.evaluateTree(tree.argument, variables);
            return this.evaluateUnaryOperation(tree.operator, new Decimal(arg))
                .toNumber();
        }

        if (tree.type === 'CallExpression') {
            const args = await Promise.all(
                tree.arguments.map((arg: any) => this.evaluateTree(arg, variables)),
            );
            return this.evaluateFunction(tree.callee.name, args).toNumber();
        }

        throw new Error(`Unknown tree type: ${tree.type}`);
    }

    private evaluateBinaryOperation(
        operator: string,
        left: Decimal,
        right: Decimal,
    ): Decimal {
        switch (operator) {
            case '+':
                return left.plus(right);
            case '-':
                return left.minus(right);
            case '*':
                return left.times(right);
            case '/':
                if (right.isZero()) {
                    throw new Error('Division by zero');
                }
                return left.dividedBy(right);
            case '%':
                return left.mod(right);
            case '^':
                return left.pow(right);
            default:
                throw new Error(`Unknown operator: ${operator}`);
        }
    }

    private evaluateUnaryOperation(
        operator: string,
        operand: Decimal,
    ): Decimal {
        switch (operator) {
            case '-':
                return operand.negated();
            case '+':
                return operand;
            default:
                throw new Error(`Unknown unary operator: ${operator}`);
        }
    }

    private evaluateFunction(
        functionName: string,
        args: (string | number)[],
    ): Decimal {
        const decimalArgs = args.map(arg => new Decimal(arg));

        switch (functionName.toUpperCase()) {
            case 'ABS':
                return decimalArgs[0].abs();
            case 'ROUND':
                return decimalArgs[0].toDecimalPlaces(
                    decimalArgs[1]?.toNumber() || 0,
                );
            case 'CEIL':
                return decimalArgs[0].ceil();
            case 'FLOOR':
                return decimalArgs[0].floor();
            case 'MIN':
                return Decimal.min(...decimalArgs);
            case 'MAX':
                return Decimal.max(...decimalArgs);
            case 'SUM':
                return decimalArgs.reduce((sum, val) => sum.plus(val), new Decimal(0));
            case 'AVG':
                const sum = decimalArgs.reduce((s, val) => s.plus(val), new Decimal(0));
                return sum.dividedBy(decimalArgs.length);
            default:
                throw new Error(`Unknown function: ${functionName}`);
        }
    }
}