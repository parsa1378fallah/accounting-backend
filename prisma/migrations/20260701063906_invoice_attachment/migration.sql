/*
  Warnings:

  - You are about to alter the column `entityType` on the `invoiceattachment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(7))`.

*/
-- DropForeignKey
ALTER TABLE `invoiceattachment` DROP FOREIGN KEY `InvoiceAttachment_attachmentId_fkey`;

-- AlterTable
ALTER TABLE `invoiceattachment` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `entityType` ENUM('INVOICE', 'JOURNAL_ENTRY', 'CUSTOMER', 'VENDOR', 'PRODUCT', 'EXPENSE', 'PAYMENT') NOT NULL;

-- AddForeignKey
ALTER TABLE `InvoiceAttachment` ADD CONSTRAINT `InvoiceAttachment_attachmentId_fkey` FOREIGN KEY (`attachmentId`) REFERENCES `Attachment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `invoiceattachment` RENAME INDEX `InvoiceAttachment_attachmentId_fkey` TO `InvoiceAttachment_attachmentId_idx`;
