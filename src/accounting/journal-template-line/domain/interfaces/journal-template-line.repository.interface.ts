import { JournalTemplateLineEntity } from '../entities/journal-template-line.entity';


export interface JournalTemplateLineRepository {


    save(
        entity: JournalTemplateLineEntity,
    ): Promise<void>;



    findById(
        id: string,
    ): Promise<JournalTemplateLineEntity | null>;



    findAll(
        templateId: string | undefined,
    ): Promise<JournalTemplateLineEntity[]>;



    update(
        entity: JournalTemplateLineEntity,
    ): Promise<void>;



    delete(
        id: string,
    ): Promise<void>;



    exists(
        id: string,
    ): Promise<boolean>;

}