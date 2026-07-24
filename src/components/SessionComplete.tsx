"use client";

import React, { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Trophy, Share2, Flame, Play, CheckCircle2 } from 'lucide-react';

export default function SessionComplete() {
  const { score, streak, currentSyllabus, incrementStreak, setSelectedDomain } = useStore();

  useEffect(() => {
    incrementStreak();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShare = () => {
    // In a real app, this would use the Web Share API or generate an image
    alert('Share functionality would open here!');
  };

  const handleLearnMore = () => {
    setSelectedDomain('');
  };

  return (
    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl z-30 flex flex-col items-center justify-center p-8 animate-fade-in">
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
          <button 
            onClick={handleShare}
            className="w-full py-4 px-6 rounded-2xl bg-[#1DA1F2] hover:bg-[#1a91da] text-white font-bold text-lg transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(29,161,242,0.3)] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Share2 className="w-5 h-5" />
            Share Victory
          </button>
          
          <button 
            onClick={handleLearnMore}
            className="w-full py-4 px-6 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-lg transition-all border border-white/10 hover:border-white/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Start Next Mission
          </button>
        </div>
      </div>
    </div>
  );
}
