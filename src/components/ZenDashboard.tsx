"use client";

import React, { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import VideoPlayer from '@/components/VideoPlayer';
import { Focus, Play, ChevronLeft, Award, Activity, CheckCircle2, Circle, Edit3 } from 'lucide-react';

export default function ZenDashboard() {
  const { masteryScore, setSelectedDomain, currentSyllabus } = useStore();
  const [mounted, setMounted] = useState(false);
  const [notes, setNotes] = useState('');
  
  const questions = currentSyllabus?.questions || [];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[var(--color-theme-bg)] transition-colors duration-1000 p-4 md:p-8 flex flex-col font-sans" style={{ backgroundColor: 'var(--color-theme-bg, #020617)' }}>
      {/* Dynamic Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[var(--color-theme-primary)] opacity-10 blur-[128px] pointer-events-none" />

      <header className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 max-w-[1600px] mx-auto w-full">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSelectedDomain('')}
            className="p-2 text-slate-400 hover:text-white transition-transform hover:-translate-x-1"
            title="Return to Dashboard"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Mastery</span>
            <span className="text-2xl font-black text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">{masteryScore}</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-[1600px] mx-auto w-full animate-fade-in">
        <div className="lg:col-span-3 relative group">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800/80 ring-1 ring-white/5 bg-black">
            <VideoPlayer />
          </div>
        </div>
        
        <aside className="lg:col-span-1 h-full">
          {/* Study Notes */}
          <div className="p-6 rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 shadow-2xl flex flex-col h-full min-h-[250px] animate-fade-in">
            <h4 className="text-white font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
              <Edit3 className="w-4 h-4 text-amber-500" />
              Study Notes
            </h4>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Jot down insights here..."
              className="flex-1 w-full bg-transparent resize-none outline-none text-slate-300 text-sm placeholder-slate-700 font-mono leading-relaxed"
            />
          </div>
        </aside>
      </main>
    </div>
  );
}
