/*
  Warnings:

  - You are about to alter the column `shop_id` on the `shop` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(12)`.

*/
-- AlterTable
ALTER TABLE `shop` MODIFY `shop_id` VARCHAR(12) NOT NULL;
