import { Controller } from '@nestjs/common';
import { JournalTemplateService } from './journal-template.service';

@Controller('journal-template')
export class JournalTemplateController {
  constructor(private readonly journalTemplateService: JournalTemplateService) {}
}
