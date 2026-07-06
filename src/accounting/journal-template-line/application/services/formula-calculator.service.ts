import { Injectable, Logger } from '@nestjs/common';
import { Decimal } from 'decimal.js';
import { Formula } from '../../domain/value-objects/formula.value-object';
import { CalculationContext } from '../../domain/entities/calculation-context.entity';
import { FormulaEvaluatorService } from '../../infrastructure/calculations/formula-evaluator.service';
import { ExpressionParserService } from '../../infrastructure/calculations/expression-parser.service';
import { CalculationErrorException, CalculationTimeoutException } from '../../common/exceptions/calculation-error.exception';
import { CALCULATION_CONSTANTS } from '../../common/constants/calculation.constants';
import { MissingFormulaVariablesException } from '../../common/exceptions/formula-validation.exception';

@Injectable()
export class FormulaCalculatorService {
    private readonly logger = new Logger(FormulaCalculatorService.name);

    constructor(
        private readonly evaluator: FormulaEvaluatorService,
        private readonly parser: ExpressionParserService,
    ) { }

    async calculate(
        formula: Formula,
        context: CalculationContext,
    ): Promise<Decimal> {
        const startTime = Date.now();

        try {
            this.logger.debug(
                `Calculating formula: ${formula.expression} with context`,
            );

            // بررسی متغیرهای مورد نیاز
            this.validateVariables(formula, context);

            // تجزیه و تقیم
            const result = await this.evaluator.evaluate(
                formula.expression,
                context.variables,
            );

            const executionTime = Date.now() - startTime;

            if (executionTime > CALCULATION_CONSTANTS.MAX_CALCULATION_TIME_MS) {
                throw new CalculationTimeoutException(
                    CALCULATION_CONSTANTS.MAX_CALCULATION_TIME_MS,
                );
            }

            this.logger.debug(
                `Formula calculated successfully: ${result} (${executionTime}ms)`,
            );

            return new Decimal(result);
        } catch (error) {
            this.logger.error(
                `Formula calculation failed: ${error.message}`,
                error.stack,
            );

            if (error instanceof CalculationTimeoutException) {
                throw error;
            }

            throw new CalculationErrorException(
                error.message,
                formula.expression,
                context.variables,
            );
        }
    }

    private validateVariables(
        formula: Formula,
        context: CalculationContext,
    ): void {
        const requiredVars = formula.getVariableNames();
        const providedVars = Object.keys(context.variables);

        const missing = requiredVars.filter(v => !providedVars.includes(v));

        if (missing.length > 0) {
            throw new MissingFormulaVariablesException(
                missing.map(v => `$${v}`),
            );
        }
    }
}