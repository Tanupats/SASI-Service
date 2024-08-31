/*
  Warnings:

  - You are about to drop the column `bill_ID` on the `billsdetail` table. All the data in the column will be lost.
  - Added the required column `bills_id` to the `billsdetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `billsdetail` DROP COLUMN `bill_ID`,
    ADD COLUMN `bills_id` VARCHAR(255) NOT NULL;
