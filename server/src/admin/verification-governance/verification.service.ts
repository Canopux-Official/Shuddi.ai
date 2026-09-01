import prisma from "../../lib/prisma";
import { ApiError } from "../../core-backend/dashboard/utils/ApiError";
import { SubmissionStatus, TaskCompletionStatus } from "@prisma/client";
import { triggerRewardFlow } from "../../gateway/services/reward.orchestrator";

interface GetPendingReviewParams {
  page: number;
  limit: number;
}

/**
 * Everything the AI pipeline scored as "not confident enough either way"
 * (AUTO_REJECT_THRESHOLD <= confidence_score < PASS_THRESHOLD), queued for
 * a super admin to look at along with the evidence the user submitted.
 */
export const getPendingReviewTasksService = async ({
  page,
  limit,
}: GetPendingReviewParams) => {
  const whereClause = {
    status: TaskCompletionStatus.UNDER_VERIFICATION,
  };

  const [taskScores, totalCount] = await Promise.all([
    prisma.taskScore.findMany({
      where: whereClause,

      skip: (page - 1) * limit,
      take: limit,

      // oldest-first so nothing sits in the queue indefinitely
      orderBy: { createdAt: "asc" },

      include: {
        user: {
          include: { profile: true },
        },
        task: {
          include: { individualTask: true },
        },
        submission: true,
      },
    }),

    prisma.taskScore.count({ where: whereClause }),
  ]);

  const items = taskScores.map((ts) => ({
    taskScoreId: ts.id,
    systemScore: ts.systemScore,
    baseScore: ts.baseScore,
    createdAt: ts.createdAt,

    user: {
      id: ts.user.id,
      email: ts.user.email,
      username: ts.user.profile?.username ?? null,
      displayName: ts.user.profile?.displayName ?? null,
    },

    task: {
      id: ts.task.id,
      title: ts.task.title,
      description: ts.task.description,
      verificationType: ts.task.individualTask?.verificationType ?? null,
      rubric: ts.task.individualTask?.prompt ?? null,
    },

    // The actual proof the admin needs to look at to make a call.
    evidence: {
      evidenceUrls: ts.submission?.evidenceUrls ?? [],
      textResponse: ts.submission?.textResponse ?? null,
      submittedAt: ts.submission?.submittedAt ?? null,
    },
  }));

  return {
    items,
    pagination: {
      currentPage: page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
};

const assertPendingReview = async (taskScoreId: string) => {
  const taskScore = await prisma.taskScore.findUnique({
    where: { id: taskScoreId },
    include: { submission: true },
  });

  if (!taskScore) {
    throw new ApiError(404, "Task score not found");
  }

  if (!taskScore.submission) {
    throw new ApiError(404, "Submission not found for this task score");
  }

  if (taskScore.status !== TaskCompletionStatus.UNDER_VERIFICATION) {
    throw new ApiError(
      400,
      `Task score is '${taskScore.status}', not pending human review`
    );
  }

  return taskScore;
};

/**
 * Super admin manually scores a submission (out of 100). This OVERWRITES
 * the AI's performanceScore (the systemScore column keeps the AI's
 * original number for audit purposes) and moves the task into the reward
 * flow, exactly like an auto-pass would have.
 */
export const overrideVerificationScoreService = async (
  taskScoreId: string,
  adminUserId: string,
  score: number
) => {
  if (!Number.isInteger(score) || score < 0 || score > 100) {
    throw new ApiError(400, "Score must be an integer between 0 and 100");
  }

  const taskScore = await assertPendingReview(taskScoreId);

  const updatedTaskScore = await prisma.taskScore.update({
    where: { id: taskScoreId },
    data: {
      status: TaskCompletionStatus.VERIFIED,
      performanceScore: score,
      verificationSource: "HUMAN_ADMIN",
      reviewedBy: adminUserId,
      verifiedAt: new Date(),
    },
  });

  await prisma.taskSubmission.update({
    where: { id: taskScore.submission!.id },
    data: {
      status: SubmissionStatus.APPROVED,
      verifiedAt: new Date(),
      rejectionReason: null,
    },
  });

  const rewardResult = await triggerRewardFlow(updatedTaskScore.id);

  return { taskScore: updatedTaskScore, reward: rewardResult };
};

/**
 * Super admin rejects a submission that was sitting in human review.
 * Mirrors the auto-reject path (< AUTO_REJECT_THRESHOLD), just with a
 * human-authored reason instead of a system-generated one.
 */
export const rejectVerificationService = async (
  taskScoreId: string,
  adminUserId: string,
  reason: string
) => {
  if (!reason || !reason.trim()) {
    throw new ApiError(400, "A rejection reason is required");
  }

  const taskScore = await assertPendingReview(taskScoreId);

  const updatedTaskScore = await prisma.taskScore.update({
    where: { id: taskScoreId },
    data: {
      status: TaskCompletionStatus.REJECTED,
      verificationSource: "HUMAN_ADMIN",
      reviewedBy: adminUserId,
      verifiedAt: new Date(),
    },
  });

  await prisma.taskSubmission.update({
    where: { id: taskScore.submission!.id },
    data: {
      status: SubmissionStatus.REJECTED,
      verifiedAt: new Date(),
      rejectionReason: reason.trim(),
    },
  });

  return { taskScore: updatedTaskScore };
};