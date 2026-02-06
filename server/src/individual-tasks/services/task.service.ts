import { ApiError } from "../../dashboard/utils/ApiError";
import * as TaskFunctions from "../functions/tasks";

export const getTaskDetails = async (taskId: string, userId: string) => {
  const task = await TaskFunctions.getTaskById(taskId, userId);
  
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (!task.individualTask) {
    return {
      ...task,
      type: task.type,
      userStatus: "NOT_APPLICABLE", 
    };
  }

  const currentSubmission = task.individualTask.submissions[0];

  return {
    id: task.id,
    title: task.title,
    description: task.description,
    baseScore: task.baseScore,
    type: task.type,
    
    difficulty: task.individualTask.difficulty,
    category: task.individualTask.category,
    verificationType: task.individualTask.verificationType,
    requirements: task.individualTask.requirements,
    educationalLink: task.individualTask.educationalLink,
    factContent: task.individualTask.factContent,

    userStatus: currentSubmission?.status || "NOT_STARTED",
    submissionId: currentSubmission?.id,
    rejectionReason: currentSubmission?.rejectionReason, 
    evidenceUrls: currentSubmission?.evidenceUrls,
  };
};

export const startTask = async (taskId: string, userId: string) => {
  const existing = await TaskFunctions.findActiveSubmission(taskId, userId);
  if (existing) {
    return existing; 
  }
  return await TaskFunctions.createSubmission(taskId, userId);
};

export const submitEvidence = async (
  taskId: string, 
  userId: string, 
  data: { 
    evidenceUrls?: string[]; 
    textResponse?: string;
    mcqAnswer?: string; 
  }
) => {
  const submission = await TaskFunctions.findActiveSubmission(taskId, userId);
  
  if (!submission) {
    throw new ApiError(400, "Task not started");
  }

  if (submission.status === "APPROVED") {
    throw new ApiError(400, "Task already completed");
  }

  return await TaskFunctions.updateSubmissionEvidence(submission.id, data);
};