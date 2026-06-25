import { Test, TestingModule } from '@nestjs/testing';
import { JournalLinesController } from './journal-lines.controller';
import { JournalLinesService } from './journal-lines.service';

describe('JournalLinesController', () => {
  let controller: JournalLinesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JournalLinesController],
      providers: [JournalLinesService],
    }).compile();

    controller = module.get<JournalLinesController>(JournalLinesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
