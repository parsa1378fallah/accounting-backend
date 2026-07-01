import { Module } from '@nestjs/common';
import { InvoiceAttachmentService } from './invoice-attachment.service';
import { InvoiceAttachmentController } from './invoice-attachment.controller';

@Module({
  controllers: [InvoiceAttachmentController],
  providers: [InvoiceAttachmentService],
})
export class InvoiceAttachmentModule {}
