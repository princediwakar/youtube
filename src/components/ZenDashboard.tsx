"use client";

import React, { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import VideoPlayer from '@/components/VideoPlayer';
import { Focus, Play, ChevronLeft, Award, Activity, CheckCircle2, Circle, Edit3 } from 'lucide-react';

export default function ZenDashboard() {
  const { isFlowMode, toggleFlowMode, masteryScore, setSelectedDomain, currentSyllabus } = useStore();
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
          <button
            onClick={toggleFlowMode}
            className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors ${
              isFlowMode 
                ? 'text-slate-500 hover:text-slate-300' 
                : 'text-[var(--color-theme-primary)] hover:text-emerald-300'
            }`}
          >
            {isFlowMode ? (
              <><Play className="w-4 h-4" /> Flow: ON</>
            ) : (
              <><Focus className="w-4 h-4" /> Flow: OFF</>
            )}
          </button>

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
        
        <aside className="lg:col-span-1 flex flex-col gap-6 h-full">
            {isFlowMode ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 animate-fade-in bg-slate-900/20 backdrop-blur-xl border border-slate-800/30 rounded-3xl p-8 shadow-2xl">
                <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-2">
                  <Play className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Flow State Active</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Interceptions and conceptual quizzes are temporarily paused. Kick back and absorb the content.
                </p>
              </div>
            ) : (
              <div className="space-y-6 animate-fade-in flex-1 flex flex-col">
                {/* Dynamic Syllabus */}
                <div className="p-6 rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 shadow-2xl">
                  <h4 className="text-white font-bold mb-6 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <Focus className="w-4 h-4 text-[var(--color-theme-primary)]" />
                    Concept Checkpoints
                  </h4>
                  {questions.length > 0 ? (
                    <div className="space-y-4 relative before:absolute before:inset-y-2 before:left-[11px] before:w-[2px] before:bg-slate-800">
                      {questions.map((q, i) => (
                        <div key={q.id} className="flex items-start gap-4 relative z-10">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-[#020617] border border-slate-700 mt-0.5">
                            <Circle className="w-2.5 h-2.5 text-slate-500" />
                          </div>
                          <div className="flex-1">
                            <p className="text-slate-300 text-sm font-medium leading-relaxed mb-1">{q.text}</p>
                            <span className="text-slate-500 text-xs font-mono">{Math.floor(q.timestamp / 60)}:{(q.timestamp % 60).toString().padStart(2, '0')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-sm">No checkpoints detected for this stream.</p>
                  )}
                </div>
                
                {/* Study Notes */}
                <div className="p-6 rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 shadow-2xl flex flex-col flex-1 min-h-[250px]">
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
              </div>
            )}
        </aside>
      </main>
    </div>
  );
}
