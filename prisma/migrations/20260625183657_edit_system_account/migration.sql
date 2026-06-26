/*
  Warnings:

  - Added the required column `name` to the `SystemAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `SystemAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `systemaccount` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;
