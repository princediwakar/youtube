import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DomainContent } from '@/types';

interface AppState {
  isFlowMode: boolean;
  masteryScore: number;
  selectedDomain: string | null;
  currentSyllabus: DomainContent | null;
  isGenerating: boolean;
  theme: string;
  toggleFlowMode: () => void;
  incrementMastery: () => void;
  decrementMastery: () => void;
  setSelectedDomain: (domain: string) => void;
  setCurrentSyllabus: (syllabus: DomainContent) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setTheme: (theme: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set: any): AppState => ({
      isFlowMode: false,
      masteryScore: 0,
      selectedDomain: null,
      currentSyllabus: null,
      isGenerating: false,
      theme: 'star-chart',
      toggleFlowMode: () => set((state: any) => ({ isFlowMode: !state.isFlowMode })),
      incrementMastery: () => set((state: any) => ({ masteryScore: state.masteryScore + 10 })),
      decrementMastery: () => set((state: any) => ({ masteryScore: Math.max(0, state.masteryScore - 5) })),
      setSelectedDomain: (domain: string) => set({ selectedDomain: domain }),
      setCurrentSyllabus: (syllabus: DomainContent) => set({ currentSyllabus: syllabus }),
      setIsGenerating: (isGenerating: boolean) => set({ isGenerating }),
      setTheme: (theme: string) => set({ theme }),
    }),
    {
      name: 'zentube-storage',
    }
  )
);
