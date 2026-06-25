/*
  Warnings:

  - Added the required column `updatedAt` to the `Currency` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `currency` ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;
