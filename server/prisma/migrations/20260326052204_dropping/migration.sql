/*
  Warnings:

  - You are about to drop the column `type` on the `IndividualTask` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "TaskSubmission_userId_taskId_status_key";

-- AlterTable
ALTER TABLE "IndividualTask" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "TaskScore" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "TaskScore_userId_taskId_createdAt_idx" ON "TaskScore"("userId", "taskId", "createdAt");
