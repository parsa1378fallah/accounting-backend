/*
  Warnings:

  - A unique constraint covering the columns `[organizationId,name]` on the table `JournalTemplate` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `JournalTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `journaltemplate` ADD COLUMN `createdById` VARCHAR(191) NULL,
    ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `description` TEXT NULL,
    ADD COLUMN `isSystem` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `journaltemplateline` ADD COLUMN `costCenterId` VARCHAR(191) NULL,
    ADD COLUMN `currencyId` VARCHAR(191) NULL,
    ADD COLUMN `percentage` DECIMAL(8, 4) NULL,
    ADD COLUMN `projectId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `recurringjournal` ADD COLUMN `createdById` VARCHAR(191) NULL,
    ADD COLUMN `lastRunStatus` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `JournalTemplate_organizationId_type_idx` ON `JournalTemplate`(`organizationId`, `type`);

-- CreateIndex
CREATE INDEX `JournalTemplate_isActive_idx` ON `JournalTemplate`(`isActive`);

-- CreateIndex
CREATE UNIQUE INDEX `JournalTemplate_organizationId_name_key` ON `JournalTemplate`(`organizationId`, `name`);

-- CreateIndex
CREATE INDEX `RecurringJournal_organizationId_isActive_idx` ON `RecurringJournal`(`organizationId`, `isActive`);

-- AddForeignKey
ALTER TABLE `JournalTemplate` ADD CONSTRAINT `JournalTemplate_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JournalTemplateLine` ADD CONSTRAINT `JournalTemplateLine_costCenterId_fkey` FOREIGN KEY (`costCenterId`) REFERENCES `CostCenter`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JournalTemplateLine` ADD CONSTRAINT `JournalTemplateLine_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JournalTemplateLine` ADD CONSTRAINT `JournalTemplateLine_currencyId_fkey` FOREIGN KEY (`currencyId`) REFERENCES `Currency`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecurringJournal` ADD CONSTRAINT `RecurringJournal_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `journaltemplateline` RENAME INDEX `JournalTemplateLine_accountId_fkey` TO `JournalTemplateLine_accountId_idx`;

-- RenameIndex
ALTER TABLE `journaltemplateline` RENAME INDEX `JournalTemplateLine_templateId_fkey` TO `JournalTemplateLine_templateId_idx`;
