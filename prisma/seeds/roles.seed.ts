// ================================================================
// ROLES — منبع واحد حقیقت برای تمام نقش‌های سیستم
// ================================================================

export enum RoleCode {
    // سطح سیستمی
    OWNER = 'OWNER',
    SUPER_ADMIN = 'SUPER_ADMIN',
    ADMINISTRATOR = 'ADMINISTRATOR',
    AUDITOR = 'AUDITOR',
    VIEWER = 'VIEWER',

    // حسابداری و مالی
    ACCOUNTING_MANAGER = 'ACCOUNTING_MANAGER',
    ACCOUNTANT = 'ACCOUNTANT',
    CASHIER = 'CASHIER',
    BANK_OPERATOR = 'BANK_OPERATOR',

    // فروش
    SALES_MANAGER = 'SALES_MANAGER',
    SALES = 'SALES',

    // خرید
    PURCHASE_MANAGER = 'PURCHASE_MANAGER',
    PURCHASE = 'PURCHASE',

    // انبار و موجودی
    WAREHOUSE_MANAGER = 'WAREHOUSE_MANAGER',
    WAREHOUSE_OPERATOR = 'WAREHOUSE_OPERATOR',
    INVENTORY_CONTROLLER = 'INVENTORY_CONTROLLER',

    // منابع انسانی و حقوق
    HR_MANAGER = 'HR_MANAGER',
    HR_OFFICER = 'HR_OFFICER',
    PAYROLL_OFFICER = 'PAYROLL_OFFICER',

    // تولید
    PRODUCTION_MANAGER = 'PRODUCTION_MANAGER',
    PRODUCTION_OPERATOR = 'PRODUCTION_OPERATOR',

    // سایر
    PROJECT_MANAGER = 'PROJECT_MANAGER',
    ASSET_MANAGER = 'ASSET_MANAGER',
    CONTRACT_MANAGER = 'CONTRACT_MANAGER',
}

