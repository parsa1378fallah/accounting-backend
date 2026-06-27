/*
  Warnings:

  - You are about to drop the column `gainLossType` on the `fxgainlossentry` table. All the data in the column will be lost.
  - You are about to drop the column `sourceCurrencyCode` on the `fxgainlossentry` table. All the data in the column will be lost.
  - Added the required column `direction` to the `FxGainLossEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entryType` to the `FxGainLossEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `fxgainlossentry` DROP COLUMN `gainLossType`,
    DROP COLUMN `sourceCurrencyCode`,
    ADD COLUMN `direction` ENUM('GAIN', 'LOSS') NOT NULL,
    ADD COLUMN `entryType` ENUM('REALIZED', 'UNREALIZED') NOT NULL;

-- CreateIndex
CREATE INDEX `FxGainLossEntry_entryType_idx` ON `FxGainLossEntry`(`entryType`);

-- CreateIndex
CREATE INDEX `FxGainLossEntry_direction_idx` ON `FxGainLossEntry`(`direction`);

-- CreateIndex
CREATE INDEX `FxGainLossEntry_referenceType_referenceId_idx` ON `FxGainLossEntry`(`referenceType`, `referenceId`);

-- RenameIndex
ALTER TABLE `fxgainlossentry` RENAME INDEX `FxGainLossEntry_baseCurrencyId_fkey` TO `FxGainLossEntry_baseCurrencyId_idx`;
