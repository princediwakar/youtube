export interface Question {
  id: string;
  timestamp: number; // when to interrupt (in seconds)
  type: 'mcq' | 'free-text' | 'code';
  text: string;
  options?: string[];
  correctAnswer: string; // string match or index (as string)
  hint: string;
  remediationTimestamp: number; // where to rewind to if they fail
  codeSnippet?: string; // used for 'code' type questions
}

export interface DomainContent {
  videoId: string;
  title?: string;
  summaryNotes?: string;
  nextRecommendedQuery?: string;
  questions: Question[];
}
