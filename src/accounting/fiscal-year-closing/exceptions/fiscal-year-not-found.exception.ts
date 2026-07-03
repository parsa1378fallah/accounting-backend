import { NotFoundException } from '@nestjs/common';

export class FiscalYearNotFoundException extends NotFoundException {
  constructor(fiscalYearId: string) {
    super(`Fiscal year '${fiscalYearId}' was not found.`);
  }
}