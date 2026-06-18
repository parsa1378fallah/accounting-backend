import { Test, TestingModule } from '@nestjs/testing';
import { FiscalYearController } from './fiscal-year.controller';

describe('FiscalYearController', () => {
  let controller: FiscalYearController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FiscalYearController],
    }).compile();

    controller = module.get<FiscalYearController>(FiscalYearController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
