import { Test, TestingModule } from '@nestjs/testing';
import { FiscalPeriodController } from './fiscal-period.controller';

describe('FiscalPeriodController', () => {
  let controller: FiscalPeriodController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FiscalPeriodController],
    }).compile();

    controller = module.get<FiscalPeriodController>(FiscalPeriodController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
