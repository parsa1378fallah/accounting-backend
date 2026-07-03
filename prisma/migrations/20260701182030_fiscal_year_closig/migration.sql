/*
  Warnings:

  - A unique constraint covering the columns `[organizationId,closingNumber]` on the table `FiscalYearClosing` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `closingNumber` to the `FiscalYearClosing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `FiscalYearClosing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `fiscalyearclosing` ADD COLUMN `closingNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `reopenedAt` DATETIME(3) NULL,
    ADD COLUMN `reopenedById` VARCHAR(191) NULL,
    ADD COLUMN `reopenedReason` TEXT NULL,
    ADD COLUMN `status` ENUM('PROCESSING', 'COMPLETED', 'REOPENED', 'CANCELLED') NOT NULL DEFAULT 'COMPLETED',
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `_FiscalYearClosingToUser` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_FiscalYearClosingToUser_AB_unique`(`A`, `B`),
    INDEX `_FiscalYearClosingToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `FiscalYearClosing_status_idx` ON `FiscalYearClosing`(`status`);

-- CreateIndex
CREATE UNIQUE INDEX `FiscalYearClosing_organizationId_closingNumber_key` ON `FiscalYearClosing`(`organizationId`, `closingNumber`);

-- AddForeignKey
ALTER TABLE `FiscalYearClosing` ADD CONSTRAINT `FiscalYearClosing_reopenedById_fkey` FOREIGN KEY (`reopenedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FiscalYearClosingToUser` ADD CONSTRAINT `_FiscalYearClosingToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `FiscalYearClosing`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FiscalYearClosingToUser` ADD CONSTRAINT `_FiscalYearClosingToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
