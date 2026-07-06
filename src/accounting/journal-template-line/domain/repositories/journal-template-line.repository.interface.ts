import { JournalTemplateLine } from '../entities/journal-template-line.entity';
import { TemplateLineId } from '../value-objects/template-line-id.value-object';

export interface JournalTemplateLineRepository {
    save(line: JournalTemplateLine): Promise<void>;

    getById(id: TemplateLineId): Promise<JournalTemplateLine | null>;

    findByTemplate(
        templateId: string,
        organizationId: string,
    ): Promise<JournalTemplateLine[]>;

    findByAccount(
        accountId: string,
        organizationId: string,
    ): Promise<JournalTemplateLine[]>;

    findByOrganization(organizationId: string): Promise<JournalTemplateLine[]>;

    delete(id: TemplateLineId): Promise<void>;

    deleteByTemplate(templateId: string): Promise<void>;

    count(templateId: string): Promise<number>;

    existsById(id: TemplateLineId): Promise<boolean>;
}