export const ROLES: {
    code: RoleCode
    name: string
    description: string
    isSystem: boolean
    isDefault: boolean
    isActive: boolean
}[] = [
        // سطح سیستمی
        {
            code: RoleCode.OWNER,
            name: 'مالک سازمان',
            description: 'دسترسی کامل و غیرقابل تغییر به تمام بخش‌ها. این نقش به اولین کاربر هر سازمان داده می‌شود.',
            isSystem: true, isDefault: true, isActive: true,
        },
        {
            code: RoleCode.SUPER_ADMIN,
            name: 'مدیر کل سیستم',
            description: 'دسترسی کامل به همه سازمان‌ها. فقط توسط تیم فنی قابل اختصاص است.',
            isSystem: true, isDefault: false, isActive: true,
        },
        {
            code: RoleCode.ADMINISTRATOR,
            name: 'مدیر سیستم',
            description: 'مدیریت کامل سازمان به‌جز عملیات حذف دائمی و تنظیمات سیستمی.',
            isSystem: true, isDefault: true, isActive: true,
        },
        {
            code: RoleCode.AUDITOR,
            name: 'حسابرس',
            description: 'دسترسی فقط-خواندنی به تمام بخش‌ها برای ممیزی و بررسی.',
            isSystem: true, isDefault: false, isActive: true,
        },
        {
            code: RoleCode.VIEWER,
            name: 'بیننده',
            description: 'مشاهده اطلاعات پایه سازمان بدون قابلیت ویرایش.',
            isSystem: true, isDefault: true, isActive: true,
        },

        // حسابداری
        {
            code: RoleCode.ACCOUNTING_MANAGER,
            name: 'مدیر حسابداری',
            description: 'مدیریت کامل بخش حسابداری، تایید اسناد، بستن دوره مالی.',
            isSystem: true, isDefault: true, isActive: true,
        },
        {
            code: RoleCode.ACCOUNTANT,
            name: 'حسابدار',
            description: 'ثبت اسناد حسابداری و مشاهده گزارش‌های مالی.',
            isSystem: true, isDefault: true, isActive: true,
        },
        {
            code: RoleCode.CASHIER,
            name: 'صندوق‌دار',
            description: 'ثبت دریافت و پرداخت نقدی و مدیریت صندوق.',
            isSystem: true, isDefault: true, isActive: true,
        },
        {
            code: RoleCode.BANK_OPERATOR,
            name: 'متصدی بانک',
            description: 'ثبت تراکنش‌های بانکی و مغایرت‌گیری.',
            isSystem: true, isDefault: true, isActive: true,
        },

        // فروش
        {
            code: RoleCode.SALES_MANAGER,
            name: 'مدیر فروش',
            description: 'مدیریت کامل بخش فروش، تایید فاکتور، مدیریت قیمت‌گذاری.',
            isSystem: true, isDefault: true, isActive: true,
        },
        {
            code: RoleCode.SALES,
            name: 'کارشناس فروش',
            description: 'ثبت پیش‌فاکتور، سفارش فروش و فاکتور.',
            isSystem: true, isDefault: true, isActive: true,
        },

        // خرید
        {
            code: RoleCode.PURCHASE_MANAGER,
            name: 'مدیر خرید',
            description: 'مدیریت کامل بخش خرید، تایید سفارش و فاکتور خرید.',
            isSystem: true, isDefault: true, isActive: true,
        },
        {
            code: RoleCode.PURCHASE,
            name: 'کارشناس خرید',
            description: 'ثبت درخواست خرید، سفارش خرید و رسید کالا.',
            isSystem: true, isDefault: true, isActive: true,
        },

        // انبار
        {
            code: RoleCode.WAREHOUSE_MANAGER,
            name: 'مدیر انبار',
            description: 'مدیریت کامل انبارها، انتقال موجودی و تعدیل.',
            isSystem: true, isDefault: true, isActive: true,
        },
        {
            code: RoleCode.WAREHOUSE_OPERATOR,
            name: 'متصدی انبار',
            description: 'ثبت ورود و خروج کالا، رسید انبار.',
            isSystem: true, isDefault: true, isActive: true,
        },
        {
            code: RoleCode.INVENTORY_CONTROLLER,
            name: 'کنترل موجودی',
            description: 'بررسی و تعدیل موجودی انبار، گزارش‌های موجودی.',
            isSystem: true, isDefault: true, isActive: true,
        },

        // منابع انسانی
        {
            code: RoleCode.HR_MANAGER,
            name: 'مدیر منابع انسانی',
            description: 'مدیریت کامل پرسنل، ساختار سازمانی و مرخصی.',
            isSystem: true, isDefault: true, isActive: true,
        },
        {
            code: RoleCode.HR_OFFICER,
            name: 'کارشناس منابع انسانی',
            description: 'ثبت و ویرایش اطلاعات پرسنل و درخواست مرخصی.',
            isSystem: true, isDefault: true, isActive: true,
        },
        {
            code: RoleCode.PAYROLL_OFFICER,
            name: 'کارشناس حقوق و دستمزد',
            description: 'پردازش فیش حقوقی و مدیریت اجزای حقوقی.',
            isSystem: true, isDefault: true, isActive: true,
        },

        // تولید
        {
            code: RoleCode.PRODUCTION_MANAGER,
            name: 'مدیر تولید',
            description: 'مدیریت دستور تولید، BOM و برنامه‌ریزی تولید.',
            isSystem: true, isDefault: true, isActive: true,
        },
        {
            code: RoleCode.PRODUCTION_OPERATOR,
            name: 'اپراتور تولید',
            description: 'ثبت مصرف مواد اولیه و خروجی تولید.',
            isSystem: true, isDefault: true, isActive: true,
        },

        // سایر
        {
            code: RoleCode.PROJECT_MANAGER,
            name: 'مدیر پروژه',
            description: 'مدیریت پروژه‌ها، مراکز هزینه و تخصیص.',
            isSystem: true, isDefault: true, isActive: true,
        },
        {
            code: RoleCode.ASSET_MANAGER,
            name: 'مدیر دارایی‌ها',
            description: 'مدیریت دارایی‌های ثابت، استهلاک و نگهداری.',
            isSystem: true, isDefault: true, isActive: true,
        },
        {
            code: RoleCode.CONTRACT_MANAGER,
            name: 'مدیر قراردادها',
            description: 'مدیریت قراردادهای مشتریان، تامین‌کنندگان و پرسنل.',
            isSystem: true, isDefault: true, isActive: true,
        },
    ]
