import { Test, TestingModule } from '@nestjs/testing';
import { FiscalPeriodService } from './fiscal-period.service';

describe('FiscalPeriodService', () => {
  let service: FiscalPeriodService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FiscalPeriodService],
    }).compile();

    service = module.get<FiscalPeriodService>(FiscalPeriodService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
