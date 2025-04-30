-- AlterTable
ALTER TABLE `diskon` ADD COLUMN `id_stan` INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `Diskon` ADD CONSTRAINT `Diskon_id_stan_fkey` FOREIGN KEY (`id_stan`) REFERENCES `Stan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
