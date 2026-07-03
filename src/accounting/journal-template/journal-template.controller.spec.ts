import { Test, TestingModule } from '@nestjs/testing';
import { JournalTemplateController } from './journal-template.controller';
import { JournalTemplateService } from './journal-template.service';

describe('JournalTemplateController', () => {
  let controller: JournalTemplateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JournalTemplateController],
      providers: [JournalTemplateService],
    }).compile();

    controller = module.get<JournalTemplateController>(JournalTemplateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
