import { Controller } from '@nestjs/common';
import { FiscalYearClosingService } from './fiscal-year-closing.service';

@Controller('fiscal-year-closing')
export class FiscalYearClosingController {
  constructor(private readonly fiscalYearClosingService: FiscalYearClosingService) {}
}
