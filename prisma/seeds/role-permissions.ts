import { RoleCode } from './roles.seed'

// ================================================================
// نگاشت نقش به permission code ها
// OWNER و SUPER_ADMIN در seed.ts به‌صورت خودکار همه permission ها را می‌گیرند
// ================================================================

export const ROLE_PERMISSIONS: Record<string, string[]> = {

    // ----------------------------------------------------------------
    // ADMINISTRATOR — تقریباً همه‌چیز به‌جز عملیات سیستمی و حسابرسی
    // ----------------------------------------------------------------
    [RoleCode.ADMINISTRATOR]: [
        'organizations.read', 'organizations.update', 'organizations.settings',
        'users.create', 'users.read', 'users.update', 'users.delete',
        'roles.read', 'roles.create', 'roles.update', 'roles.delete', 'roles.assign',
        'permissions.read', 'permissions.assign',
        'branches.read', 'branches.create', 'branches.update', 'branches.delete',
        'fiscal_year.read', 'fiscal_year.create', 'fiscal_year.update',
        'fiscal_year.close', 'fiscal_year.period.lock',
        'accounts.read', 'accounts.create', 'accounts.update', 'accounts.delete',
        'journal.read', 'journal.create', 'journal.update', 'journal.delete',
        'journal.post', 'journal.cancel', 'journal.reverse', 'journal.approve',
        'journal.lock', 'journal.attachment',
        'journal.template.read', 'journal.template.manage',
        'journal.recurring.read', 'journal.recurring.manage',
        'cost_center.read', 'cost_center.create', 'cost_center.update', 'cost_center.delete',
        'project.read', 'project.create', 'project.update', 'project.delete',
        'allocation.manage',
        'cashbox.read', 'cashbox.manage', 'cashbox.transaction.read', 'cashbox.transaction.create',
        'bank.account.read', 'bank.account.manage',
        'bank.transaction.read', 'bank.transaction.create',
        'bank.reconcile', 'bank.checkbook.manage', 'bank.check.read', 'bank.check.manage',
        'treasury.transfer',
        'payments.read', 'payments.create', 'payments.confirm', 'payments.cancel',
        'tax.rate.read', 'tax.rate.manage', 'tax.group.manage',
        'party.read', 'party.create', 'party.update', 'party.delete',
        'party.ledger.read', 'party.credit_limit',
        'currency.read', 'currency.manage', 'currency.rate.manage',
        'product.read', 'product.create', 'product.update', 'product.delete',
        'product.category.manage', 'product.price_list.read', 'product.price_list.manage',
        'warehouse.read', 'warehouse.manage', 'warehouse.transfer',
        'inventory.read', 'inventory.adjust', 'inventory.reserve',
        'inventory.lot.manage', 'inventory.valuation.read',
        'sales.quotation.read', 'sales.quotation.create', 'sales.quotation.update', 'sales.quotation.delete',
        'sales.order.read', 'sales.order.create', 'sales.order.confirm', 'sales.order.cancel',
        'sales.invoice.read', 'sales.invoice.create', 'sales.invoice.cancel',
        'sales.return.read', 'sales.return.create',
        'sales.credit_note.read', 'sales.credit_note.create',
        'delivery.read', 'delivery.create', 'delivery.confirm',
        'purchase.request.read', 'purchase.request.create', 'purchase.request.approve', 'purchase.request.reject',
        'purchase.order.read', 'purchase.order.create', 'purchase.order.confirm', 'purchase.order.cancel',
        'purchase.invoice.read', 'purchase.invoice.create', 'purchase.invoice.cancel',
        'purchase.return.read', 'purchase.return.create',
        'purchase.debit_note.read', 'purchase.debit_note.create',
        'goods_receipt.read', 'goods_receipt.create', 'goods_receipt.confirm',
        'production.bom.read', 'production.bom.manage',
        'production.order.read', 'production.order.create', 'production.order.confirm', 'production.order.complete',
        'production.consumption.record', 'production.output.record',
        'hr.employee.read', 'hr.employee.create', 'hr.employee.update', 'hr.employee.terminate',
        'hr.department.manage', 'hr.leave.read', 'hr.leave.create', 'hr.leave.approve',
        'hr.salary_component.manage',
        'payroll.run.read', 'payroll.run.create', 'payroll.run.calculate',
        'payroll.run.approve', 'payroll.run.pay', 'payroll.run.cancel',
        'assets.category.manage', 'assets.read', 'assets.create', 'assets.update',
        'assets.dispose', 'assets.depreciation.run',
        'assets.maintenance.read', 'assets.maintenance.manage',
        'contracts.read', 'contracts.create', 'contracts.update', 'contracts.delete', 'contracts.renew',
        'workflow.definition.read', 'workflow.definition.manage', 'workflow.action',
        'budget.read', 'budget.create', 'budget.update', 'budget.delete',
        'reports.trial_balance', 'reports.balance_sheet', 'reports.income_statement',
        'reports.cash_flow', 'reports.aged_receivables', 'reports.aged_payables',
        'reports.inventory_valuation', 'reports.tax_report', 'reports.custom',
        'reports.export', 'reports.snapshot',
        'audit.log.read',
        'notifications.read', 'notifications.manage',
    ],

    // ----------------------------------------------------------------
    // AUDITOR — فقط خواندن همه بخش‌ها + export
    // ----------------------------------------------------------------
    [RoleCode.AUDITOR]: [
        'organizations.read',
        'users.read',
        'roles.read', 'permissions.read',
        'branches.read',
        'fiscal_year.read',
        'accounts.read',
        'journal.read', 'journal.template.read', 'journal.recurring.read',
        'cost_center.read', 'project.read',
        'cashbox.read', 'cashbox.transaction.read',
        'bank.account.read', 'bank.transaction.read', 'bank.check.read',
        'payments.read',
        'tax.rate.read',
        'party.read', 'party.ledger.read',
        'currency.read',
        'product.read', 'product.price_list.read',
        'warehouse.read', 'inventory.read', 'inventory.valuation.read',
        'sales.quotation.read', 'sales.order.read', 'sales.invoice.read',
        'sales.return.read', 'sales.credit_note.read', 'delivery.read',
        'purchase.request.read', 'purchase.order.read', 'purchase.invoice.read',
        'purchase.return.read', 'purchase.debit_note.read', 'goods_receipt.read',
        'production.bom.read', 'production.order.read',
        'hr.employee.read', 'hr.leave.read',
        'payroll.run.read',
        'assets.read', 'assets.maintenance.read',
        'contracts.read',
        'workflow.definition.read',
        'budget.read',
        'reports.trial_balance', 'reports.balance_sheet', 'reports.income_statement',
        'reports.cash_flow', 'reports.aged_receivables', 'reports.aged_payables',
        'reports.inventory_valuation', 'reports.tax_report', 'reports.custom',
        'reports.export',
        'audit.log.read',
        'notifications.read',
    ],

    // ----------------------------------------------------------------
    // VIEWER — فقط مشاهده ابتدایی
    // ----------------------------------------------------------------
    [RoleCode.VIEWER]: [
        'organizations.read',
        'branches.read',
        'accounts.read',
        'journal.read',
        'party.read',
        'product.read',
        'warehouse.read', 'inventory.read',
        'sales.invoice.read', 'sales.order.read',
        'purchase.invoice.read', 'purchase.order.read',
        'notifications.read',
    ],

    // ----------------------------------------------------------------
    // ACCOUNTING_MANAGER — مدیریت کامل حسابداری
    // ----------------------------------------------------------------
    [RoleCode.ACCOUNTING_MANAGER]: [
        'organizations.read',
        'fiscal_year.read', 'fiscal_year.close', 'fiscal_year.period.lock',
        'accounts.read', 'accounts.create', 'accounts.update', 'accounts.delete',
        'journal.read', 'journal.create', 'journal.update', 'journal.delete',
        'journal.post', 'journal.cancel', 'journal.reverse', 'journal.approve',
        'journal.lock', 'journal.attachment',
        'journal.template.read', 'journal.template.manage',
        'journal.recurring.read', 'journal.recurring.manage',
        'cost_center.read', 'project.read', 'allocation.manage',
        'cashbox.read', 'cashbox.transaction.read',
        'bank.account.read', 'bank.transaction.read', 'bank.reconcile', 'bank.check.read',
        'treasury.transfer',
        'payments.read', 'payments.create', 'payments.confirm', 'payments.cancel',
        'tax.rate.read', 'tax.rate.manage', 'tax.group.manage',
        'party.read', 'party.ledger.read', 'party.credit_limit',
        'currency.read', 'currency.rate.manage',
        'budget.read', 'budget.create', 'budget.update',
        'reports.trial_balance', 'reports.balance_sheet', 'reports.income_statement',
        'reports.cash_flow', 'reports.aged_receivables', 'reports.aged_payables',
        'reports.tax_report', 'reports.export', 'reports.snapshot',
        'audit.log.read',
        'notifications.read',
    ],

    // ----------------------------------------------------------------
    // ACCOUNTANT — ثبت اسناد و گزارش
    // ----------------------------------------------------------------
    [RoleCode.ACCOUNTANT]: [
        'accounts.read',
        'journal.read', 'journal.create', 'journal.update',
        'journal.attachment', 'journal.template.read', 'journal.recurring.read',
        'cost_center.read', 'project.read',
        'cashbox.read', 'cashbox.transaction.read',
        'bank.account.read', 'bank.transaction.read', 'bank.check.read',
        'payments.read', 'payments.create',
        'tax.rate.read',
        'party.read', 'party.ledger.read',
        'currency.read',
        'reports.trial_balance', 'reports.balance_sheet', 'reports.income_statement',
        'reports.aged_receivables', 'reports.aged_payables', 'reports.export',
        'notifications.read',
    ],

    // ----------------------------------------------------------------
    // CASHIER — صندوق‌دار
    // ----------------------------------------------------------------
    [RoleCode.CASHIER]: [
        'cashbox.read', 'cashbox.transaction.read', 'cashbox.transaction.create',
        'bank.check.read',
        'payments.read', 'payments.create',
        'party.read',
        'notifications.read',
    ],

    // ----------------------------------------------------------------
    // BANK_OPERATOR — متصدی بانک
    // ----------------------------------------------------------------
    [RoleCode.BANK_OPERATOR]: [
        'bank.account.read', 'bank.transaction.read', 'bank.transaction.create',
        'bank.reconcile', 'bank.checkbook.manage', 'bank.check.read', 'bank.check.manage',
        'treasury.transfer',
        'payments.read',
        'party.read',
        'notifications.read',
    ],

    // ----------------------------------------------------------------
    // SALES_MANAGER — مدیر فروش
    // ----------------------------------------------------------------
    [RoleCode.SALES_MANAGER]: [
        'party.read', 'party.create', 'party.update', 'party.ledger.read', 'party.credit_limit',
        'product.read', 'product.price_list.read', 'product.price_list.manage',
        'inventory.read',
        'sales.quotation.read', 'sales.quotation.create', 'sales.quotation.update', 'sales.quotation.delete',
        'sales.order.read', 'sales.order.create', 'sales.order.confirm', 'sales.order.cancel',
        'sales.invoice.read', 'sales.invoice.create', 'sales.invoice.cancel',
        'sales.return.read', 'sales.return.create',
        'sales.credit_note.read', 'sales.credit_note.create',
        'delivery.read', 'delivery.create', 'delivery.confirm',
        'payments.read',
        'reports.aged_receivables', 'reports.export',
        'notifications.read',
    ],

    // ----------------------------------------------------------------
    // SALES — کارشناس فروش
    // ----------------------------------------------------------------
    [RoleCode.SALES]: [
        'party.read', 'party.ledger.read',
        'product.read', 'product.price_list.read',
        'inventory.read',
        'sales.quotation.read', 'sales.quotation.create', 'sales.quotation.update',
        'sales.order.read', 'sales.order.create',
        'sales.invoice.read', 'sales.invoice.create',
        'sales.return.read', 'sales.return.create',
        'delivery.read', 'delivery.create',
        'notifications.read',
    ],

    // ----------------------------------------------------------------
    // PURCHASE_MANAGER — مدیر خرید
    // ----------------------------------------------------------------
    [RoleCode.PURCHASE_MANAGER]: [
        'party.read', 'party.create', 'party.update', 'party.ledger.read', 'party.credit_limit',
        'product.read', 'product.price_list.read',
        'inventory.read',
        'purchase.request.read', 'purchase.request.create', 'purchase.request.approve', 'purchase.request.reject',
        'purchase.order.read', 'purchase.order.create', 'purchase.order.confirm', 'purchase.order.cancel',
        'purchase.invoice.read', 'purchase.invoice.create', 'purchase.invoice.cancel',
        'purchase.return.read', 'purchase.return.create',
        'purchase.debit_note.read', 'purchase.debit_note.create',
        'goods_receipt.read', 'goods_receipt.create', 'goods_receipt.confirm',
        'payments.read',
        'reports.aged_payables', 'reports.export',
        'notifications.read',
    ],

    // ----------------------------------------------------------------
    // PURCHASE — کارشناس خرید
    // ----------------------------------------------------------------
    [RoleCode.PURCHASE]: [
        'party.read',
        'product.read',
        'inventory.read',
        'purchase.request.read', 'purchase.request.create',
        'purchase.order.read', 'purchase.order.create',
        'purchase.invoice.read',
        'purchase.return.read',
        'goods_receipt.read', 'goods_receipt.create',
        'notifications.read',
    ],

    // ----------------------------------------------------------------
    // WAREHOUSE_MANAGER — مدیر انبار
    // ----------------------------------------------------------------
    [RoleCode.WAREHOUSE_MANAGER]: [
        'product.read',
        'warehouse.read', 'warehouse.manage', 'warehouse.transfer',
        'inventory.read', 'inventory.adjust', 'inventory.reserve',
        'inventory.lot.manage', 'inventory.valuation.read',
        'goods_receipt.read', 'goods_receipt.create', 'goods_receipt.confirm',
        'delivery.read', 'delivery.create', 'delivery.confirm',
        'reports.inventory_valuation', 'reports.export',
        'notifications.read',
    ],

    // ----------------------------------------------------------------
    // WAREHOUSE_OPERATOR — متصدی انبار
    // ----------------------------------------------------------------
    [RoleCode.WAREHOUSE_OPERATOR]: [
        'product.read',
        'warehouse.read',
        'inventory.read', 'inventory.reserve',
        'goods_receipt.read', 'goods_receipt.create',
        'delivery.read', 'delivery.create',
        'notifications.read',
    ],

    // ----------------------------------------------------------------
    // INVENTORY_CONTROLLER — کنترل موجودی
    // ----------------------------------------------------------------
    [RoleCode.INVENTORY_CONTROLLER]: [
        'product.read',
        'warehouse.read',
        'inventory.read', 'inventory.adjust', 'inventory.lot.manage', 'inventory.valuation.read',
        'reports.inventory_valuation', 'reports.export',
        'notifications.read',
    ],

    // ----------------------------------------------------------------
    // HR_MANAGER — مدیر منابع انسانی
    // ----------------------------------------------------------------
    [RoleCode.HR_MANAGER]: [
        'hr.employee.read', 'hr.employee.create', 'hr.employee.update', 'hr.employee.terminate',
        'hr.department.manage',
        'hr.leave.read', 'hr.leave.create', 'hr.leave.approve',
        'hr.salary_component.manage',
        'payroll.run.read',
        'contracts.read', 'contracts.create', 'contracts.update',
        'notifications.read',
    ],

    // ----------------------------------------------------------------
    // HR_OFFICER — کارشناس منابع انسانی
    // ----------------------------------------------------------------
    [RoleCode.HR_OFFICER]: [
        'hr.employee.read', 'hr.employee.create', 'hr.employee.update',
        'hr.leave.read', 'hr.leave.create',
        'notifications.read',
    ],

    // ----------------------------------------------------------------
    // PAYROLL_OFFICER — کارشناس حقوق و دستمزد
    // ----------------------------------------------------------------
    [RoleCode.PAYROLL_OFFICER]: [
        'hr.employee.read', 'hr.salary_component.manage',
        'payroll.run.read', 'payroll.run.create', 'payroll.run.calculate',
        'reports.export',
        'notifications.read',
    ],

    // ----------------------------------------------------------------
    // PRODUCTION_MANAGER — مدیر تولید
    // ----------------------------------------------------------------
    [RoleCode.PRODUCTION_MANAGER]: [
        'product.read',
        'warehouse.read', 'inventory.read', 'inventory.reserve',
        'production.bom.read', 'production.bom.manage',
        'production.order.read', 'production.order.create',
        'production.order.confirm', 'production.order.complete',
        'production.consumption.record', 'production.output.record',
        'reports.inventory_valuation', 'reports.export',
        'notifications.read',
    ],

    // ----------------------------------------------------------------
    // PRODUCTION_OPERATOR — اپراتور تولید
    // ----------------------------------------------------------------
    [RoleCode.PRODUCTION_OPERATOR]: [
        'product.read',
        'warehouse.read', 'inventory.read',
        'production.bom.read',
        'production.order.read',
        'production.consumption.record', 'production.output.record',
        'notifications.read',
    ],

    // ----------------------------------------------------------------
    // PROJECT_MANAGER — مدیر پروژه
    // ----------------------------------------------------------------
    [RoleCode.PROJECT_MANAGER]: [
        'cost_center.read', 'cost_center.create', 'cost_center.update',
        'project.read', 'project.create', 'project.update',
        'allocation.manage',
        'budget.read', 'budget.create', 'budget.update',
        'reports.custom', 'reports.export',
        'notifications.read',
    ],

    // ----------------------------------------------------------------
    // ASSET_MANAGER — مدیر دارایی‌ها
    // ----------------------------------------------------------------
    [RoleCode.ASSET_MANAGER]: [
        'accounts.read',
        'assets.category.manage',
        'assets.read', 'assets.create', 'assets.update', 'assets.dispose',
        'assets.depreciation.run',
        'assets.maintenance.read', 'assets.maintenance.manage',
        'reports.export',
        'notifications.read',
    ],

    // ----------------------------------------------------------------
    // CONTRACT_MANAGER — مدیر قراردادها
    // ----------------------------------------------------------------
    [RoleCode.CONTRACT_MANAGER]: [
        'party.read', 'party.ledger.read',
        'contracts.read', 'contracts.create', 'contracts.update', 'contracts.delete', 'contracts.renew',
        'hr.employee.read',
        'notifications.read',
    ],
}
