import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';

import { AccountCategoriesController } from './account-category.controller';
import { AccountCategoriesService } from './account-category.service';

@Module({
  imports: [PrismaModule],

  controllers: [
    AccountCategoriesController,
  ],

  providers: [
    AccountCategoriesService,
  ],

  exports: [
    AccountCategoriesService,
  ],
})
export class AccountCategoryModule { }