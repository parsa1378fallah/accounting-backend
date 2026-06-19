import {
  MiddlewareConsumer
  , Module
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './rbac/roles/roles.module';
import { RolePermissionsModule } from './rbac/role-permissions/role-permissions.module';
import { PermissionsModule } from './rbac/permissions/permissions.module';
import { UserRolesModule } from './rbac/user-roles/user-roles.module';
import { CustomersModule } from './customers/customers.module';
import { VendorsModule } from './vendors/vendors.module';
import { InvoicesModule } from './invoices/invoices.module';
import { PaymentsModule } from './payments/payments.module';
import { AccountsModule } from './accounts/accounts.module';
import { JournalModule } from './journal/journal.module';
import { ReportsModule } from './reports/reports.module';
import { SettingsModule } from './settings/settings.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PrismaModule } from './prisma/prisma.module';
import { OrganizationMiddleware } from './common/middleware/organization.middleware';
import { OrganizationsModule } from './organizations/organizations.module';
import { BranchesModule } from './branches/branches.module';
import { FiscalYearModule } from './fiscal-year/fiscal-year.module';
import { FiscalPeriodModule } from './fiscal-period/fiscal-period.module';
import { NumberSequenceModule } from './number-sequence/number-sequence.module';


@Module({
  imports: [
    AuthModule
    , RolesModule
    , UserRolesModule
    , PermissionsModule
    , RolePermissionsModule
    , UsersModule
    , CustomersModule
    , VendorsModule
    , InvoicesModule
    , PaymentsModule
    , AccountsModule
    , JournalModule
    , ReportsModule
    , SettingsModule
    , NotificationsModule
    , PrismaModule
    , OrganizationsModule
    , BranchesModule
    , FiscalYearModule
    , FiscalPeriodModule, NumberSequenceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(OrganizationMiddleware)
      .forRoutes('*')
  }
}
