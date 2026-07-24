"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '@/store/useStore';
import VideoPlayer from '@/components/VideoPlayer';
import { Focus, Play, ChevronLeft, Award, Activity, CheckCircle2, Circle, Edit3, Loader2, Flame } from 'lucide-react';

export default function ZenDashboard() {
  const { score, streak, setSelectedDomain, currentSyllabus, isGeneratingQuestions } = useStore();
  const [mounted, setMounted] = useState(false);
  const [notes, setNotes] = useState('');
  const [isMouseIdle, setIsMouseIdle] = useState(false);
  const hideCursorTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMouseMove = () => {
    setIsMouseIdle(false);
    if (hideCursorTimeout.current) clearTimeout(hideCursorTimeout.current);
    hideCursorTimeout.current = setTimeout(() => {
      setIsMouseIdle(true);
    }, 2000);
  };
  
  const questions = currentSyllabus?.questions || [];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (currentSyllabus?.summaryNotes && notes === '') {
      setNotes(currentSyllabus.summaryNotes);
    }
  }, [currentSyllabus?.summaryNotes]);

  if (!mounted) return null;

  return (
    <div 
      className="min-h-screen bg-[var(--color-theme-bg)] transition-colors duration-1000 p-4 md:p-8 flex flex-col font-sans" 
      style={{ backgroundColor: 'var(--color-theme-bg, #020617)' }}
      onMouseMove={handleMouseMove}
    >
      {/* Dynamic Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[var(--color-theme-primary)] opacity-10 blur-[128px] pointer-events-none" />

      <header className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 max-w-[1600px] mx-auto w-full">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSelectedDomain('')}
            className={`p-2 text-slate-400 hover:text-white transition-all duration-300 hover:-translate-x-1 ${isMouseIdle ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            title="Return to Dashboard"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
        </div>
        
        <div className="flex items-center gap-8">
          {isGeneratingQuestions && (
            <div className="flex items-center gap-2 text-slate-400 bg-slate-800/30 px-3 py-1.5 rounded-full border border-slate-700/50 animate-fade-in">
              <Loader2 className="w-4 h-4 animate-spin text-[var(--color-theme-primary)]" />
              <span className="text-xs font-medium">AI generating checkpoints...</span>
            </div>
          )}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 cursor-help" title="Your learning streak. Completing missions keeps it alive!">
              <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Streak</span>
              <span className="text-xl font-bold text-orange-500 flex items-center gap-1">
                {streak} <Flame className="w-4 h-4" />
              </span>
            </div>
            <div className="flex items-center gap-3 bg-amber-500/10 px-4 py-2 rounded-full border border-amber-500/20 cursor-help" title="Experience Points (XP) earned by answering questions and completing missions">
              <span className="text-xs text-amber-500 uppercase tracking-widest font-bold">XP</span>
              <span className="text-2xl font-black text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.3)] flex items-center gap-1">{score}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-[1600px] mx-auto w-full animate-fade-in">
        <div className="lg:col-span-3 relative group">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800/80 ring-1 ring-white/5 bg-black">
            <VideoPlayer />
          </div>
        </div>
        
        <aside className="lg:col-span-1 flex flex-col">
          {/* Study Notes */}
          <div className="flex-1 p-6 rounded-3xl bg-slate-800/20 backdrop-blur-2xl border border-slate-700/50 shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex flex-col min-h-[250px] animate-fade-in relative overflow-hidden group">
            {/* Subtle inner glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-theme-primary)] opacity-5 blur-[80px] pointer-events-none transition-opacity group-focus-within:opacity-10" />
            <div className="relative flex-1 flex flex-col group/notes z-10">
              {notes.length === 0 && (
                <div className="absolute inset-0 pointer-events-none p-4 flex flex-col gap-4 opacity-50 group-focus-within/notes:opacity-20 transition-opacity">
                  <p className="text-slate-400 font-medium text-sm mb-2">{currentSyllabus?.title ? `Notes on: ${currentSyllabus.title}` : 'Topic Notes'}</p>
                  <div className="space-y-3 text-xs text-slate-500/80 font-mono">
                    <p>💡 What's one thing you didn't know before this?</p>
                    <p>❓ What question does this raise for you?</p>
                    <p>🔗 How does this connect to something you already know?</p>
                  </div>
                </div>
              )}
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="flex-1 w-full bg-transparent resize-none outline-none text-slate-300 text-sm placeholder-transparent font-mono leading-relaxed p-4 z-10 relative"
                placeholder="when you write, you understand better..."
              />
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
