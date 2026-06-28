/*
  Warnings:

  - Added the required column `updatedAt` to the `CostCenter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `costcenter` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `level` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `path` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE INDEX `CostCenter_organizationId_idx` ON `CostCenter`(`organizationId`);

-- CreateIndex
CREATE INDEX `CostCenter_isActive_idx` ON `CostCenter`(`isActive`);

-- CreateIndex
CREATE INDEX `CostCenter_deletedAt_idx` ON `CostCenter`(`deletedAt`);

-- RenameIndex
ALTER TABLE `costcenter` RENAME INDEX `CostCenter_parentId_fkey` TO `CostCenter_parentId_idx`;
