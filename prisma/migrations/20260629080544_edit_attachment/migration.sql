-- CreateIndex
CREATE INDEX `Attachment_mimeType_idx` ON `Attachment`(`mimeType`);

-- CreateIndex
CREATE INDEX `Attachment_extension_idx` ON `Attachment`(`extension`);

-- CreateIndex
CREATE INDEX `Attachment_createdAt_idx` ON `Attachment`(`createdAt`);

-- CreateIndex
CREATE INDEX `Attachment_deletedAt_idx` ON `Attachment`(`deletedAt`);

-- RenameIndex
ALTER TABLE `attachment` RENAME INDEX `Attachment_organizationId_fkey` TO `Attachment_organizationId_idx`;
