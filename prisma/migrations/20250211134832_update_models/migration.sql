-- CreateTable
CREATE TABLE "Teacher" (
    "id" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "activityType" TEXT NOT NULL DEFAULT 'theory',
    "birthDate" TIMESTAMP(3),
    "birthPlace" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "licenseSeries" TEXT,
    "licenseNumber" TEXT,
    "licenseIssueDate" TIMESTAMP(3),
    "snils" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_snils_key" ON "Teacher"("snils");

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
