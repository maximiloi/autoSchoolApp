-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "gender" TEXT,
    "phone" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "birthPlace" TEXT,
    "registrationAddress" TEXT,
    "actualAddress" TEXT,
    "documentType" TEXT,
    "documentIssuer" TEXT,
    "documentCode" TEXT,
    "documentSeries" TEXT,
    "documentNumber" TEXT,
    "documentIssueDate" TIMESTAMP(3),
    "medicalSeries" TEXT,
    "medicalNumber" TEXT,
    "medicalIssueDate" TIMESTAMP(3),
    "medicalIssuer" TEXT,
    "license" TEXT,
    "licenseSeries" TEXT,
    "licenseNumber" TEXT,
    "region" TEXT,
    "medicalRestriction" TEXT,
    "allowedCategories" TEXT,
    "trainingCost" DECIMAL(65,30) NOT NULL,
    "snils" TEXT,
    "groupId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
