import { Test, TestingModule } from '@nestjs/testing';
import { NumberSequenceController } from './number-sequence.controller';
import { NumberSequenceService } from './number-sequence.service';

describe('NumberSequenceController', () => {
  let controller: NumberSequenceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NumberSequenceController],
      providers: [NumberSequenceService],
    }).compile();

    controller = module.get<NumberSequenceController>(NumberSequenceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
