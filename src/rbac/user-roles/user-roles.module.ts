import { Module } from '@nestjs/common';
import { UserRolesController } from './user-roles.controller';
import { UserRolesService } from './user-roles.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserRolesController],
  providers: [UserRolesService, PrismaService]
})
export class UserRolesModule { }
