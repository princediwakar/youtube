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

export const DEMO_VIDEO_ID = 'hdI2bqOjy3c'; // JavaScript Crash Course For Beginners

export const mockQuestions: Question[] = [
  {
    id: 'q1',
    timestamp: 60, // Interrupt at 1 minute
    type: 'mcq',
    text: 'What is the primary purpose of console.log?',
    options: [
      'To change styles on the webpage',
      'To print messages to the debugging console',
      'To save data permanently',
      'To stop the execution of a script'
    ],
    correctAnswer: '1',
    hint: 'Think about where developers look to find output messages when testing.',
    remediationTimestamp: 45, // Rewind ~15 seconds
  },
  {
    id: 'q2',
    timestamp: 300, // Interrupt at 5 minutes
    type: 'free-text',
    text: 'Explain the difference between let and const in your own words.',
    correctAnswer: 'reassign', // Keyword based grading for mock
    hint: 'One allows the variable to be changed later, the other is constant.',
    remediationTimestamp: 285, // Rewind ~15 seconds
  }
];
