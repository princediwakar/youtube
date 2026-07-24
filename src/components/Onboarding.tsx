"use client";

import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { 
  Brain, Search, ArrowRight, Sparkles, Droplets, Zap, Flame, Loader2
} from 'lucide-react';

const themeOptions = [
  { id: 'star-chart', label: 'Star Chart', icon: Sparkles, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500', hoverGlow: 'hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]' },
  { id: 'neon-cyber', label: 'Neon Cyber', icon: Zap, color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500', hoverGlow: 'hover:shadow-[0_0_20px_rgba(217,70,239,0.3)]' },
  { id: 'deep-ocean', label: 'Deep Ocean', icon: Droplets, color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500', hoverGlow: 'hover:shadow-[0_0_20px_rgba(20,184,166,0.3)]' },
  { id: 'ember-minimal', label: 'Ember Minimal', icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500', hoverGlow: 'hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]' }
];

export default function Onboarding() {
  const { setSelectedDomain, setCurrentSyllabus, setIsGenerating, setTheme, theme, isGenerating } = useStore();
  const [step, setStep] = useState<1 | 2>(1);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Proceed to theme selection immediately, we will generate syllabus in parallel
    setStep(2);
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate-syllabus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      });

      if (!response.ok) {
        throw new Error('Failed to generate syllabus');
      }

      const syllabus = await response.json();
      setCurrentSyllabus(syllabus);
      setSelectedDomain(searchQuery.toLowerCase().replace(/\s+/g, '-'));
    } catch (error) {
      console.error(error);
      // Fallback or error handling can go here
    } finally {
      setIsGenerating(false);
    }
  };

  const finishOnboarding = (themeId: string) => {
    setTheme(themeId);
    // If generation is already done, they will naturally be placed into ZenDashboard because selectedDomain is set.
    // If not, ZenDashboard or Page will handle showing a loading screen.
  };

  return (
    <div className="min-h-screen bg-[var(--color-theme-bg)] flex flex-col items-center justify-center p-6 transition-colors duration-1000 relative overflow-hidden" style={{ backgroundColor: 'var(--color-theme-bg, #020617)' }}>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-theme-primary)] opacity-10 blur-[128px] rounded-full animate-orb-float pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500 opacity-10 blur-[128px] rounded-full animate-orb-float pointer-events-none" style={{ animationDelay: '4s' }} />

      <div className="max-w-5xl w-full space-y-12 relative z-10">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-[var(--color-theme-surface)] rounded-2xl flex items-center justify-center border border-[var(--color-theme-border)] shadow-2xl animate-pulse-glow" style={{ backgroundColor: 'var(--color-theme-surface, #0f172a)', borderColor: 'var(--color-theme-border, #334155)' }}>
              <Brain className="w-12 h-12" style={{ color: 'var(--color-theme-primary, #6366f1)' }} />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-br from-white via-white to-slate-500 bg-clip-text text-transparent">
            {step === 1 ? 'What do you want to master today?' : 'Set Your Atmosphere'}
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto font-light" style={{ color: 'var(--color-theme-text-muted, #94a3b8)' }}>
            {step === 1 ? 'Enter any topic, from Advanced SQL to Pre-Socratic Philosophy, and we will build your syllabus.' : 'Personalize your learning environment for maximum flow.'}
          </p>
        </div>

        {step === 1 && (
          <div className="animate-slide-up space-y-12">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto w-full group">
              <div className="relative flex items-center transition-all duration-300 group-focus-within:scale-[1.02]">
                <Search className="absolute left-5 w-6 h-6 text-slate-400 group-focus-within:text-[var(--color-theme-primary)] transition-colors" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter a topic or paste a YouTube video URL..."
                  className="w-full pl-14 pr-16 py-5 rounded-3xl border-2 text-white text-lg focus:outline-none focus:ring-4 transition-all bg-black/40 backdrop-blur-xl"
                  style={{ 
                    borderColor: 'var(--color-theme-border, #334155)',
                  }}
                />
                <button
                  type="submit"
                  disabled={!searchQuery.trim()}
                  className="absolute right-3 p-3 rounded-2xl transition-all disabled:scale-100 disabled:bg-slate-800 disabled:text-slate-500 bg-white text-black hover:bg-slate-200 hover:scale-105"
                >
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center animate-slide-up space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
              {themeOptions.map((t, idx) => {
                const Icon = t.icon;
                const isSelected = theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => finishOnboarding(t.id)}
                    onMouseEnter={() => setTheme(t.id)}
                    className={`flex items-center gap-6 p-8 rounded-3xl border-2 transition-all duration-500 transform hover:-translate-y-1 ${t.hoverGlow} ${
                      isSelected ? t.border + ' shadow-2xl scale-[1.02]' : 'border-slate-800 hover:border-slate-700'
                    }`}
                    style={{ 
                      backgroundColor: 'var(--color-theme-surface, #0f172a)',
                      animationDelay: `${idx * 100}ms`
                    }}
                  >
                    <div className={`w-16 h-16 rounded-2xl ${t.bg} flex items-center justify-center transition-transform ${isSelected ? 'scale-110' : ''}`}>
                      <Icon className={`w-8 h-8 ${t.color} ${isSelected ? 'animate-pulse' : ''}`} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-2xl font-bold mb-1 text-white tracking-tight">{t.label}</h3>
                      <p className="text-slate-400 font-medium">Click to enter Zen mode</p>
                    </div>
                  </button>
                );
              })}
            </div>
            
            {isGenerating && (
              <div className="mt-8 flex flex-col items-center space-y-4 animate-pulse">
                <Loader2 className="w-8 h-8 text-[var(--color-theme-primary)] animate-spin" />
                <p className="text-slate-400 font-medium">Generating your customized learning path...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
