"use client";

import React, { useState, useEffect } from 'react';
import { Question } from '@/types';
import { useStore } from '@/store/useStore';
import { CheckCircle2, Zap, HelpCircle } from 'lucide-react';
import TutorMode from './TutorMode';

interface QuizOverlayProps {
  question: Question;
  onPass: () => void;
  onSkip: () => void;
}

export default function QuizOverlay({ question, onPass, onSkip }: QuizOverlayProps) {
  const { incrementMastery, isTutorModeActive, setIsTutorModeActive } = useStore();
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState<'idle' | 'wrong' | 'correct'>('idle');

  const handleOptionSelect = (value: string) => {
    if (status !== 'idle') return;
    setAnswer(value);
    const isCorrect = value === question.correctAnswer;
    if (isCorrect) {
      setStatus('correct');
      incrementMastery();
      setTimeout(() => onPass(), 1500);
    } else {
      setStatus('wrong');
      setIsTutorModeActive(true);
    }
  };

  const handleDecodeRequest = () => {
    if (status !== 'idle') return;
    setAnswer("User requested insight card");
    setStatus('wrong');
    setIsTutorModeActive(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.type === 'mcq') return; // Handled by handleOptionSelect
    
    let isCorrect = false;
    isCorrect = answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();

    if (isCorrect) {
      setStatus('correct');
      incrementMastery();
      setTimeout(() => onPass(), 1500);
    } else {
      setStatus('wrong');
      setIsTutorModeActive(true);
    }
  };

  useEffect(() => {
    if (status !== 'idle' || isTutorModeActive || question.type !== 'mcq' || !question.options) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = parseInt(e.key);
      if (!isNaN(key) && key >= 1 && key <= question.options!.length) {
        handleOptionSelect((key - 1).toString());
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, isTutorModeActive, question]);

  const handleReturnToQuiz = () => {
    setIsTutorModeActive(false);
    setStatus('idle');
    setAnswer('');
  };

  if (isTutorModeActive && status === 'wrong') {
    return (
      <TutorMode 
        question={question}
        wrongAnswer={answer}
        onReturnToQuiz={handleReturnToQuiz}
        onResumeVideo={() => {
          setIsTutorModeActive(false);
          onSkip();
        }}
      />
    );
  }

  return (
    <div className={`relative bg-slate-900/40 backdrop-blur-3xl border rounded-3xl p-8 max-w-2xl w-full shadow-2xl transition-all duration-500 overflow-hidden ${
      status === 'correct' ? 'border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.3)]' : 'border-slate-700/50 hover:border-slate-600 animate-slide-up'
    }`}>
      {/* Decorative Glow */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-64 blur-[100px] opacity-30 pointer-events-none transition-colors duration-1000 ${
        status === 'correct' ? 'bg-emerald-500 scale-150' : 'bg-[var(--color-theme-primary)]'
      }`} />

      <div className="relative z-10 flex justify-between items-start mb-8">
        <h3 className="text-sm uppercase tracking-widest font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-theme-primary)] to-[var(--color-theme-primary-hover)] flex items-center gap-2">
          <Zap className="w-4 h-4 text-[var(--color-theme-primary)]" />
          Concept Check
        </h3>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleDecodeRequest}
            className="flex items-center gap-1 text-xs px-4 py-2 rounded-full bg-[var(--color-theme-primary)]/10 text-[var(--color-theme-primary)] hover:bg-[var(--color-theme-primary)]/20 transition-all font-bold border border-[var(--color-theme-primary)]/20 shadow-[0_0_15px_var(--color-theme-glow)]"
          >
            <HelpCircle className="w-3 h-3" />
            Decode
          </button>
          <button 
            onClick={onSkip}
            className="text-xs px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/5 hover:border-white/10 font-medium"
          >
            Skip
          </button>
        </div>
      </div>

      <p className="relative z-10 text-2xl md:text-3xl font-bold text-white mb-8 leading-tight tracking-tight">
        {question.text}
      </p>

      {status !== 'correct' && (
        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
          {question.type === 'mcq' && question.options && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question.options.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleOptionSelect(i.toString())}
                  className="flex items-center p-6 rounded-2xl border border-slate-700/50 bg-slate-900/40 backdrop-blur-md hover:border-[var(--color-theme-primary)]/50 hover:bg-[var(--color-theme-primary)]/5 transition-all duration-300 text-left group hover:scale-[1.02] shadow-xl hover:shadow-[0_0_25px_var(--color-theme-glow)] cursor-pointer focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-xl bg-slate-800/80 border border-slate-700 mr-4 flex items-center justify-center font-bold text-slate-500 group-hover:bg-[var(--color-theme-primary)]/20 group-hover:text-[var(--color-theme-primary)] group-hover:border-[var(--color-theme-primary)]/50 transition-colors shadow-inner">
                    {i + 1}
                  </div>
                  <span className="font-medium text-slate-200 group-hover:text-white transition-colors text-lg">
                    {opt}
                  </span>
                </button>
              ))}
            </div>
          )}

          {question.type === 'code' && question.codeSnippet && (
            <div className="bg-[#1e1e1e] p-6 rounded-2xl border border-slate-700 shadow-inner">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-slate-400 text-xs font-mono ml-2">sandbox.js</span>
              </div>
              <p className="font-mono text-slate-300 text-lg whitespace-pre-wrap">
                {question.codeSnippet.split('______')[0]}
                <input 
                  type="text" 
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="bg-slate-800 border-b-2 border-[var(--color-theme-primary)] text-white font-mono px-2 py-1 mx-1 outline-none w-32 focus:w-48 transition-all"
                  autoFocus
                />
                {question.codeSnippet.split('______')[1]}
              </p>
            </div>
          )}

          {question.type === 'free-text' && (
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your explanation here..."
              className="w-full p-6 rounded-2xl bg-black/40 border-2 border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-[var(--color-theme-primary)] focus:ring-4 focus:ring-[var(--color-theme-primary)]/20 min-h-[140px] text-lg transition-all"
            />
          )}

          {question.type !== 'mcq' && (
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={!answer}
                className="px-8 py-3 bg-[var(--color-theme-primary)] hover:bg-[var(--color-theme-primary-hover)] disabled:opacity-30 disabled:hover:scale-100 hover:scale-105 text-white rounded-xl font-bold transition-all shadow-lg"
              >
                Confirm Answer
              </button>
            </div>
          )}
        </form>
      )}

      {status === 'correct' && (
        <div className="absolute inset-0 z-20 bg-emerald-500/10 backdrop-blur-sm flex items-center justify-center animate-fade-in rounded-3xl">
          <div className="p-8 rounded-3xl bg-black/50 border border-emerald-500/30 flex flex-col items-center justify-center gap-4 animate-slide-up shadow-[0_0_100px_rgba(16,185,129,0.3)]">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.5)]">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-bounce" />
            </div>
            <div className="text-center">
              <p className="text-emerald-400 font-black text-3xl mb-1 tracking-tight">Checkpoint Passed</p>
              <p className="text-emerald-500/80 font-medium">Resuming video...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
