"use client";

import React, { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import VideoPlayer from '@/components/VideoPlayer';
import { Brain, Focus, Play, ChevronLeft, Award, Activity } from 'lucide-react';

export default function ZenDashboard() {
  const { isFlowMode, toggleFlowMode, masteryScore, setSelectedDomain } = useStore();
  const [mounted, setMounted] = useState(false);

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
            className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all backdrop-blur-md hover:scale-105"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 flex items-center gap-3 tracking-tight">
              <Brain className="w-8 h-8 text-[var(--color-theme-primary)] animate-pulse-glow rounded-full" />
              ZenTube Engine
            </h1>
            <p className="text-slate-400 font-medium text-sm mt-1 uppercase tracking-widest">Theater Mode Active</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6 bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 p-2 pr-6 rounded-3xl shadow-2xl">
          <button
            onClick={toggleFlowMode}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${
              isFlowMode 
                ? 'bg-slate-800 text-slate-300 border border-slate-700 shadow-inner' 
                : 'bg-[var(--color-theme-primary)] text-white shadow-[0_0_20px_var(--color-theme-glow)] scale-105 hover:scale-110'
            }`}
          >
            {isFlowMode ? (
              <>
                <Play className="w-5 h-5 text-slate-400" /> Flow: ON
              </>
            ) : (
              <>
                <Focus className="w-5 h-5 animate-pulse" /> Flow: OFF
              </>
            )}
          </button>

          <div className="flex items-center gap-4 pl-4 border-l border-slate-700/50">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Mastery</span>
              <span className="text-2xl font-black text-white flex items-center gap-2">
                {masteryScore}
              </span>
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-[0_0_15px_rgba(52,211,153,0.4)]">
              <Award className="w-6 h-6 text-emerald-950" />
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-[1600px] mx-auto w-full animate-fade-in">
        <div className="lg:col-span-3 h-full min-h-[60vh] flex flex-col relative group">
          {/* Decorative video frame glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-theme-primary)] to-[var(--color-theme-primary-hover)] opacity-20 blur-xl rounded-3xl group-hover:opacity-30 transition-opacity duration-1000" />
          <div className="relative flex-1 rounded-2xl overflow-hidden shadow-2xl bg-black border border-slate-800/80 ring-1 ring-white/5">
            <VideoPlayer />
          </div>
        </div>
        
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/60 rounded-3xl p-8 shadow-2xl h-full flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-theme-primary)] opacity-10 blur-3xl rounded-full" />
            
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <Activity className="w-5 h-5 text-[var(--color-theme-primary)]" />
              Session HUD
            </h2>
            
            {isFlowMode ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-2">
                  <Play className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Flow State Active</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Interceptions and conceptual quizzes are temporarily paused. Kick back and absorb the content.
                </p>
              </div>
            ) : (
              <div className="space-y-8 animate-fade-in">
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-[var(--color-theme-surface)] border border-[var(--color-theme-border)]">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-theme-primary)]/20 flex items-center justify-center shrink-0 mt-1">
                      <Focus className="w-4 h-4 text-[var(--color-theme-primary)]" />
                    </div>
                    <div>
                      <p className="text-white font-medium mb-1">Adaptive Interception</p>
                      <p className="text-slate-400 text-sm">The engine will pause at conceptual boundaries to test your recall.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/30 border border-slate-700/50">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 mt-1">
                      <Brain className="w-4 h-4 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-white font-medium mb-1">Guided Remediation</p>
                      <p className="text-slate-400 text-sm">Wrong answers trigger a seamless 15-second contextual rewind loop.</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-slate-800">
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-4">Neural Activity</p>
                  <div className="flex items-center gap-1">
                    {[...Array(20)].map((_, i) => (
                      <div 
                        key={i} 
                        className="h-8 flex-1 bg-[var(--color-theme-primary)] rounded-full opacity-20"
                        style={{
                          animation: `pulse-glow ${2 + Math.random()}s infinite`,
                          animationDelay: `${Math.random() * 2}s`,
                          opacity: Math.random() * 0.5 + 0.1
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}
