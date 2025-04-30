/*
  Warnings:

  - A unique constraint covering the columns `[id_user]` on the table `Siswa` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_user]` on the table `Stan` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_stan]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_siswa]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `Users_id_siswa_fkey`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `Users_id_stan_fkey`;

-- DropIndex
DROP INDEX `Siswa_id_user_fkey` ON `siswa`;

-- DropIndex
DROP INDEX `Stan_id_user_fkey` ON `stan`;

-- AlterTable
ALTER TABLE `siswa` MODIFY `id_user` INTEGER NULL;

-- AlterTable
ALTER TABLE `stan` MODIFY `id_user` INTEGER NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `id_siswa` INTEGER NULL,
    MODIFY `id_stan` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Siswa_id_user_key` ON `Siswa`(`id_user`);

-- CreateIndex
CREATE UNIQUE INDEX `Stan_id_user_key` ON `Stan`(`id_user`);

-- CreateIndex
CREATE UNIQUE INDEX `Users_id_stan_key` ON `Users`(`id_stan`);

-- CreateIndex
CREATE UNIQUE INDEX `Users_id_siswa_key` ON `Users`(`id_siswa`);

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_id_stan_fkey` FOREIGN KEY (`id_stan`) REFERENCES `Stan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_id_siswa_fkey` FOREIGN KEY (`id_siswa`) REFERENCES `Siswa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
