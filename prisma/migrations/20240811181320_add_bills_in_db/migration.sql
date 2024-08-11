-- CreateTable
CREATE TABLE `bills` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bill_ID` VARCHAR(255) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `ordertype` VARCHAR(20) NOT NULL,
    `Date_times` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `statusOrder` VARCHAR(20) NOT NULL,
    `customerName` VARCHAR(255) NOT NULL,
    `queueNumber` VARCHAR(3) NOT NULL,
    `messengerId` VARCHAR(255) NOT NULL,
    `timeOrder` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
