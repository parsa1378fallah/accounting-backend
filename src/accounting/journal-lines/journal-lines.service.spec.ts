import { Test, TestingModule } from '@nestjs/testing';
import { JournalLinesService } from './journal-lines.service';

describe('JournalLinesService', () => {
  let service: JournalLinesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JournalLinesService],
    }).compile();

    service = module.get<JournalLinesService>(JournalLinesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
