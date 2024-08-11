-- CreateTable
CREATE TABLE `billsdetail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bill_ID` VARCHAR(255) NOT NULL,
    `foodname` VARCHAR(255) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `note` VARCHAR(50) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `foodmenu` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(255) NOT NULL,
    `foodname` VARCHAR(225) NOT NULL,
    `Price` DECIMAL(10, 2) NULL,
    `img` TEXT NOT NULL,
    `TypeID` INTEGER NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `services` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pathName` VARCHAR(255) NOT NULL,
    `methods` VARCHAR(20) NOT NULL,
    `dataModel` VARCHAR(255) NOT NULL,
    `queryData` VARCHAR(255) NOT NULL,
    `params` VARCHAR(255) NULL,
    `fields` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `account` (
    `account_id` INTEGER NOT NULL AUTO_INCREMENT,
    `date_account` DATE NOT NULL,
    `listname` VARCHAR(255) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `Price` DECIMAL(10, 2) NOT NULL,
    `total` INTEGER NOT NULL,

    PRIMARY KEY (`account_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `menu_type` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `department` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
