/*
  Warnings:

  - You are about to alter the column `key` on the `systemaccount` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(5))`.

*/
-- AlterTable
ALTER TABLE `systemaccount` MODIFY `key` ENUM('CASH', 'PETTY_CASH', 'BANK', 'ACCOUNTS_RECEIVABLE', 'ACCOUNTS_PAYABLE', 'SALES', 'SALES_RETURN', 'PURCHASE', 'PURCHASE_RETURN', 'INVENTORY', 'TAX_PAYABLE', 'TAX_RECEIVABLE', 'DISCOUNT_GIVEN', 'DISCOUNT_RECEIVED', 'EXCHANGE_GAIN', 'EXCHANGE_LOSS', 'RETAINED_EARNINGS') NOT NULL;
