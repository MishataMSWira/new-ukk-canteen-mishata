/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `users` ALTER COLUMN `username` DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX `Users_username_key` ON `Users`(`username`);
