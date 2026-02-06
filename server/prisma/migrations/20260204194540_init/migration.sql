-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('INDIVIDUAL', 'COMMUNITY');

-- CreateEnum
CREATE TYPE "TaskCompletionStatus" AS ENUM ('STARTED', 'SUBMITTED', 'UNDER_VERIFICATION', 'VERIFIED', 'REJECTED', 'REWARD_PROCESSING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('REGISTERED', 'SUBMITTED', 'UNDER_VERIFICATION', 'COMPLETED', 'REJECTED');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "TaskCategory" AS ENUM ('SUSTAINABILITY', 'EDUCATION', 'COMMUNITY');

-- CreateEnum
CREATE TYPE "TaskVerificationType" AS ENUM ('IMAGE', 'TEXT', 'MCQ', 'HYBRID');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('STARTED', 'SUBMITTED', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('REWARD_EARNED', 'REDEMPTION', 'ADMIN_ADJUSTMENT');

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "type" "TaskType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "baseScore" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startAt" TIMESTAMP(3),
    "endAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndividualTask" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL DEFAULT 'EASY',
    "category" "TaskCategory" NOT NULL DEFAULT 'SUSTAINABILITY',
    "verificationType" "TaskVerificationType" NOT NULL,
    "requirements" JSONB,
    "educationalLink" TEXT,
    "factContent" TEXT,

    CONSTRAINT "IndividualTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityTask" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "maxParticipants" INTEGER,
    "minParticipants" INTEGER,
    "locationName" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,

    CONSTRAINT "CommunityTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityTaskRegistration" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'REGISTERED',
    "completionConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "supervisorNote" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunityTaskRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskScore" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "status" "TaskCompletionStatus" NOT NULL DEFAULT 'STARTED',
    "baseScore" INTEGER NOT NULL,
    "performanceScore" INTEGER NOT NULL DEFAULT 0,
    "totalScore" INTEGER NOT NULL,
    "verificationSource" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "rewardedAt" TIMESTAMP(3),

    CONSTRAINT "TaskScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskSubmission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'STARTED',
    "evidenceUrls" TEXT[],
    "textResponse" TEXT,
    "mcqAnswer" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,

    CONSTRAINT "TaskSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RewardLedger" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taskScoreId" TEXT,
    "amount" DECIMAL(10,2) NOT NULL,
    "type" "TransactionType" NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RewardLedger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Redemption" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Redemption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IndividualTask_taskId_key" ON "IndividualTask"("taskId");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityTask_taskId_key" ON "CommunityTask"("taskId");

-- CreateIndex
CREATE INDEX "CommunityTaskRegistration_status_idx" ON "CommunityTaskRegistration"("status");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityTaskRegistration_taskId_userId_key" ON "CommunityTaskRegistration"("taskId", "userId");

-- CreateIndex
CREATE INDEX "TaskScore_userId_idx" ON "TaskScore"("userId");

-- CreateIndex
CREATE INDEX "TaskScore_taskId_idx" ON "TaskScore"("taskId");

-- CreateIndex
CREATE INDEX "TaskScore_status_idx" ON "TaskScore"("status");

-- CreateIndex
CREATE UNIQUE INDEX "TaskScore_userId_taskId_key" ON "TaskScore"("userId", "taskId");

-- CreateIndex
CREATE UNIQUE INDEX "TaskSubmission_userId_taskId_key" ON "TaskSubmission"("userId", "taskId");

-- CreateIndex
CREATE UNIQUE INDEX "RewardLedger_taskScoreId_key" ON "RewardLedger"("taskScoreId");

-- AddForeignKey
ALTER TABLE "IndividualTask" ADD CONSTRAINT "IndividualTask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityTask" ADD CONSTRAINT "CommunityTask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityTaskRegistration" ADD CONSTRAINT "CommunityTaskRegistration_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "CommunityTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityTaskRegistration" ADD CONSTRAINT "CommunityTaskRegistration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskScore" ADD CONSTRAINT "TaskScore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskScore" ADD CONSTRAINT "TaskScore_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskSubmission" ADD CONSTRAINT "TaskSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskSubmission" ADD CONSTRAINT "TaskSubmission_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "IndividualTask"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewardLedger" ADD CONSTRAINT "RewardLedger_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewardLedger" ADD CONSTRAINT "RewardLedger_taskScoreId_fkey" FOREIGN KEY ("taskScoreId") REFERENCES "TaskScore"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Redemption" ADD CONSTRAINT "Redemption_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
