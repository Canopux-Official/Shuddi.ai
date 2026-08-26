export type TaskSubmission = {
    id: string;
    userId: string;
    taskId: string;
    status: "STARTED" | "SUBMITTED" | "APPROVED" | "REJECTED";
    evidenceUrls?: string[];
    textResponse?: string;
    mcqAnswer?: string;
    submittedAt: string;
    verifiedAt?: string;
    rejectionReason?: string;
}

export type IndividualTask = {
  id: string;
  taskId: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  category: "SUSTAINABILITY" | "EDUCATION" | "COMMUNITY"; // extend if needed
  verificationType: "IMAGE" | "MCQ" | "TEXT" | "HYBRID";
  isDaily: boolean;
  cooldownDays: number | null;
  taskDuration: number | null;

  requirements: Record<string, any>; // flexible JSON, will need improvement later on

  educationalLink?: string | null;
  factContent?: string | null;

  submissions: TaskSubmission[];
};
//The improvement for requirements is to have a more structured format, maybe something like:
// type ImageRequirement = {
//   description: string;
// };

// type MCQRequirement = {
//   question: string;
//   options: string[];
// };

// type Requirements =
//   | ImageRequirement
//   | MCQRequirement
//   | Record<string, any>;

export type Task = {
  id: string;
  type: "INDIVIDUAL"; // extend if more types later
  title: string;
  description: string;
  baseScore: number;
  isActive: boolean;

  startAt: string | null;
  endAt: string | null;

  createdAt: string;
  updatedAt: string;

  individualTask: IndividualTask;
};

export type TaskListItem = {
  id: string;
  title: string;
  description: string;
  category: "SUSTAINABILITY" | "EDUCATION" | "COMMUNITY";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  points: number;
};

export type TaskDetails = {
  id: string;
  title: string;
  description: string;
  baseScore: number;
  type: "INDIVIDUAL";
  isActive: boolean;
  image: "";
  timeEstimate: string;

  difficulty: "EASY" | "MEDIUM" | "HARD";
  category: "SUSTAINABILITY" | "EDUCATION" | "COMMUNITY";
  verificationType: "IMAGE"  | "TEXT" | "HYBRID"; //removed MCQ for now, need to add it later on.

  requirements: Record<string, any>;
  educationalLink?: string | null;
  factContent?: string | null;

  userStatus: "NOT_STARTED" | "STARTED" | "SUBMITTED" | "APPROVED" | "REJECTED" | "NOT_APPLICABLE";
  submissionId?: string;
  rejectionReason?: string;
  evidenceUrls?: string[];
};

// export type SubmissionStatus = "NOT_STARTED" | "STARTED" | "SUBMITTED" | "APPROVED" | "REJECTED" | "NOT_APPLICABLE"| "COMPLETED";

export type SubmitTaskResponse = {
  submissionId: string;
  status: TaskCompletionStatus; // COMPLETED | REJECTED
};

export type TaskCompletionStatus = "STARTED" | "SUBMITTED" | "COMPLETED" | "UNNDER_VERIFICATION" | "VERIFIED" | "REJECTED" | "REWARD_PROCESSING" | "COMPLETED";

// Mirrors the Prisma `SubmissionStatus` enum exactly.
export type SubmissionStatus =
  | 'STARTED'
  | 'SUBMITTED'
  | 'UNDER_VERIFICATION'
  | 'VERIFIED'
  | 'REJECTED'
  | 'REWARD_PROCESSING'
  | 'COMPLETED'
  | 'COOLDOWN';

// UI needs two extra states the backend doesn't track as a submission:
// - NOT_STARTED: no TaskSubmission row exists yet for this user/task
// - NOT_APPLICABLE: task exists but isn't offered to this user (defensive fallback)
export type TaskUIStatus = 'NOT_STARTED' | SubmissionStatus;

// Shape returned by GET status — extend your existing getStatus() response
// to include these fields so the rejected/cooldown states have something to show.
export interface TaskStatusResponse {
  status: TaskUIStatus;
  rejectionReason?: string | null; // TaskSubmission.rejectionReason
  expiresAt?: string | null; // TaskSubmission.expiresAt — cooldown-until or evidence deadline
  submittedAt?: string | null;
  verifiedAt?: string | null;
}

// For `IndividualTask.requirements Json?` — treat it as a simple checklist.
// Adjust to match however you actually structure that JSON on the backend.
export interface TaskRequirement {
  id: string;
  label: string;
}

// For MCQ verification — `MCQQuestion` model isn't detailed yet, so this is
// a reasonable starting shape. Adjust field names once the API is final.
export interface MCQQuestionOption {
  id: string;
  text: string;
}

export interface MCQQuestion {
  id: string;
  question: string;
  options: MCQQuestionOption[];
}

// answers keyed by question id -> selected option id
export type MCQAnswers = Record<string, string>;