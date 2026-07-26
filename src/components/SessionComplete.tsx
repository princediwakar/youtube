"use client";

import React, { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Trophy, Flame, Play, Sparkles, Search } from 'lucide-react';

export default function SessionComplete() {
  const { score, streak, currentSyllabus, incrementStreak, setSelectedDomain, setCurrentSyllabus } = useStore();
  const nextQuery = currentSyllabus?.nextRecommendedQuery;

  useEffect(() => {
    incrementStreak();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleWatchNext = () => {
    if (!nextQuery) return;
    // Clear current syllabus so Onboarding auto-fires the search
    setCurrentSyllabus({ videoId: '', title: '', questions: [], nextRecommendedQuery: nextQuery });
    setSelectedDomain('');
    // Trigger search programmatically via a small timeout so onboarding mounts first
    setTimeout(() => {
      useStore.getState().setCurrentSyllabus({ videoId: '', title: '', questions: [], nextRecommendedQuery: nextQuery });
    }, 50);
  };

  const handleLearnMore = () => {
    setSelectedDomain('');
  };

  return (
    <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xl z-30 flex flex-col items-center justify-center p-8 animate-fade-in">
      <div className="max-w-lg w-full bg-slate-900/80 border border-slate-700/50 rounded-3xl p-10 text-center shadow-2xl relative overflow-hidden flex flex-col items-center">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500 opacity-20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--color-theme-primary)] opacity-20 blur-3xl rounded-full" />

        <div className="relative z-10 w-24 h-24 rounded-full bg-amber-500/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(245,158,11,0.4)]">
          <Trophy className="w-12 h-12 text-amber-400" />
        </div>

        <h2 className="relative z-10 text-4xl font-black text-white mb-2 tracking-tight">Mission Complete</h2>
        <p className="relative z-10 text-slate-400 mb-8 text-lg">{currentSyllabus?.title}</p>

        <div className="relative z-10 grid grid-cols-2 gap-4 w-full mb-8">
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex flex-col items-center cursor-help" title="Experience Points (XP) earned by answering questions and completing missions">
            <span className="text-amber-500 font-black text-4xl mb-1">{score}</span>
            <span className="text-slate-500 uppercase tracking-widest text-xs font-bold">Total XP</span>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex flex-col items-center cursor-help" title="Your learning streak. Completing missions keeps it alive!">
            <span className="text-orange-500 font-black text-4xl mb-1 flex items-center gap-1">
              {streak} <Flame className="w-6 h-6" />
            </span>
            <span className="text-slate-500 uppercase tracking-widest text-xs font-bold">Day Streak</span>
          </div>
        </div>

        <div className="relative z-10 w-full space-y-4">
          {/* AI-recommended next video */}
          {nextQuery ? (
            <div className="w-full rounded-2xl bg-[var(--color-theme-primary)]/10 border border-[var(--color-theme-primary)]/30 p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[var(--color-theme-primary)]">
                <Sparkles className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs font-bold uppercase tracking-widest">AI Recommends Next</span>
              </div>
              <p className="text-white font-semibold text-left text-sm leading-snug">"{nextQuery}"</p>
              <button
                onClick={handleWatchNext}
                className="w-full py-3 px-5 rounded-xl bg-[var(--color-theme-primary)] hover:bg-[var(--color-theme-primary-hover)] text-slate-950 font-bold text-sm transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_16px_var(--color-theme-primary)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                Watch Next
              </button>
            </div>
          ) : (
            <div className="w-full rounded-2xl bg-slate-800/40 border border-slate-700/50 p-4 flex items-center gap-3 animate-pulse">
              <Sparkles className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <span className="text-slate-500 text-sm">AI is preparing your next recommendation…</span>
            </div>
          )}

          <button
            onClick={handleLearnMore}
            className="w-full py-4 px-6 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-lg transition-all border border-white/10 hover:border-white/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Search className="w-5 h-5 text-slate-400" />
            Search Something Else
          </button>
        </div>
      </div>
    </div>
  );
}
