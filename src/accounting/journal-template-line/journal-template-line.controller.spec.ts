import { Test, TestingModule } from '@nestjs/testing';
import { JournalTemplateLineController } from './journal-template-line.controller';
import { JournalTemplateLineService } from './journal-template-line.service';

describe('JournalTemplateLineController', () => {
  let controller: JournalTemplateLineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JournalTemplateLineController],
      providers: [JournalTemplateLineService],
    }).compile();

    controller = module.get<JournalTemplateLineController>(JournalTemplateLineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
