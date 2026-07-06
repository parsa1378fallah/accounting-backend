import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';
import { TemplateAmountType } from '../enums/template-amount-type.enum';
import { Decimal } from 'decimal.js';

export const ValidateAmounts = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const { amountType, amount, percentage, formula } = request.body;

        if (!amountType) {
            throw new BadRequestException('amountType is required');
        }

        if (amountType === TemplateAmountType.FIXED) {
            if (!amount) {
                throw new BadRequestException(
                    'amount is required for FIXED amountType',
                );
            }

            try {
                new Decimal(amount);
            } catch {
                throw new BadRequestException('amount must be a valid decimal');
            }
        }

        if (amountType === TemplateAmountType.PERCENT) {
            if (!percentage) {
                throw new BadRequestException(
                    'percentage is required for PERCENTAGE amountType',
                );
            }

            try {
                const pct = new Decimal(percentage);
                if (pct.lessThan(0) || pct.greaterThan(100)) {
                    throw new BadRequestException(
                        'percentage must be between 0 and 100',
                    );
                }
            } catch {
                throw new BadRequestException('percentage must be a valid decimal');
            }
        }

        if (amountType === TemplateAmountType.FORMULA) {
            if (!formula) {
                throw new BadRequestException(
                    'formula is required for FORMULA amountType',
                );
            }
        }

        return request.body;
    },
);