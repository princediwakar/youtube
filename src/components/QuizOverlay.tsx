"use client";

import React, { useState } from 'react';
import { Question } from '../data/mockBrain';
import { useStore } from '../store/useStore';
import { CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

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
    <div className="bg-slate-800/95 border border-slate-600 rounded-2xl p-8 max-w-lg w-full shadow-2xl transition-all duration-300 transform scale-100">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-xl font-semibold text-white">Concept Check</h3>
        <button 
          onClick={onSkip}
          className="text-xs px-3 py-1.5 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
        >
          I already know this
        </button>
      </div>

      <p className="text-lg text-slate-200 mb-6">{question.text}</p>

      {status !== 'correct' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {question.type === 'mcq' && question.options ? (
            <div className="space-y-2">
              {question.options.map((opt, i) => (
                <label 
                  key={i} 
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                    answer === i.toString() 
                      ? 'border-indigo-500 bg-indigo-500/10' 
                      : 'border-slate-600 hover:border-slate-500 hover:bg-slate-700/50'
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
                  <span className="text-slate-200">{opt}</span>
                </label>
              ))}
            </div>
          ) : (
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Explain in your own words..."
              className="w-full p-4 rounded-lg bg-slate-900 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 min-h-[120px]"
            />
          )}

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={!answer}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      )}

      {status === 'wrong' && (
        <div className="mt-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-200 font-medium mb-1">Let's revisit this</p>
              <p className="text-amber-100/80 text-sm mb-4">Hint: {question.hint}</p>
              <button
                onClick={onRemediation}
                className="flex items-center gap-2 text-sm px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-md transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Rewind & Review
              </button>
            </div>
          </div>
        </div>
      )}

      {status === 'correct' && (
        <div className="mt-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          <p className="text-emerald-400 font-medium">Great job! Resuming video...</p>
        </div>
      )}
    </div>
  );
}
