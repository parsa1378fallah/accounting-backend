/*
  Warnings:

  - Added the required column `extension` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalName` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Attachment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `attachment` ADD COLUMN `checksum` VARCHAR(191) NULL,
    ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `disk` VARCHAR(191) NULL,
    ADD COLUMN `extension` VARCHAR(191) NOT NULL,
    ADD COLUMN `isPublic` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `originalName` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `uploadedById` VARCHAR(191) NULL;
