/*
  Warnings:

  - A unique constraint covering the columns `[kode_verifikasi]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Made the column `kode_verifikasi` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `kode_verifikasi` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Users_kode_verifikasi_key` ON `Users`(`kode_verifikasi`);
