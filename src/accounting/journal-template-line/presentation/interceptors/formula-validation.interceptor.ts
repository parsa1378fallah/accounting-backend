import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Formula } from '../../domain/value-objects/formula.value-object';
import { TemplateAmountType } from '../../common/enums/template-amount-type.enum';

@Injectable()
export class FormulaValidationInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const body = request.body;

        // بررسی فرمول اگر نوع FORMULA باشد
        if (
            body &&
            body.amountType === TemplateAmountType.FORMULA &&
            !body.formula
        ) {
            throw new BadRequestException(
                'Formula is required when amountType is FORMULA',
            );
        }

        // بررسی صحت فرمول
        if (body && body.formula) {
            try {
                Formula.create(body.formula);
            } catch (error) {
                throw new BadRequestException(
                    `Invalid formula syntax: ${error.message}`,
                );
            }
        }

        return next.handle();
    }
}