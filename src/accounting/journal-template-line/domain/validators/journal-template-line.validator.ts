import { AmountTypeValidator } from './amount-type.validator';
import { FormulaValidator } from './formula.validator';
import { JournalTemplateLineProps } from '../entities/journal-template-line.entity';


export class JournalTemplateLineValidator {


    static validate(
        props: JournalTemplateLineProps,
    ): void {


        if (!props.organizationId) {
            throw new Error(
                'Organization required',
            );
        }


        if (!props.templateId) {
            throw new Error(
                'Template required',
            );
        }


        if (!props.accountId) {
            throw new Error(
                'Account required',
            );
        }



        if (props.sortOrder < 0) {
            throw new Error(
                'Invalid sort order',
            );
        }



        AmountTypeValidator.validate(
            props.amountType,
            props.amount,
            props.percentage,
            props.formula,
        );



        if (
            props.amountType === 'FORMULA'
        ) {
            FormulaValidator.validate(
                props.formula,
            );
        }

    }

}