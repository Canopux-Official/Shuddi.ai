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

export type SubmissionStatus = "NOT_STARTED" | "STARTED" | "SUBMITTED" | "APPROVED" | "REJECTED" | "NOT_APPLICABLE"| "COMPLETED";

export type SubmitTaskResponse = {
  submissionId: string;
  status: TaskCompletionStatus; // COMPLETED | REJECTED
};

export type TaskCompletionStatus = "STARTED" | "SUBMITTED" | "COMPLETED" | "UNNDER_VERIFICATION" | "VERIFIED" | "REJECTED" | "REWARD_PROCESSING" | "COMPLETED";

