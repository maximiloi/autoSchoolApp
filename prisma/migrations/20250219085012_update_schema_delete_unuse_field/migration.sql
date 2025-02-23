/*
  Warnings:

  - You are about to drop the column `licenseNumber` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `licenseSeries` on the `Student` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[groupNumber]` on the table `Group` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "licenseNumber",
DROP COLUMN "licenseSeries",
ADD COLUMN     "filledInData" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Group_groupNumber_key" ON "Group"("groupNumber");
