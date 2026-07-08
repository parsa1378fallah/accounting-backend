import { JournalModule } from './accounting/journal/journal.module';
import { LoggingInterceptor } from './common/interceptor/logging.interceptor';
import { RequestContextMiddleware } from './common/observability/middleware/request-context.middleware';
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
import { CurrencyModule } from './accounting/currency/currency.module';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { RequestContextModule } from './common/observability/request-context/request-context.module';
import { ObservabilityModule } from './common/observability/observability.module';
import { ExchangeRatesModule } from './accounting/exchange-rates/exchange-rates.module';
import { ChartOfAccountsModule } from './accounting/chart-of-accounts/chart-of-accounts.module';

import { BankAccountsModule } from './accounting/bank-accounts/bank-accounts.module';
import { CashboxesModule } from './accounting/cashboxes/cashboxes.module';
import { AccountsModule } from './accounting/accounts/accounts.module';
import { AccountGroupModule } from './accounting/account-group/account-group.module';
import { AccountCategoryModule } from './accounting/account-category/account-category.module';
import { SystemAccountModule } from './accounting/system-account/system-account.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { FxGainLossModule } from './accounting/fx-gain-loss/fx-gain-loss.module';
import { CostCenterModule } from './accounting/cost-center/cost-center.module';
import { ProjectModule } from './accounting/project/project.module';
import { AttachmentModule } from './attachment/attachment.module';
import { InvoiceAttachmentModule } from './accounting/invoice-attachment/invoice-attachment.module';
import { FiscalYearClosingModule } from './accounting/fiscal-year-closing/fiscal-year-closing.module';
import { JournalTemplateModule } from './accounting/journal-template/journal-template.module';



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
    , ReportsModule
    , SettingsModule
    , NotificationsModule
    , PrismaModule
    , OrganizationsModule
    , BranchesModule
    , FiscalYearModule
    , FiscalPeriodModule
    , NumberSequenceModule
    , CurrencyModule
    , RequestContextModule
    , ObservabilityModule
    , ExchangeRatesModule
    , ChartOfAccountsModule
    , BankAccountsModule
    , CashboxesModule
    , AccountsModule
    , AccountGroupModule
    , AccountCategoryModule
    , SystemAccountModule
    , JournalModule,
    EventEmitterModule.forRoot(),
    FxGainLossModule,
    CostCenterModule,
    ProjectModule,
    AttachmentModule,
    InvoiceAttachmentModule,
    FiscalYearClosingModule,
    JournalTemplateModule],
  controllers: [AppController],
  providers: [AppService
    , LoggingInterceptor],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(OrganizationMiddleware, RequestIdMiddleware, RequestContextMiddleware)
      .forRoutes('*')
  }
}
