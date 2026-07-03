/*
  Warnings:

  - You are about to drop the column `retainedEarnings` on the `fiscalyearclosing` table. All the data in the column will be lost.
  - Added the required column `closingJournalEntryId` to the `FiscalYearClosing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `retainedEarningsAmount` to the `FiscalYearClosing` table without a default value. This is not possible if the table is not empty.
  - Made the column `closedById` on table `fiscalyearclosing` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `fiscalyearclosing` DROP FOREIGN KEY `FiscalYearClosing_closedById_fkey`;

-- DropIndex
DROP INDEX `FiscalYearClosing_closedById_fkey` ON `fiscalyearclosing`;

-- AlterTable
ALTER TABLE `fiscalyearclosing` DROP COLUMN `retainedEarnings`,
    ADD COLUMN `closingJournalEntryId` VARCHAR(191) NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `retainedEarningsAmount` DECIMAL(20, 4) NOT NULL,
    MODIFY `closedById` VARCHAR(191) NOT NULL,
    MODIFY `notes` TEXT NULL;

-- CreateIndex
CREATE INDEX `FiscalYearClosing_organizationId_idx` ON `FiscalYearClosing`(`organizationId`);

-- CreateIndex
CREATE INDEX `FiscalYearClosing_closedAt_idx` ON `FiscalYearClosing`(`closedAt`);

-- AddForeignKey
ALTER TABLE `FiscalYearClosing` ADD CONSTRAINT `FiscalYearClosing_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FiscalYearClosing` ADD CONSTRAINT `FiscalYearClosing_closingJournalEntryId_fkey` FOREIGN KEY (`closingJournalEntryId`) REFERENCES `JournalEntry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FiscalYearClosing` ADD CONSTRAINT `FiscalYearClosing_closedById_fkey` FOREIGN KEY (`closedById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
