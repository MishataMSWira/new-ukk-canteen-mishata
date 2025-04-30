-- CreateTable
CREATE TABLE `Users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL DEFAULT '',
    `password` VARCHAR(191) NOT NULL DEFAULT '',
    `role` ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Stan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_stan` VARCHAR(191) NOT NULL DEFAULT '',
    `nama_pemilik` VARCHAR(191) NOT NULL DEFAULT '',
    `telp` VARCHAR(191) NOT NULL DEFAULT '',
    `id_user` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Siswa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_siswa` VARCHAR(191) NOT NULL DEFAULT '',
    `alamat` VARCHAR(191) NOT NULL DEFAULT '',
    `telp` VARCHAR(191) NOT NULL DEFAULT '',
    `foto` VARCHAR(191) NOT NULL DEFAULT '',
    `id_user` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Menu` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_makanan` VARCHAR(191) NOT NULL DEFAULT '',
    `jenis` ENUM('makanan', 'minuman') NOT NULL DEFAULT 'makanan',
    `harga` DOUBLE NOT NULL DEFAULT 0,
    `foto` VARCHAR(191) NOT NULL DEFAULT '',
    `deskripsi` VARCHAR(191) NOT NULL DEFAULT '',
    `id_stan` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Diskon` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_diskon` VARCHAR(191) NOT NULL DEFAULT '',
    `persentase_diskon` DOUBLE NOT NULL DEFAULT 0,
    `tanggal_awal` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `tanggal_akhir` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MenuDiskon` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_menu` INTEGER NOT NULL DEFAULT 0,
    `id_diskon` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transaksi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tanggal` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `id_stan` INTEGER NOT NULL DEFAULT 0,
    `id_siswa` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('belum_dikonfirmasi', 'dimasak', 'diantar', 'sampai') NOT NULL DEFAULT 'belum_dikonfirmasi',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DetailTransaksi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_transaksi` INTEGER NOT NULL DEFAULT 0,
    `id_menu` INTEGER NOT NULL DEFAULT 0,
    `qty` INTEGER NOT NULL DEFAULT 0,
    `harga_beli` DOUBLE NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Stan` ADD CONSTRAINT `Stan_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Siswa` ADD CONSTRAINT `Siswa_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Menu` ADD CONSTRAINT `Menu_id_stan_fkey` FOREIGN KEY (`id_stan`) REFERENCES `Stan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MenuDiskon` ADD CONSTRAINT `MenuDiskon_id_menu_fkey` FOREIGN KEY (`id_menu`) REFERENCES `Menu`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MenuDiskon` ADD CONSTRAINT `MenuDiskon_id_diskon_fkey` FOREIGN KEY (`id_diskon`) REFERENCES `Diskon`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaksi` ADD CONSTRAINT `Transaksi_id_stan_fkey` FOREIGN KEY (`id_stan`) REFERENCES `Stan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaksi` ADD CONSTRAINT `Transaksi_id_siswa_fkey` FOREIGN KEY (`id_siswa`) REFERENCES `Siswa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailTransaksi` ADD CONSTRAINT `DetailTransaksi_id_transaksi_fkey` FOREIGN KEY (`id_transaksi`) REFERENCES `Transaksi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailTransaksi` ADD CONSTRAINT `DetailTransaksi_id_menu_fkey` FOREIGN KEY (`id_menu`) REFERENCES `Menu`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
