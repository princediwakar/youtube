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
  },
  'product-management': {
    videoId: '6uIeL2aV5xI', // Product Management Basics
    questions: [
      {
        id: 'pm1',
        timestamp: 60,
        type: 'mcq',
        text: 'What is the primary role of a Product Manager?',
        options: [
          'To write production code',
          'To define the product vision and strategy',
          'To design the user interface',
          'To run marketing campaigns'
        ],
        correctAnswer: '1',
        hint: 'Think about who decides WHAT to build rather than HOW to build it.',
        remediationTimestamp: 45,
      },
      {
        id: 'pm2',
        timestamp: 180,
        type: 'free-text',
        text: 'What does MVP stand for in product development?',
        correctAnswer: 'minimum viable product',
        hint: 'It is the most basic version of a product that can be released.',
        remediationTimestamp: 160,
      }
    ]
  },
  'agentic-workflows': {
    videoId: 'tLJDETq54r8', // AI Agents Explained
    questions: [
      {
        id: 'aw1',
        timestamp: 90,
        type: 'mcq',
        text: 'Which pattern involves multiple agents working together on a task?',
        options: [
          'Reflection',
          'Tool Use',
          'Planning',
          'Multi-agent Collaboration'
        ],
        correctAnswer: '3',
        hint: 'The name implies more than one agent.',
        remediationTimestamp: 75,
      },
      {
        id: 'aw2',
        timestamp: 240,
        type: 'free-text',
        text: 'Explain the concept of an "Agent" in AI.',
        correctAnswer: 'action',
        hint: 'Think about systems that can perceive their environment and take actions.',
        remediationTimestamp: 220,
      }
    ]
  },
  'health-fitness': {
    videoId: 'v7AYKMP6rOE', // Workout Basics
    questions: [
      {
        id: 'hf1',
        timestamp: 120,
        type: 'mcq',
        text: 'What is the recommended frequency for strength training per week?',
        options: [
          '1 day',
          '2-3 days',
          '5 days',
          'Every day'
        ],
        correctAnswer: '1',
        hint: 'Muscles need time to recover, but consistency is key.',
        remediationTimestamp: 100,
      },
      {
        id: 'hf2',
        timestamp: 300,
        type: 'free-text',
        text: 'Why is protein important for fitness?',
        correctAnswer: 'recovery',
        hint: 'It helps rebuild muscle tissue after a workout.',
        remediationTimestamp: 280,
      }
    ]
  }
};
