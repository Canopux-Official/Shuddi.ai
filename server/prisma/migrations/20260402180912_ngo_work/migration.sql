/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `NGOMember` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `NGOMember` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('REGISTRATION_CERTIFICATE', 'PAN_CARD', 'ADDRESS_PROOF', 'AUTHORIZATION_LETTER', 'OTHER');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "NGOMember" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "NGOApplication" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "areaId" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NGOApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NGODocument" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL,
    "url" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NGODocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NGOMember_userId_key" ON "NGOMember"("userId");

-- AddForeignKey
ALTER TABLE "NGOMember" ADD CONSTRAINT "NGOMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NGOApplication" ADD CONSTRAINT "NGOApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NGOApplication" ADD CONSTRAINT "NGOApplication_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NGODocument" ADD CONSTRAINT "NGODocument_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "NGOApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
