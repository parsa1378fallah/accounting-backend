import { Injectable, Logger } from '@nestjs/common';
import { JournalTemplateLine } from '../../domain/entities/journal-template-line.entity';
import { TemplateAmountType } from '../../common/enums/template-amount-type.enum';
import { InvalidAmountTypeException } from '../../common/exceptions/invalid-amount-type.exception';
import { JOURNAL_TEMPLATE_LINE_CONSTANTS } from '../../common/constants/journal-template-line.constants';

export interface ValidationError {
    field: string;
    message: string;
    code: string;
}

@Injectable()
export class JournalTemplateLineValidatorService {
    private readonly logger = new Logger(JournalTemplateLineValidatorService.name);

    validate(line: JournalTemplateLine): ValidationError[] {
        const errors: ValidationError[] = [];

        // بررسی حساب
        if (!line.getAccountId()) {
            errors.push({
                field: 'accountId',
                message: 'Account ID is required',
                code: 'ACCOUNT_ID_REQUIRED',
            });
        }

        // بررسی نوع مبلغ
        const amountType = line.getAmountType();

        if (amountType.isFixed()) {
            const amount = line.getAmount();
            if (!amount) {
                errors.push({
                    field: 'amount',
                    message: 'Amount is required for FIXED type',
                    code: 'AMOUNT_REQUIRED',
                });
            }
        } else if (amountType.isPercentage()) {
            const percentage = line.getPercentage();
            if (!percentage) {
                errors.push({
                    field: 'percentage',
                    message: 'Percentage is required for PERCENTAGE type',
                    code: 'PERCENTAGE_REQUIRED',
                });
            } else if (
                percentage.lessThan(0) ||
                percentage.greaterThan(100)
            ) {
                errors.push({
                    field: 'percentage',
                    message: 'Percentage must be between 0 and 100',
                    code: 'INVALID_PERCENTAGE_RANGE',
                });
            }
        } else if (amountType.isFormula()) {
            const formula = line.getFormula();
            if (!formula) {
                errors.push({
                    field: 'formula',
                    message: 'Formula is required for FORMULA type',
                    code: 'FORMULA_REQUIRED',
                });
            }
        }

        // بررسی شرح
        if (
            line.getDescription() &&
            line.getDescription()!.length >
            JOURNAL_TEMPLATE_LINE_CONSTANTS.MAX_DESCRIPTION_LENGTH
        ) {
            errors.push({
                field: 'description',
                message: `Description must not exceed ${JOURNAL_TEMPLATE_LINE_CONSTANTS.MAX_DESCRIPTION_LENGTH} characters`,
                code: 'DESCRIPTION_TOO_LONG',
            });
        }

        this.logger.debug(`Validation completed with ${errors.length} errors`);

        return errors;
    }

    isValid(line: JournalTemplateLine): boolean {
        return this.validate(line).length === 0;
    }

    throwIfInvalid(line: JournalTemplateLine): void {
        const errors = this.validate(line);
        if (errors.length > 0) {
            const errorMessages = errors
                .map(e => `${e.field}: ${e.message}`)
                .join('; ');
            throw new Error(`Validation failed: ${errorMessages}`);
        }
    }
}