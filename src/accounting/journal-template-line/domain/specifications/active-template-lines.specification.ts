import { JournalTemplateLine } from '../entities/journal-template-line.entity';
import { Specification } from './journal-template-lines-by-template.specification';

export class ActiveTemplateLinesSpecification
    implements Specification<JournalTemplateLine> {
    isSatisfiedBy(line: JournalTemplateLine): boolean {
        return !line.isDeleted();
    }
}