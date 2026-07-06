/*
  Warnings:

  - Added the required column `organizationId` to the `JournalTemplateLine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `JournalTemplateLine` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `journaltemplateline` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `formula` JSON NULL,
    ADD COLUMN `organizationId` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE INDEX `JournalTemplateLine_organizationId_templateId_idx` ON `JournalTemplateLine`(`organizationId`, `templateId`);

-- CreateIndex
CREATE INDEX `JournalTemplateLine_templateId_sortOrder_idx` ON `JournalTemplateLine`(`templateId`, `sortOrder`);
