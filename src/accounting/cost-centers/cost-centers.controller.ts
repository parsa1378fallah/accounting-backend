import { Controller } from '@nestjs/common';
import { CostCentersService } from './cost-centers.service';

@Controller('cost-centers')
export class CostCentersController {
  constructor(private readonly costCentersService: CostCentersService) {}
}
