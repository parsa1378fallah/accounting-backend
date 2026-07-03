-- AlterTable
ALTER TABLE `journaltemplateline` MODIFY `amountType` ENUM('FIXED', 'PERCENT', 'DYNAMIC', 'LAST_AMOUNT') NOT NULL;
