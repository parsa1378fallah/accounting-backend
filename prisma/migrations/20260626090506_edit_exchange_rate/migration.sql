/*
  Warnings:

  - Added the required column `organizationId` to the `ExchangeRate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `exchangerate` ADD COLUMN `createdBy` VARCHAR(191) NULL,
    ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `organizationId` VARCHAR(191) NOT NULL,
    ADD COLUMN `status` ENUM('ACTIVE', 'INACTIVE', 'DRAFT') NOT NULL DEFAULT 'ACTIVE',
    ADD COLUMN `updatedBy` VARCHAR(191) NULL,
    ADD COLUMN `version` INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE INDEX `ExchangeRate_currencyId_organizationId_idx` ON `ExchangeRate`(`currencyId`, `organizationId`);
