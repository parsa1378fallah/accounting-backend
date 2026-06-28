import { Test, TestingModule } from '@nestjs/testing';
import { FxGainLossService } from './services/fx-gain-loss.service';

describe('FxGainLossService', () => {
  let service: FxGainLossService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FxGainLossService],
    }).compile();

    service = module.get<FxGainLossService>(FxGainLossService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
