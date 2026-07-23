"use client";

import React, { useState } from 'react';
import { Question } from '@/data/mockBrain';
import { useStore } from '@/store/useStore';
import { CheckCircle2, AlertCircle, RefreshCw, Zap } from 'lucide-react';

interface QuizOverlayProps {
  question: Question;
  onPass: () => void;
  onRemediation: () => void;
  onSkip: () => void;
}

export default function QuizOverlay({ question, onPass, onRemediation, onSkip }: QuizOverlayProps) {
  const { incrementMastery, decrementMastery } = useStore();
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState<'idle' | 'wrong' | 'correct'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let isCorrect = false;
    if (question.type === 'mcq') {
      isCorrect = answer === question.correctAnswer;
    } else {
      isCorrect = answer.toLowerCase().includes(question.correctAnswer.toLowerCase());
    }

    if (isCorrect) {
      setStatus('correct');
      incrementMastery();
      setTimeout(() => onPass(), 1500);
    } else {
      setStatus('wrong');
      decrementMastery();
    }
  };

  return (
    <div className={`relative bg-slate-900/40 backdrop-blur-3xl border rounded-3xl p-8 max-w-2xl w-full shadow-2xl transition-all duration-500 overflow-hidden ${
      status === 'wrong' ? 'animate-shake border-amber-500/50 shadow-[0_0_40px_rgba(245,158,11,0.2)]' : 
      status === 'correct' ? 'border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.3)]' : 'border-slate-700/50 hover:border-slate-600 animate-slide-up'
    }`}>
      {/* Decorative Glow */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 blur-3xl opacity-20 pointer-events-none transition-colors duration-500 ${
        status === 'wrong' ? 'bg-amber-500' : 
        status === 'correct' ? 'bg-emerald-500' : 'bg-[var(--color-theme-primary)]'
      }`} />

      <div className="relative z-10 flex justify-between items-start mb-8">
        <h3 className="text-sm uppercase tracking-widest font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-theme-primary)] to-[var(--color-theme-primary-hover)] flex items-center gap-2">
          <Zap className="w-4 h-4 text-[var(--color-theme-primary)]" />
          Concept Check
        </h3>
        <button 
          onClick={onSkip}
          className="text-xs px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/5 hover:border-white/10 font-medium"
        >
          Skip / I know this
        </button>
      </div>

      <p className="relative z-10 text-2xl md:text-3xl font-bold text-white mb-8 leading-tight tracking-tight">
        {question.text}
      </p>

      {status !== 'correct' && (
        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
          {question.type === 'mcq' && question.options ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question.options.map((opt, i) => (
                <label 
                  key={i} 
                  className={`flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                    answer === i.toString() 
                      ? 'border-[var(--color-theme-primary)] bg-[var(--color-theme-primary)]/10 shadow-[0_0_20px_var(--color-theme-glow)] scale-[1.02]' 
                      : 'border-slate-800 bg-slate-900/50 hover:border-slate-600 hover:bg-slate-800 hover:scale-[1.01]'
                  }`}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={i.toString()}
                    checked={answer === i.toString()}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="hidden"
                  />
                  <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-colors ${
                    answer === i.toString() ? 'border-[var(--color-theme-primary)]' : 'border-slate-600'
                  }`}>
                    {answer === i.toString() && <div className="w-3 h-3 rounded-full bg-[var(--color-theme-primary)]" />}
                  </div>
                  <span className={`font-medium ${answer === i.toString() ? 'text-white' : 'text-slate-300'}`}>
                    {opt}
                  </span>
                </label>
              ))}
            </div>
          ) : (
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your explanation here..."
              className="w-full p-6 rounded-2xl bg-black/40 border-2 border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-[var(--color-theme-primary)] focus:ring-4 focus:ring-[var(--color-theme-primary)]/20 min-h-[140px] text-lg transition-all"
            />
          )}

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={!answer}
              className="px-8 py-3 bg-[var(--color-theme-primary)] hover:bg-[var(--color-theme-primary-hover)] disabled:opacity-30 disabled:hover:scale-100 hover:scale-105 text-white rounded-xl font-bold transition-all shadow-lg"
            >
              Confirm Answer
            </button>
          </div>
        </form>
      )}

      {status === 'wrong' && (
        <div className="relative z-10 mt-6 p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 backdrop-blur-md animate-slide-up">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="text-amber-300 font-bold mb-1 text-lg">Let's refine your understanding</p>
              <p className="text-amber-100/70 mb-4 leading-relaxed">Hint: {question.hint}</p>
              <button
                onClick={onRemediation}
                className="flex items-center gap-2 text-sm px-6 py-3 bg-amber-500 text-amber-950 hover:bg-amber-400 font-bold rounded-xl transition-all hover:scale-105"
              >
                <RefreshCw className="w-4 h-4" />
                Rewind & Review Context
              </button>
            </div>
          </div>
        </div>
      )}

      {status === 'correct' && (
        <div className="relative z-10 mt-8 p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center gap-4 animate-slide-up">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <p className="text-emerald-400 font-bold text-xl">Brilliant!</p>
            <p className="text-emerald-500/70">Mastery increased. Resuming stream...</p>
          </div>
        </div>
      )}
    </div>
  );
}
