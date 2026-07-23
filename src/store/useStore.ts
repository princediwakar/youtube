import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  isFlowMode: boolean;
  masteryScore: number;
  toggleFlowMode: () => void;
  incrementMastery: () => void;
  decrementMastery: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set: any): AppState => ({
      isFlowMode: false,
      masteryScore: 0,
      toggleFlowMode: () => set((state: any) => ({ isFlowMode: !state.isFlowMode })),
      incrementMastery: () => set((state: any) => ({ masteryScore: state.masteryScore + 10 })),
      decrementMastery: () => set((state: any) => ({ masteryScore: Math.max(0, state.masteryScore - 5) })),
    }),
    {
      name: 'zentube-storage',
    }
  )
);
