import { JournalTemplateLine } from '../entities/journal-template-line.entity';
import { Specification } from './journal-template-lines-by-template.specification';

export class TemplateLinesByOrganizationSpecification
    implements Specification<JournalTemplateLine> {
    constructor(private organizationId: string) { }

    isSatisfiedBy(line: JournalTemplateLine): boolean {
        return line.getOrganizationId() === this.organizationId;
    }
}