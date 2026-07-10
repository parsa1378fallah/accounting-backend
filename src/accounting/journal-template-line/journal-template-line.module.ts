import { Module } from '@nestjs/common';





import { PrismaModule }
  from 'src/prisma/prisma.module';






import { JournalTemplateLineService } from './journal-template-line.service';
import { PrismaJournalTemplateLineRepository } from './infrastructure/prisma/journal-template-line.repository';
import { JournalTemplateLineController } from './journal-template-line.controller';

@Module({

  imports: [
    PrismaModule,
  ],


  controllers: [
    JournalTemplateLineController,
  ],


  providers: [

    JournalTemplateLineService,
    PrismaJournalTemplateLineRepository



  ],


  exports: [
    JournalTemplateLineService,
  ],

})
export class JournalTemplateLineModule { }

