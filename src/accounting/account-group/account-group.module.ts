import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';

import { AccountGroupsController } from './account-group.controller';
import { AccountGroupsService } from './account-group.service';

@Module({
  imports: [PrismaModule],

  controllers: [AccountGroupsController],

  providers: [AccountGroupsService],

  exports: [AccountGroupsService],
})
export class AccountGroupModule { }