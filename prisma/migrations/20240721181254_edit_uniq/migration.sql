/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `shop` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `shop_user_id_key` ON `shop`(`user_id`);
