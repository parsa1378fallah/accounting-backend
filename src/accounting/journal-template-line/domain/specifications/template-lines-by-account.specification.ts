import { JournalTemplateLine } from '../entities/journal-template-line.entity';
import { Specification } from './journal-template-lines-by-template.specification';

export class TemplateLinesByAccountSpecification
    implements Specification<JournalTemplateLine> {
    constructor(private accountId: string) { }

    isSatisfiedBy(line: JournalTemplateLine): boolean {
        return line.getAccountId() === this.accountId;
    }
}