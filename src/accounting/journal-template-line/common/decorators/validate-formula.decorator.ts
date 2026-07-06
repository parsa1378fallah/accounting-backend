import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';
import { Formula } from '../../domain/value-objects/formula.value-object';

export const ValidateFormula = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const formula = request.body[data || 'formula'];

        if (!formula) {
            return null;
        }

        try {
            return Formula.create(formula);
        } catch (error) {
            throw new BadRequestException(`Invalid formula: ${error.message}`);
        }
    },
);