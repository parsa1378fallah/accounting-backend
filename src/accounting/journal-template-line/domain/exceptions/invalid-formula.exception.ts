import { JournalTemplateLineException } from './journal-template-line.exception';


export class InvalidFormulaException
    extends JournalTemplateLineException {


    constructor(
        message: string,
    ) {

        super(message);

        this.name =
            'InvalidFormulaException';
    }

}