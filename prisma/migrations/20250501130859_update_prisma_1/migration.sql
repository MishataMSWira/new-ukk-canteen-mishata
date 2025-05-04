/*
  Warnings:

  - You are about to drop the column `id_siswa` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `id_stan` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `Users_id_siswa_fkey`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `Users_id_stan_fkey`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `id_siswa`,
    DROP COLUMN `id_stan`;

-- AddForeignKey
ALTER TABLE `Stan` ADD CONSTRAINT `Stan_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Siswa` ADD CONSTRAINT `Siswa_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
