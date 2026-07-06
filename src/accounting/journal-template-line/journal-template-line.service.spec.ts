import { Test, TestingModule } from '@nestjs/testing';
import { JournalTemplateLineService } from './journal-template-line.service';

describe('JournalTemplateLineService', () => {
  let service: JournalTemplateLineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JournalTemplateLineService],
    }).compile();

    service = module.get<JournalTemplateLineService>(JournalTemplateLineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
