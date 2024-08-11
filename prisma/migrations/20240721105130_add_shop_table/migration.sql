/*
  Warnings:

  - You are about to drop the `services` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `services`;

-- CreateTable
CREATE TABLE `shop` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shop_id` VARCHAR(255) NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    `creted` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `photo` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
