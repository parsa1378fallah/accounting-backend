export class JournalTemplateLineException extends Error {

    constructor(
        message: string,
    ) {
        super(message);

        this.name = 'JournalTemplateLineException';
    }

}