import { Controller } from '@nestjs/common';
import { InvoiceAttachmentService } from './invoice-attachment.service';

@Controller('invoice-attachment')
export class InvoiceAttachmentController {
  constructor(private readonly invoiceAttachmentService: InvoiceAttachmentService) {}
}
