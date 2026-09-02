export interface Task {
  id: string;
  title: string;
  description: string;
  points: number;
  steps: string[];
  verificationType: 'IMAGE' | 'TEXT' | 'HYBRID' | 'MCQ' | 'BEFORE_AFTER';
  educationalLink?: string;
  factContent?: string;
  userStatus: 'NOT_STARTED' | 'STARTED' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
}