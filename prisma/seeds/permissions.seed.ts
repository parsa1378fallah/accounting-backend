// ================================================================
// PERMISSIONS — منبع واحد حقیقت برای تمام permission های سیستم
// قالب: module.resource.action  یا  module.action
// ================================================================

export type PermissionSeed = {
    code: string
    name: string
    module: string
}

export const PERMISSIONS: PermissionSeed[] = [

    // ================================================================
    // ORGANIZATIONS — سازمان
    // ================================================================
    { module: 'organizations', code: 'organizations.read', name: 'مشاهده سازمان' },
    { module: 'organizations', code: 'organizations.update', name: 'ویرایش اطلاعات سازمان' },
    { module: 'organizations', code: 'organizations.settings', name: 'مدیریت تنظیمات سازمان' },

    // ================================================================
    // USERS — کاربران
    // ================================================================
    { module: 'users', code: 'users.create', name: 'ایجاد کاربر' },
    { module: 'users', code: 'users.read', name: 'مشاهده کاربران' },
    { module: 'users', code: 'users.update', name: 'ویرایش کاربر' },
    { module: 'users', code: 'users.delete', name: 'حذف/غیرفعال کردن کاربر' },

    // ================================================================
    // ROLES & PERMISSIONS — نقش و دسترسی
    // ================================================================
    { module: 'roles', code: 'roles.read', name: 'مشاهده نقش‌ها' },
    { module: 'roles', code: 'roles.create', name: 'ایجاد نقش' },
    { module: 'roles', code: 'roles.update', name: 'ویرایش نقش' },
    { module: 'roles', code: 'roles.delete', name: 'حذف نقش' },
    { module: 'roles', code: 'roles.assign', name: 'تخصیص نقش به کاربر' },
    { module: 'permissions', code: 'permissions.read', name: 'مشاهده مجوزها' },
    { module: 'permissions', code: 'permissions.assign', name: 'تخصیص مجوز به نقش' },

    // ================================================================
    // BRANCHES — شعبه
    // ================================================================
    { module: 'branches', code: 'branches.read', name: 'مشاهده شعبه‌ها' },
    { module: 'branches', code: 'branches.create', name: 'ایجاد شعبه' },
    { module: 'branches', code: 'branches.update', name: 'ویرایش شعبه' },
    { module: 'branches', code: 'branches.delete', name: 'حذف شعبه' },

    // ================================================================
    // FISCAL YEAR — سال مالی
    // ================================================================
    { module: 'fiscal_year', code: 'fiscal_year.read', name: 'مشاهده سال مالی' },
    { module: 'fiscal_year', code: 'fiscal_year.create', name: 'ایجاد سال مالی' },
    { module: 'fiscal_year', code: 'fiscal_year.update', name: 'ویرایش سال مالی' },
    { module: 'fiscal_year', code: 'fiscal_year.close', name: 'بستن سال مالی' },
    { module: 'fiscal_year', code: 'fiscal_year.period.lock', name: 'قفل کردن دوره مالی' },

    // ================================================================
    // ACCOUNTS — حساب‌های کل
    // ================================================================
    { module: 'accounts', code: 'accounts.read', name: 'مشاهده حساب‌ها' },
    { module: 'accounts', code: 'accounts.create', name: 'ایجاد حساب' },
    { module: 'accounts', code: 'accounts.update', name: 'ویرایش حساب' },
    { module: 'accounts', code: 'accounts.delete', name: 'غیرفعال کردن حساب' },

    // ================================================================
    // JOURNAL ENTRY — اسناد حسابداری
    // ================================================================
    { module: 'journal', code: 'journal.read', name: 'مشاهده اسناد حسابداری' },
    { module: 'journal', code: 'journal.create', name: 'ثبت سند حسابداری' },
    { module: 'journal', code: 'journal.update', name: 'ویرایش سند پیش‌نویس' },
    { module: 'journal', code: 'journal.delete', name: 'حذف سند پیش‌نویس' },
    { module: 'journal', code: 'journal.post', name: 'قطعی کردن سند' },
    { module: 'journal', code: 'journal.cancel', name: 'لغو سند' },
    { module: 'journal', code: 'journal.reverse', name: 'برگشت سند' },
    { module: 'journal', code: 'journal.approve', name: 'تایید سند' },
    { module: 'journal', code: 'journal.lock', name: 'قفل کردن سند' },
    { module: 'journal', code: 'journal.attachment', name: 'مدیریت پیوست اسناد' },
    { module: 'journal', code: 'journal.template.read', name: 'مشاهده قالب اسناد' },
    { module: 'journal', code: 'journal.template.manage', name: 'مدیریت قالب اسناد' },
    { module: 'journal', code: 'journal.recurring.read', name: 'مشاهده اسناد تکرارشونده' },
    { module: 'journal', code: 'journal.recurring.manage', name: 'مدیریت اسناد تکرارشونده' },

    // ================================================================
    // COST CENTER & PROJECT — مرکز هزینه و پروژه
    // ================================================================
    { module: 'cost_center', code: 'cost_center.read', name: 'مشاهده مراکز هزینه' },
    { module: 'cost_center', code: 'cost_center.create', name: 'ایجاد مرکز هزینه' },
    { module: 'cost_center', code: 'cost_center.update', name: 'ویرایش مرکز هزینه' },
    { module: 'cost_center', code: 'cost_center.delete', name: 'حذف مرکز هزینه' },
    { module: 'project', code: 'project.read', name: 'مشاهده پروژه‌ها' },
    { module: 'project', code: 'project.create', name: 'ایجاد پروژه' },
    { module: 'project', code: 'project.update', name: 'ویرایش پروژه' },
    { module: 'project', code: 'project.delete', name: 'حذف پروژه' },
    { module: 'project', code: 'allocation.manage', name: 'مدیریت تخصیص هزینه' },

    // ================================================================
    // TREASURY — خزانه‌داری
    // ================================================================
    { module: 'cashbox', code: 'cashbox.read', name: 'مشاهده صندوق‌ها' },
    { module: 'cashbox', code: 'cashbox.manage', name: 'مدیریت صندوق‌ها' },
    { module: 'cashbox', code: 'cashbox.transaction.read', name: 'مشاهده تراکنش‌های نقدی' },
    { module: 'cashbox', code: 'cashbox.transaction.create', name: 'ثبت تراکنش نقدی' },
    { module: 'bank', code: 'bank.account.read', name: 'مشاهده حساب‌های بانکی' },
    { module: 'bank', code: 'bank.account.manage', name: 'مدیریت حساب‌های بانکی' },
    { module: 'bank', code: 'bank.transaction.read', name: 'مشاهده تراکنش‌های بانکی' },
    { module: 'bank', code: 'bank.transaction.create', name: 'ثبت تراکنش بانکی' },
    { module: 'bank', code: 'bank.reconcile', name: 'مغایرت‌گیری بانکی' },
    { module: 'bank', code: 'bank.checkbook.manage', name: 'مدیریت دسته‌چک' },
    { module: 'bank', code: 'bank.check.read', name: 'مشاهده چک‌ها' },
    { module: 'bank', code: 'bank.check.manage', name: 'مدیریت چک‌ها' },
    { module: 'treasury', code: 'treasury.transfer', name: 'انتقال بین صندوق/بانک' },

    // ================================================================
    // PAYMENTS — پرداخت‌ها
    // ================================================================
    { module: 'payments', code: 'payments.read', name: 'مشاهده پرداخت‌ها' },
    { module: 'payments', code: 'payments.create', name: 'ثبت پرداخت' },
    { module: 'payments', code: 'payments.confirm', name: 'تایید پرداخت' },
    { module: 'payments', code: 'payments.cancel', name: 'لغو پرداخت' },

    // ================================================================
    // TAX — مالیات
    // ================================================================
    { module: 'tax', code: 'tax.rate.read', name: 'مشاهده نرخ‌های مالیاتی' },
    { module: 'tax', code: 'tax.rate.manage', name: 'مدیریت نرخ‌های مالیاتی' },
    { module: 'tax', code: 'tax.group.manage', name: 'مدیریت گروه مالیاتی' },

    // ================================================================
    // PARTY — طرف‌های حساب
    // ================================================================
    { module: 'party', code: 'party.read', name: 'مشاهده طرف‌های حساب' },
    { module: 'party', code: 'party.create', name: 'ایجاد طرف حساب' },
    { module: 'party', code: 'party.update', name: 'ویرایش طرف حساب' },
    { module: 'party', code: 'party.delete', name: 'حذف طرف حساب' },
    { module: 'party', code: 'party.ledger.read', name: 'مشاهده دفتر معین طرف حساب' },
    { module: 'party', code: 'party.credit_limit', name: 'مدیریت سقف اعتباری' },

    // ================================================================
    // CURRENCY — ارز
    // ================================================================
    { module: 'currency', code: 'currency.read', name: 'مشاهده ارزها' },
    { module: 'currency', code: 'currency.manage', name: 'مدیریت ارزها' },
    { module: 'currency', code: 'currency.rate.manage', name: 'مدیریت نرخ ارز' },

    // ================================================================
    // PRODUCTS & CATEGORIES — محصولات
    // ================================================================
    { module: 'product', code: 'product.read', name: 'مشاهده محصولات' },
    { module: 'product', code: 'product.create', name: 'ایجاد محصول' },
    { module: 'product', code: 'product.update', name: 'ویرایش محصول' },
    { module: 'product', code: 'product.delete', name: 'حذف/غیرفعال کردن محصول' },
    { module: 'product', code: 'product.category.manage', name: 'مدیریت دسته‌بندی محصولات' },
    { module: 'product', code: 'product.price_list.read', name: 'مشاهده لیست قیمت' },
    { module: 'product', code: 'product.price_list.manage', name: 'مدیریت لیست قیمت' },

    // ================================================================
    // WAREHOUSES — انبار
    // ================================================================
    { module: 'warehouse', code: 'warehouse.read', name: 'مشاهده انبارها' },
    { module: 'warehouse', code: 'warehouse.manage', name: 'مدیریت انبارها' },
    { module: 'warehouse', code: 'warehouse.transfer', name: 'انتقال موجودی بین انبار' },

    // ================================================================
    // INVENTORY — موجودی
    // ================================================================
    { module: 'inventory', code: 'inventory.read', name: 'مشاهده موجودی' },
    { module: 'inventory', code: 'inventory.adjust', name: 'تعدیل موجودی' },
    { module: 'inventory', code: 'inventory.reserve', name: 'رزرو موجودی' },
    { module: 'inventory', code: 'inventory.lot.manage', name: 'مدیریت لات/سریال' },
    { module: 'inventory', code: 'inventory.valuation.read', name: 'مشاهده ارزش‌گذاری موجودی' },

    // ================================================================
    // SALES — فروش
    // ================================================================
    { module: 'sales', code: 'sales.quotation.read', name: 'مشاهده پیش‌فاکتور' },
    { module: 'sales', code: 'sales.quotation.create', name: 'ثبت پیش‌فاکتور' },
    { module: 'sales', code: 'sales.quotation.update', name: 'ویرایش پیش‌فاکتور' },
    { module: 'sales', code: 'sales.quotation.delete', name: 'حذف پیش‌فاکتور' },
    { module: 'sales', code: 'sales.order.read', name: 'مشاهده سفارش فروش' },
    { module: 'sales', code: 'sales.order.create', name: 'ثبت سفارش فروش' },
    { module: 'sales', code: 'sales.order.confirm', name: 'تایید سفارش فروش' },
    { module: 'sales', code: 'sales.order.cancel', name: 'لغو سفارش فروش' },
    { module: 'sales', code: 'sales.invoice.read', name: 'مشاهده فاکتور فروش' },
    { module: 'sales', code: 'sales.invoice.create', name: 'ثبت فاکتور فروش' },
    { module: 'sales', code: 'sales.invoice.cancel', name: 'لغو فاکتور فروش' },
    { module: 'sales', code: 'sales.return.read', name: 'مشاهده مرجوعی فروش' },
    { module: 'sales', code: 'sales.return.create', name: 'ثبت مرجوعی فروش' },
    { module: 'sales', code: 'sales.credit_note.read', name: 'مشاهده اعتبار فروش' },
    { module: 'sales', code: 'sales.credit_note.create', name: 'ثبت اعتبار فروش' },
    { module: 'sales', code: 'delivery.read', name: 'مشاهده حواله تحویل' },
    { module: 'sales', code: 'delivery.create', name: 'ثبت حواله تحویل' },
    { module: 'sales', code: 'delivery.confirm', name: 'تایید تحویل' },

    // ================================================================
    // PURCHASE — خرید
    // ================================================================
    { module: 'purchase', code: 'purchase.request.read', name: 'مشاهده درخواست خرید' },
    { module: 'purchase', code: 'purchase.request.create', name: 'ثبت درخواست خرید' },
    { module: 'purchase', code: 'purchase.request.approve', name: 'تایید درخواست خرید' },
    { module: 'purchase', code: 'purchase.request.reject', name: 'رد درخواست خرید' },
    { module: 'purchase', code: 'purchase.order.read', name: 'مشاهده سفارش خرید' },
    { module: 'purchase', code: 'purchase.order.create', name: 'ثبت سفارش خرید' },
    { module: 'purchase', code: 'purchase.order.confirm', name: 'تایید سفارش خرید' },
    { module: 'purchase', code: 'purchase.order.cancel', name: 'لغو سفارش خرید' },
    { module: 'purchase', code: 'purchase.invoice.read', name: 'مشاهده فاکتور خرید' },
    { module: 'purchase', code: 'purchase.invoice.create', name: 'ثبت فاکتور خرید' },
    { module: 'purchase', code: 'purchase.invoice.cancel', name: 'لغو فاکتور خرید' },
    { module: 'purchase', code: 'purchase.return.read', name: 'مشاهده مرجوعی خرید' },
    { module: 'purchase', code: 'purchase.return.create', name: 'ثبت مرجوعی خرید' },
    { module: 'purchase', code: 'purchase.debit_note.read', name: 'مشاهده بدهکاری خرید' },
    { module: 'purchase', code: 'purchase.debit_note.create', name: 'ثبت بدهکاری خرید' },
    { module: 'purchase', code: 'goods_receipt.read', name: 'مشاهده رسید انبار' },
    { module: 'purchase', code: 'goods_receipt.create', name: 'ثبت رسید انبار' },
    { module: 'purchase', code: 'goods_receipt.confirm', name: 'تایید رسید انبار' },

    // ================================================================
    // PRODUCTION — تولید
    // ================================================================
    { module: 'production', code: 'production.bom.read', name: 'مشاهده فرمول ساخت (BOM)' },
    { module: 'production', code: 'production.bom.manage', name: 'مدیریت فرمول ساخت (BOM)' },
    { module: 'production', code: 'production.order.read', name: 'مشاهده دستور تولید' },
    { module: 'production', code: 'production.order.create', name: 'ثبت دستور تولید' },
    { module: 'production', code: 'production.order.confirm', name: 'تایید دستور تولید' },
    { module: 'production', code: 'production.order.complete', name: 'تکمیل دستور تولید' },
    { module: 'production', code: 'production.consumption.record', name: 'ثبت مصرف مواد اولیه' },
    { module: 'production', code: 'production.output.record', name: 'ثبت خروجی تولید' },

    // ================================================================
    // HR — منابع انسانی
    // ================================================================
    { module: 'hr', code: 'hr.employee.read', name: 'مشاهده پرسنل' },
    { module: 'hr', code: 'hr.employee.create', name: 'ایجاد پرسنل' },
    { module: 'hr', code: 'hr.employee.update', name: 'ویرایش اطلاعات پرسنل' },
    { module: 'hr', code: 'hr.employee.terminate', name: 'پایان همکاری پرسنل' },
    { module: 'hr', code: 'hr.department.manage', name: 'مدیریت بخش‌ها و سمت‌ها' },
    { module: 'hr', code: 'hr.leave.read', name: 'مشاهده درخواست مرخصی' },
    { module: 'hr', code: 'hr.leave.create', name: 'ثبت درخواست مرخصی' },
    { module: 'hr', code: 'hr.leave.approve', name: 'تایید درخواست مرخصی' },
    { module: 'hr', code: 'hr.salary_component.manage', name: 'مدیریت اجزای حقوقی' },

    // ================================================================
    // PAYROLL — حقوق و دستمزد
    // ================================================================
    { module: 'payroll', code: 'payroll.run.read', name: 'مشاهده دوره حقوق' },
    { module: 'payroll', code: 'payroll.run.create', name: 'ایجاد دوره حقوق' },
    { module: 'payroll', code: 'payroll.run.calculate', name: 'محاسبه حقوق' },
    { module: 'payroll', code: 'payroll.run.approve', name: 'تایید حقوق' },
    { module: 'payroll', code: 'payroll.run.pay', name: 'پرداخت حقوق' },
    { module: 'payroll', code: 'payroll.run.cancel', name: 'لغو دوره حقوق' },

    // ================================================================
    // ASSETS — دارایی‌های ثابت
    // ================================================================
    { module: 'assets', code: 'assets.category.manage', name: 'مدیریت گروه دارایی' },
    { module: 'assets', code: 'assets.read', name: 'مشاهده دارایی‌ها' },
    { module: 'assets', code: 'assets.create', name: 'ثبت دارایی' },
    { module: 'assets', code: 'assets.update', name: 'ویرایش دارایی' },
    { module: 'assets', code: 'assets.dispose', name: 'اسقاط/فروش دارایی' },
    { module: 'assets', code: 'assets.depreciation.run', name: 'اجرای استهلاک' },
    { module: 'assets', code: 'assets.maintenance.read', name: 'مشاهده نگهداری دارایی' },
    { module: 'assets', code: 'assets.maintenance.manage', name: 'مدیریت نگهداری دارایی' },

    // ================================================================
    // CONTRACTS — قراردادها
    // ================================================================
    { module: 'contracts', code: 'contracts.read', name: 'مشاهده قراردادها' },
    { module: 'contracts', code: 'contracts.create', name: 'ثبت قرارداد' },
    { module: 'contracts', code: 'contracts.update', name: 'ویرایش قرارداد' },
    { module: 'contracts', code: 'contracts.delete', name: 'حذف/لغو قرارداد' },
    { module: 'contracts', code: 'contracts.renew', name: 'تمدید قرارداد' },

    // ================================================================
    // WORKFLOW — فرآیند تایید
    // ================================================================
    { module: 'workflow', code: 'workflow.definition.read', name: 'مشاهده تعریف گردش کار' },
    { module: 'workflow', code: 'workflow.definition.manage', name: 'مدیریت گردش کار' },
    { module: 'workflow', code: 'workflow.action', name: 'اقدام در گردش کار (تایید/رد)' },

    // ================================================================
    // BUDGET — بودجه
    // ================================================================
    { module: 'budget', code: 'budget.read', name: 'مشاهده بودجه' },
    { module: 'budget', code: 'budget.create', name: 'ایجاد بودجه' },
    { module: 'budget', code: 'budget.update', name: 'ویرایش بودجه' },
    { module: 'budget', code: 'budget.delete', name: 'حذف بودجه' },

    // ================================================================
    // REPORTS — گزارش‌ها
    // ================================================================
    { module: 'reports', code: 'reports.trial_balance', name: 'گزارش تراز آزمایشی' },
    { module: 'reports', code: 'reports.balance_sheet', name: 'گزارش ترازنامه' },
    { module: 'reports', code: 'reports.income_statement', name: 'گزارش سود و زیان' },
    { module: 'reports', code: 'reports.cash_flow', name: 'گزارش جریان نقدی' },
    { module: 'reports', code: 'reports.aged_receivables', name: 'گزارش اعمار دریافتنی' },
    { module: 'reports', code: 'reports.aged_payables', name: 'گزارش اعمار پرداختنی' },
    { module: 'reports', code: 'reports.inventory_valuation', name: 'گزارش ارزش موجودی' },
    { module: 'reports', code: 'reports.tax_report', name: 'گزارش مالیاتی' },
    { module: 'reports', code: 'reports.custom', name: 'گزارش سفارشی' },
    { module: 'reports', code: 'reports.export', name: 'خروجی گرفتن از گزارش' },
    { module: 'reports', code: 'reports.snapshot', name: 'ذخیره نسخه گزارش' },

    // ================================================================
    // AUDIT LOG — گزارش تغییرات
    // ================================================================
    { module: 'audit', code: 'audit.log.read', name: 'مشاهده تاریخچه تغییرات' },

    // ================================================================
    // NOTIFICATIONS — اعلان‌ها
    // ================================================================
    { module: 'notifications', code: 'notifications.read', name: 'مشاهده اعلان‌ها' },
    { module: 'notifications', code: 'notifications.manage', name: 'مدیریت اعلان‌ها' },
]
