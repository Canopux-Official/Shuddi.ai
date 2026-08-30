export interface PendingVerificationUser {
  id: string;
  email: string;
  username: string | null;
  displayName: string | null;
}

export type TaskVerificationType = "IMAGE" | "TEXT" | "MCQ" | "HYBRID" | "BEFORE_AFTER";

export interface PendingVerificationTask {
  id: string;
  title: string;
  description: string;
  verificationType: TaskVerificationType | null;
  // AI-generated rubric the model used to judge the submission (IndividualTask.prompt)
  rubric: string | null;
}

export interface PendingVerificationEvidence {
  evidenceUrls: string[];
  textResponse: string | null;
  submittedAt: string | null;
}

export interface PendingVerificationItem {
  taskScoreId: string;
  // AI confidence score (30-89 for anything sitting in this queue)
  systemScore: number | null;
  baseScore: number;
  createdAt: string;
  user: PendingVerificationUser;
  task: PendingVerificationTask;
  evidence: PendingVerificationEvidence;
}

export interface VerificationPagination {
  currentPage: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export interface PendingVerificationsResponse {
  success: boolean;
  message: string;
  data: PendingVerificationItem[];
  pagination: VerificationPagination;
}