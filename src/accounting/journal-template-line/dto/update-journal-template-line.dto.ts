import { PartialType } from '@nestjs/swagger';

import { CreateJournalTemplateLineDto }
    from './create-journal-template-line.dto';


export class UpdateJournalTemplateLineDto
    extends PartialType(
        CreateJournalTemplateLineDto
    ) { }