/*
  Warnings:

  - A unique constraint covering the columns `[userId,taskId,status]` on the table `TaskSubmission` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TaskSubmission_userId_taskId_status_key" ON "TaskSubmission"("userId", "taskId", "status");
