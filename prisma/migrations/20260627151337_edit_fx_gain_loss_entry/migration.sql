/*
  Warnings:

  - Added the required column `baseCurrencyId` to the `FxGainLossEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exchangeRate` to the `FxGainLossEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gainLossType` to the `FxGainLossEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sourceAmount` to the `FxGainLossEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sourceCurrencyCode` to the `FxGainLossEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `fxgainlossentry` ADD COLUMN `baseCurrencyId` VARCHAR(191) NOT NULL,
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `exchangeRate` DECIMAL(20, 8) NOT NULL,
    ADD COLUMN `gainLossType` ENUM('REALIZED_GAIN', 'REALIZED_LOSS', 'UNREALIZED_GAIN', 'UNREALIZED_LOSS') NOT NULL,
    ADD COLUMN `sourceAmount` DECIMAL(20, 4) NOT NULL,
    ADD COLUMN `sourceCurrencyCode` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `FxGainLossEntry_createdAt_idx` ON `FxGainLossEntry`(`createdAt`);

-- AddForeignKey
ALTER TABLE `FxGainLossEntry` ADD CONSTRAINT `FxGainLossEntry_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FxGainLossEntry` ADD CONSTRAINT `FxGainLossEntry_baseCurrencyId_fkey` FOREIGN KEY (`baseCurrencyId`) REFERENCES `Currency`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `fxgainlossentry` RENAME INDEX `FxGainLossEntry_currencyId_fkey` TO `FxGainLossEntry_currencyId_idx`;

-- RenameIndex
ALTER TABLE `fxgainlossentry` RENAME INDEX `FxGainLossEntry_journalEntryId_fkey` TO `FxGainLossEntry_journalEntryId_idx`;
