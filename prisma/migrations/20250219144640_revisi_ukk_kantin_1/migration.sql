/*
  Warnings:

  - Added the required column `id_siswa` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_stan` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `siswa` DROP FOREIGN KEY `Siswa_id_user_fkey`;

-- DropForeignKey
ALTER TABLE `stan` DROP FOREIGN KEY `Stan_id_user_fkey`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `id_siswa` INTEGER NOT NULL,
    ADD COLUMN `id_stan` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_id_stan_fkey` FOREIGN KEY (`id_stan`) REFERENCES `Stan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_id_siswa_fkey` FOREIGN KEY (`id_siswa`) REFERENCES `Siswa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
