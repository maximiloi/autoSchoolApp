-- DropForeignKey
ALTER TABLE "Teacher" DROP CONSTRAINT "Teacher_companyId_fkey";

-- DropIndex
DROP INDEX "Teacher_snils_key";

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
