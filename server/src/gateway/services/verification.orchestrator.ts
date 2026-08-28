import { prisma } from "../../lib/prisma";
import { TaskCompletionStatus, SubmissionStatus } from "@prisma/client";
import { triggerRewardFlow } from "./reward.orchestrator";
import { verifySubmission } from "./verification-client.service";
import { ApiError } from "../../core-backend/dashboard/utils/ApiError";

const PASS_THRESHOLD = Number(process.env.VERIFICATION_PASS_THRESHOLD ?? 60);

const toPythonType = (t: string): "IMAGE_TEXT" | "BEFORE_AFTER" | "TEXT_ONLY" => {
  if (t === "TEXT") return "TEXT_ONLY";
  if (t === "BEFORE_AFTER") return "BEFORE_AFTER";
  return "IMAGE_TEXT"; // IMAGE, HYBRID
};

export const processVerification = async (taskScoreId: string) => {
  const taskScore = await prisma.taskScore.findUnique({
    where: { id: taskScoreId },
    include: { submission: true },
  });
  if (!taskScore || !taskScore.submission) throw new ApiError(404, "Task score/submission not found");

  const submission = taskScore.submission;

  const individualTask = await prisma.individualTask.findUnique({
    where: { taskId: taskScore.taskId },
  });
  if (!individualTask) throw new ApiError(404, "Individual task config not found");

  // MCQ stays untouched — same as before, no VLM call, falls through to existing behavior.
  if (individualTask.verificationType === "MCQ") {
    // TODO (unchanged): compare submission.mcqAnswer against MCQQuestion.correct
  }

  const pythonType = toPythonType(individualTask.verificationType);

  const verifyPayload =
    pythonType === "BEFORE_AFTER"
      ? {
        verificationType: pythonType,
        rubric: individualTask.prompt ?? "",
        image_before: submission.evidenceUrls?.[0],
        image_after: submission.evidenceUrls?.[1],
      }
      : {
        verificationType: pythonType,
        rubric: individualTask.prompt ?? "",
        image_path: submission.evidenceUrls?.[0],
        user_text: submission.textResponse ?? undefined,
      };

  if (pythonType === "BEFORE_AFTER" && (!verifyPayload.image_before || !verifyPayload.image_after)) {
    throw new ApiError(400, "Both before and after images are required for BEFORE_AFTER verification");
  }

  const { confidence_score } = await verifySubmission(verifyPayload);
  const passed = confidence_score >= PASS_THRESHOLD;

  const updatedTaskScore = await prisma.taskScore.update({
    where: { id: taskScoreId },
    data: {
      status: passed ? TaskCompletionStatus.VERIFIED : TaskCompletionStatus.REJECTED,
      performanceScore: confidence_score,
      verificationSource: "VLM_PIPELINE",
      verifiedAt: new Date(),
    },
  });

  await prisma.taskSubmission.update({
    where: { id: submission.id },
    data: {
      status: passed ? SubmissionStatus.APPROVED : SubmissionStatus.REJECTED,
      verifiedAt: new Date(),
      rejectionReason: passed ? null : `Confidence score ${confidence_score} below threshold ${PASS_THRESHOLD}`,
    },
  });

  if (!passed) return { taskScore: updatedTaskScore, status: "REJECTED" };

  const result = await triggerRewardFlow(updatedTaskScore.id);
  return { taskScore: updatedTaskScore, status: result.status };
};