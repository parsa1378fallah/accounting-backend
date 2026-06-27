import { Test, TestingModule } from '@nestjs/testing';
import { FxGainLossController } from './fx-gain-loss.controller';
import { FxGainLossService } from './fx-gain-loss.service';

describe('FxGainLossController', () => {
  let controller: FxGainLossController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FxGainLossController],
      providers: [FxGainLossService],
    }).compile();

    controller = module.get<FxGainLossController>(FxGainLossController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
