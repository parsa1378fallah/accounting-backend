import { Controller } from '@nestjs/common';
import { JournalTemplateLineService } from './journal-template-line.service';

@Controller('journal-template-line')
export class JournalTemplateLineController {
  constructor(private readonly journalTemplateLineService: JournalTemplateLineService) {}
}
