import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DomainContent } from '@/types';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AppState {
  isFlowMode: boolean;
  score: number;
  selectedDomain: string | null;
  currentSyllabus: DomainContent | null;
  isGenerating: boolean;
  isGeneratingQuestions: boolean;
  theme: string;
  isTutorModeActive: boolean;
  tutorChatHistory: ChatMessage[];
  
  toggleFlowMode: () => void;
  incrementScore: () => void;
  setSelectedDomain: (domain: string) => void;
  setCurrentSyllabus: (syllabus: DomainContent) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setIsGeneratingQuestions: (isGeneratingQuestions: boolean) => void;
  setTheme: (theme: string) => void;
  setIsTutorModeActive: (active: boolean) => void;
  addTutorMessage: (message: ChatMessage) => void;
  clearTutorChat: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set: any): AppState => ({
      isFlowMode: false,
      score: 0,
      selectedDomain: null,
      currentSyllabus: null,
      isGenerating: false,
      isGeneratingQuestions: false,
      theme: 'star-chart',
      isTutorModeActive: false,
      tutorChatHistory: [],
      
      toggleFlowMode: () => set((state: any) => ({ isFlowMode: !state.isFlowMode })),
      incrementScore: () => set((state: any) => ({ score: state.score + 1 })),
      setSelectedDomain: (domain: string) => set({ selectedDomain: domain }),
      setCurrentSyllabus: (syllabus: DomainContent) => set({ currentSyllabus: syllabus }),
      setIsGenerating: (isGenerating: boolean) => set({ isGenerating }),
      setIsGeneratingQuestions: (isGeneratingQuestions: boolean) => set({ isGeneratingQuestions }),
      setTheme: (theme: string) => set({ theme }),
      setIsTutorModeActive: (active: boolean) => set({ isTutorModeActive: active }),
      addTutorMessage: (message: ChatMessage) => set((state: any) => ({ tutorChatHistory: [...state.tutorChatHistory, message] })),
      clearTutorChat: () => set({ tutorChatHistory: [] }),
    }),
    {
      name: 'zentube-storage',
    }
  )
);
