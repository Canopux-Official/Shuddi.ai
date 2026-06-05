/*
  Warnings:

  - You are about to drop the column `city` on the `CommunityTask` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `CommunityTask` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `CommunityTask` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ngoId,userId]` on the table `NGOMember` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `areaId` to the `CommunityTask` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ngoId` to the `CommunityTask` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'DELETED');

-- AlterEnum
ALTER TYPE "MembershipStatus" ADD VALUE 'REMOVED';

-- DropIndex
DROP INDEX "NGOMember_userId_key";

-- AlterTable
ALTER TABLE "CommunityTask" DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "state",
ADD COLUMN     "areaId" TEXT NOT NULL,
ADD COLUMN     "ngoId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "areaId" TEXT,
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateIndex
CREATE UNIQUE INDEX "NGOMember_ngoId_userId_key" ON "NGOMember"("ngoId", "userId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityTask" ADD CONSTRAINT "CommunityTask_ngoId_fkey" FOREIGN KEY ("ngoId") REFERENCES "NGO"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityTask" ADD CONSTRAINT "CommunityTask_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE CASCADE ON UPDATE CASCADE;
