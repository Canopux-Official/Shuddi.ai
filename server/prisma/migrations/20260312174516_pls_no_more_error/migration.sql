/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Redemption` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[rewardId]` on the table `Redemption` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `rewardId` to the `Redemption` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Redemption" ADD COLUMN     "rewardId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Reward" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "icon" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reward_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Redemption_userId_key" ON "Redemption"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Redemption_rewardId_key" ON "Redemption"("rewardId");

-- AddForeignKey
ALTER TABLE "Redemption" ADD CONSTRAINT "Redemption_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Redemption" ADD CONSTRAINT "Redemption_rewardId_fkey" FOREIGN KEY ("rewardId") REFERENCES "Reward"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
