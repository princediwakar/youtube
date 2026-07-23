export interface Question {
  id: string;
  timestamp: number; // when to interrupt (in seconds)
  type: 'mcq' | 'free-text';
  text: string;
  options?: string[];
  correctAnswer: string; // string match or index (as string)
  hint: string;
  remediationTimestamp: number; // where to rewind to if they fail
}

export interface DomainContent {
  videoId: string;
  questions: Question[];
}
