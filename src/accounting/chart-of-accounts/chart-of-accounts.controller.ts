import { Controller } from '@nestjs/common';
import { ChartOfAccountsService } from './chart-of-accounts.service';

@Controller('chart-of-accounts')
export class ChartOfAccountsController {
  constructor(private readonly chartOfAccountsService: ChartOfAccountsService) {}
}
