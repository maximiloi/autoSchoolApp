/*
  Warnings:

  - You are about to alter the column `inn` on the `Company` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(10)`.
  - You are about to alter the column `kpp` on the `Company` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(9)`.
  - You are about to alter the column `ogrn` on the `Company` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(13)`.
  - You are about to alter the column `account` on the `Company` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(20)`.
  - You are about to alter the column `bik` on the `Company` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(9)`.
  - You are about to alter the column `correspondentAccount` on the `Company` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(20)`.

*/
-- DropIndex
DROP INDEX "Company_website_key";

-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "inn" SET DATA TYPE CHAR(10),
ALTER COLUMN "kpp" SET DATA TYPE CHAR(9),
ALTER COLUMN "ogrn" SET DATA TYPE CHAR(13),
ALTER COLUMN "actualAddress" DROP NOT NULL,
ALTER COLUMN "account" SET DATA TYPE CHAR(20),
ALTER COLUMN "bik" SET DATA TYPE CHAR(9),
ALTER COLUMN "correspondentAccount" SET DATA TYPE CHAR(20),
ALTER COLUMN "directorPatronymic" DROP NOT NULL,
ALTER COLUMN "accountantSurname" DROP NOT NULL,
ALTER COLUMN "accountantName" DROP NOT NULL,
ALTER COLUMN "accountantPatronymic" DROP NOT NULL,
ALTER COLUMN "website" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" ALTER COLUMN "birthDate" SET DATA TYPE TEXT,
ALTER COLUMN "birthPlace" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "licenseIssueDate" SET DATA TYPE TEXT,
ALTER COLUMN "snils" DROP NOT NULL;
