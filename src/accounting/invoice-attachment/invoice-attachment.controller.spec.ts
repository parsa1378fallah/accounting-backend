import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceAttachmentController } from './invoice-attachment.controller';
import { InvoiceAttachmentService } from './invoice-attachment.service';

describe('InvoiceAttachmentController', () => {
  let controller: InvoiceAttachmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceAttachmentController],
      providers: [InvoiceAttachmentService],
    }).compile();

    controller = module.get<InvoiceAttachmentController>(InvoiceAttachmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
