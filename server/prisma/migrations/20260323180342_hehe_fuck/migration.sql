/*
  Warnings:

  - The `mcqAnswer` column on the `TaskSubmission` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ProofType" AS ENUM ('PROOF', 'MCQ', 'MIXED');

-- AlterTable
ALTER TABLE "IndividualTask" ADD COLUMN     "type" "ProofType" NOT NULL DEFAULT 'PROOF';

-- AlterTable
ALTER TABLE "TaskSubmission" DROP COLUMN "mcqAnswer",
ADD COLUMN     "mcqAnswer" JSONB;

-- CreateTable
CREATE TABLE "MCQQuestion" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "options" TEXT[],
    "correct" TEXT NOT NULL,

    CONSTRAINT "MCQQuestion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MCQQuestion" ADD CONSTRAINT "MCQQuestion_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "IndividualTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;
