import { Module } from '@nestjs/common';
import { SystemAccountService } from './system-account.service';
import { SystemAccountController } from './system-account.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SystemAccountController],
  providers: [SystemAccountService],
})
export class SystemAccountModule { }
