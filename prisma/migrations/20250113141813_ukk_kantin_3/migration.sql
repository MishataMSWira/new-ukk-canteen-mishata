/*
  Warnings:

  - Added the required column `updatedAt` to the `DetailTransaksi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Diskon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Menu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `MenuDiskon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Siswa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Stan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Transaksi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `detailtransaksi` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `diskon` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `menu` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `menudiskon` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `siswa` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `stan` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `transaksi` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('admin', 'user') NOT NULL DEFAULT 'admin';
