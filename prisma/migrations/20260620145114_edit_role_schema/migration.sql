/*
  Warnings:

  - A unique constraint covering the columns `[organizationId,code]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Role` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Role_name_key` ON `role`;

-- AlterTable
ALTER TABLE `role` ADD COLUMN `code` VARCHAR(191) NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `isSystem` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `organizationId` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Role_organizationId_code_key` ON `Role`(`organizationId`, `code`);

-- AddForeignKey
ALTER TABLE `Role` ADD CONSTRAINT `Role_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
