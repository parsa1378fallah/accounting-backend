import { Test, TestingModule } from '@nestjs/testing';
import { FiscalYearClosingController } from './fiscal-year-closing.controller';
import { FiscalYearClosingService } from './fiscal-year-closing.service';

describe('FiscalYearClosingController', () => {
  let controller: FiscalYearClosingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FiscalYearClosingController],
      providers: [FiscalYearClosingService],
    }).compile();

    controller = module.get<FiscalYearClosingController>(FiscalYearClosingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
