import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { CustomersModule } from './customers/customers.module';
import { VendorsModule } from './vendors/vendors.module';
import { InvoicesModule } from './invoices/invoices.module';
import { PaymentsModule } from './payments/payments.module';
import { AccountsModule } from './accounts/accounts.module';
import { JournalModule } from './journal/journal.module';
import { ReportsModule } from './reports/reports.module';
import { SettingsModule } from './settings/settings.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [AuthModule, UsersModule, RolesModule, CustomersModule, VendorsModule, InvoicesModule, PaymentsModule, AccountsModule, JournalModule, ReportsModule, SettingsModule, NotificationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
