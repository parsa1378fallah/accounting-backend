export class JournalTemplateLineException extends Error {
    constructor(
        public readonly code: string,
        public readonly message: string,
        public readonly statusCode: number = 400,
        public readonly details?: any,
    ) {
        super(message);
    }
}

export class JournalTemplateLineNotFoundException extends JournalTemplateLineException {
    constructor(id: string) {
        super(
            'TEMPLATE_LINE_NOT_FOUND',
            `Journal template line with id ${id} not found`,
            404,
        );
    }
}

export class TemplateNotFoundException extends JournalTemplateLineException {
    constructor(templateId: string) {
        super(
            'TEMPLATE_NOT_FOUND',
            `Template with id ${templateId} not found`,
            404,
        );
    }
}