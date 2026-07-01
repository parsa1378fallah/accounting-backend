-- AlterTable
ALTER TABLE `attachment` ADD COLUMN `downloadCount` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `lastDownloadedAt` DATETIME(3) NULL;
