/*
  Warnings:

  - Added the required column `rewardName` to the `Redemption` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Redemption" ADD COLUMN     "rewardName" TEXT NOT NULL;
