/*
  Warnings:

  - A unique constraint covering the columns `[submissionId]` on the table `TaskScore` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "SubmissionStatus" ADD VALUE 'COOLDOWN';

-- AlterEnum
ALTER TYPE "TaskCompletionStatus" ADD VALUE 'COOLDOWN';

-- DropIndex
DROP INDEX "TaskScore_userId_taskId_key";

-- DropIndex
DROP INDEX "TaskSubmission_userId_taskId_key";

-- AlterTable
ALTER TABLE "IndividualTask" ADD COLUMN     "cooldownDays" INTEGER,
ADD COLUMN     "isDaily" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "taskDuration" INTEGER;

-- AlterTable
ALTER TABLE "TaskScore" ADD COLUMN     "submissionId" TEXT;

-- AlterTable
ALTER TABLE "TaskSubmission" ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "TaskScore_submissionId_key" ON "TaskScore"("submissionId");

-- AddForeignKey
ALTER TABLE "TaskScore" ADD CONSTRAINT "TaskScore_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "TaskSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
