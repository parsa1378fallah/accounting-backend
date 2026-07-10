import { TemplateAmountType } from '../enums/template-amount-type.enum';


export class AmountTypeValidator {


    static validate(
        amountType: TemplateAmountType,
        amount?: number | null,
        percentage?: number | null,
        formula?: Record<string, unknown> | null,
    ): void {


        switch (amountType) {


            case TemplateAmountType.FIXED:

                if (amount === null || amount === undefined) {
                    throw new Error(
                        'FIXED amount type requires amount',
                    );
                }

                break;



            case TemplateAmountType.PERCENT:

                if (
                    percentage === null ||
                    percentage === undefined
                ) {
                    throw new Error(
                        'PERCENT amount type requires percentage',
                    );
                }

                break;



            case TemplateAmountType.FORMULA:

                if (!formula) {
                    throw new Error(
                        'FORMULA amount type requires formula',
                    );
                }

                break;



            case TemplateAmountType.LAST_AMOUNT:

                if (amount !== null && amount !== undefined) {
                    throw new Error(
                        'LAST_AMOUNT cannot have fixed amount',
                    );
                }

                break;



            case TemplateAmountType.DYNAMIC:

                break;


            default:

                throw new Error(
                    'Unsupported amount type',
                );
        }
    }
}