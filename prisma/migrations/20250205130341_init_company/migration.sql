-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "license" TEXT NOT NULL,
    "inn" TEXT NOT NULL,
    "kpp" TEXT NOT NULL,
    "ogrn" TEXT,
    "legalAddress" TEXT NOT NULL,
    "actualAddress" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "bank" TEXT NOT NULL,
    "account" TEXT NOT NULL,
    "bik" TEXT NOT NULL,
    "correspondentAccount" TEXT NOT NULL,
    "directorSurname" TEXT NOT NULL,
    "directorName" TEXT NOT NULL,
    "directorPatronymic" TEXT NOT NULL,
    "accountantSurname" TEXT NOT NULL,
    "accountantName" TEXT NOT NULL,
    "accountantPatronymic" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "website" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_inn_key" ON "Company"("inn");

-- CreateIndex
CREATE UNIQUE INDEX "Company_email_key" ON "Company"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Company_website_key" ON "Company"("website");
