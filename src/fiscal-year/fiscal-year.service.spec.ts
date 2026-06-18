import { Test, TestingModule } from '@nestjs/testing';
import { FiscalYearService } from './fiscal-year.service';

describe('FiscalYearService', () => {
  let service: FiscalYearService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FiscalYearService],
    }).compile();

    service = module.get<FiscalYearService>(FiscalYearService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
