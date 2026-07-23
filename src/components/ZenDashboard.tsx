"use client";

import React from 'react';
import { useStore } from '../store/useStore';
import VideoPlayer from './VideoPlayer';
import { Brain, Focus, Play, CheckCircle } from 'lucide-react';

export default function ZenDashboard() {
  const { isFlowMode, toggleFlowMode, masteryScore } = useStore();

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-8 space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
            <Brain className="w-8 h-8 text-indigo-400" />
            ZenTube Engine
          </h1>
          <p className="text-slate-400 mt-1">Guided Mastery & Spaced Repetition</p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-sm text-slate-400 uppercase tracking-wider font-semibold">Mastery Score</span>
            <span className="text-2xl font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              {masteryScore}
            </span>
          </div>
          
          <button
            onClick={toggleFlowMode}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
              isFlowMode 
                ? 'bg-slate-700 text-slate-200 border border-slate-600' 
                : 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600/20'
            }`}
          >
            {isFlowMode ? (
              <>
                <Play className="w-4 h-4" /> Flow Mode: ON
              </>
            ) : (
              <>
                <Focus className="w-4 h-4" /> Flow Mode: OFF
              </>
            )}
          </button>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <VideoPlayer />
        </div>
        
        <aside className="space-y-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Current Session</h2>
            {isFlowMode ? (
              <p className="text-slate-400 text-sm">
                Flow Mode is active. Interceptions and quizzes are paused. Relax and watch!
              </p>
            ) : (
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5" />
                  <p className="text-slate-300">Adaptive interception is <strong className="text-indigo-400">active</strong>.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5" />
                  <p className="text-slate-300">The player will pause at key conceptual boundaries to test recall.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5" />
                  <p className="text-slate-300">Wrong answers trigger a 15-second guided remediation loop.</p>
                </li>
              </ul>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}
