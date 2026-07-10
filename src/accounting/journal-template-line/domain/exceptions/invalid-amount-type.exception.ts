import { JournalTemplateLineException } from './journal-template-line.exception';


export class InvalidAmountTypeException
    extends JournalTemplateLineException {


    constructor(
        message: string,
    ) {

        super(message);

        this.name =
            'InvalidAmountTypeException';
    }

}