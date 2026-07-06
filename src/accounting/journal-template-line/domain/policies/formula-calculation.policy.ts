import { Decimal } from 'decimal.js';
import { Formula } from '../value-objects/formula.value-object';
import { CalculationContext } from '../entities/calculation-context.entity';
import { MissingFormulaVariablesException } from '../../common/exceptions/formula-validation.exception';

export class FormulaCalculationPolicy {
    validate(formula: Formula, context: CalculationContext): void {
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