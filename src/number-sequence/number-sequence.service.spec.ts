import { Test, TestingModule } from '@nestjs/testing';
import { NumberSequenceService } from './number-sequence.service';

describe('NumberSequenceService', () => {
  let service: NumberSequenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NumberSequenceService],
    }).compile();

    service = module.get<NumberSequenceService>(NumberSequenceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
