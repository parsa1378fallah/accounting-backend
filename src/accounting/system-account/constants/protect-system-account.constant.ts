import { SystemAccountKey } from "@prisma/client";

export const PROTECTED_SYSTEM_ACCOUNTS: SystemAccountKey[] = [
    SystemAccountKey.CASH,
    SystemAccountKey.ACCOUNTS_RECEIVABLE,
    SystemAccountKey.ACCOUNTS_PAYABLE,
    SystemAccountKey.RETAINED_EARNINGS,
    SystemAccountKey.INVENTORY,
    SystemAccountKey.TAX_PAYABLE,
]