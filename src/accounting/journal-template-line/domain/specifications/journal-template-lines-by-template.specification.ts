import { JournalTemplateLine } from '../entities/journal-template-line.entity';

export interface Specification<T> {
    isSatisfiedBy(candidate: T): boolean;
}

export class JournalTemplateLinesByTemplateSpecification
    implements Specification<JournalTemplateLine> {
    constructor(private templateId: string) { }

    isSatisfiedBy(line: JournalTemplateLine): boolean {
        return line.getTemplateId() === this.templateId;
    }
}