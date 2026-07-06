import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { Formula } from '../../domain/value-objects/formula.value-object';
import { InvalidFormulaException } from '../../common/exceptions/formula-validation.exception';

@Injectable()
export class FormulaParserPipe implements PipeTransform {
    transform(value: any) {
        if (!value) {
            return value;
        }

        if (value.formula && typeof value.formula === 'string') {
            try {
                // تجزیه و اعتبارسنجی فرمول
                const formula = Formula.create(value.formula);
                return {
                    ...value,
                    formula: formula.expression,
                    formulaVariables: formula.variables,
                };
            } catch (error) {
                throw new BadRequestException(
                    `Invalid formula: ${error.message}`,
                );
            }
        }

        return value;
    }
}