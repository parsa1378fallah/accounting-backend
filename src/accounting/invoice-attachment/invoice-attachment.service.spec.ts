import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceAttachmentService } from './invoice-attachment.service';

describe('InvoiceAttachmentService', () => {
  let service: InvoiceAttachmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvoiceAttachmentService],
    }).compile();

    service = module.get<InvoiceAttachmentService>(InvoiceAttachmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
