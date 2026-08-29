-- AlterEnum
ALTER TYPE "SubmissionStatus" ADD VALUE 'UNDER_VERIFICATION';

-- AlterTable
ALTER TABLE "TaskScore" ADD COLUMN     "systemScore" INTEGER,
ADD COLUMN     "reviewedBy" TEXT;
