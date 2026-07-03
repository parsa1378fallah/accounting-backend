import { Test, TestingModule } from '@nestjs/testing';
import { JournalTemplateService } from './journal-template.service';

describe('JournalTemplateService', () => {
  let service: JournalTemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JournalTemplateService],
    }).compile();

    service = module.get<JournalTemplateService>(JournalTemplateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
