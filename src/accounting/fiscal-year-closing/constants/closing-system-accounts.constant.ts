import { SystemAccountKey } from '@prisma/client';

export const FiscalYearClosingSystemAccounts = {
    RetainedEarnings:
        SystemAccountKey.RETAINED_EARNINGS,
} as const;