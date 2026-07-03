import { Test, TestingModule } from '@nestjs/testing';
import { FiscalYearClosingService } from './fiscal-year-closing.service';

describe('FiscalYearClosingService', () => {
  let service: FiscalYearClosingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FiscalYearClosingService],
    }).compile();

    service = module.get<FiscalYearClosingService>(FiscalYearClosingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
