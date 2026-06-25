import { Controller } from '@nestjs/common';
import { CashboxesService } from './cashboxes.service';

@Controller('cashboxes')
export class CashboxesController {
  constructor(private readonly cashboxesService: CashboxesService) {}
}
