import { Controller } from '@nestjs/common';
import { JournalLinesService } from './journal-lines.service';

@Controller('journal-lines')
export class JournalLinesController {
  constructor(private readonly journalLinesService: JournalLinesService) {}
}
