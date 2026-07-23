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

export const domains: Record<string, DomainContent> = {
  coding: {
    videoId: 'hdI2bqOjy3c', // JavaScript Crash Course
    questions: [
      {
        id: 'q1',
        timestamp: 60,
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
        remediationTimestamp: 45,
      },
      {
        id: 'q2',
        timestamp: 300,
        type: 'free-text',
        text: 'Explain the difference between let and const in your own words.',
        correctAnswer: 'reassign',
        hint: 'One allows the variable to be changed later, the other is constant.',
        remediationTimestamp: 285,
      }
    ]
  },
  cooking: {
    videoId: 'PUP7U5vTZM0', // Scrambled Eggs
    questions: [
      {
        id: 'q3',
        timestamp: 30,
        type: 'mcq',
        text: 'What is the most important rule for the pan temperature?',
        options: [
          'Keep it constantly on high heat',
          'Take it on and off the heat to control temperature',
          'Keep it on low heat the whole time',
          'Put it in the oven halfway through'
        ],
        correctAnswer: '1',
        hint: 'Think about how to prevent the eggs from overcooking quickly.',
        remediationTimestamp: 15,
      }
    ]
  },
  history: {
    videoId: 'dYpAW8M-4K8', // WWI
    questions: [
      {
        id: 'q4',
        timestamp: 45,
        type: 'mcq',
        text: 'Whose assassination triggered the start of WWI?',
        options: [
          'Archduke Franz Ferdinand',
          'Kaiser Wilhelm II',
          'Tsar Nicholas II',
          'Woodrow Wilson'
        ],
        correctAnswer: '0',
        hint: 'He was the heir to the Austro-Hungarian throne.',
        remediationTimestamp: 30,
      }
    ]
  }
};
