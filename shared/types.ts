export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface Question {
  text: string;
  options: string[];
  correctAnswerIndex: number;
}
export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}
export interface LeaderboardEntry {
  name: string;
  score: number;
}
export interface QuizSubmission {
  name: string;
  answers: number[]; // Array of selected option indices
}
export interface QuizSubmissionResponse {
  score: number;
  total: number;
  scoreUpdated: boolean;
}