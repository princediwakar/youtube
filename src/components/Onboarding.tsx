"use client";

import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { 
  Search, ArrowRight, Sparkles, Droplets, Zap, Flame, Loader2
} from 'lucide-react';

const themeOptions = [
  { id: 'star-chart', label: 'Star Chart', tagline: 'For the night owl. Deep space focus.', icon: Sparkles, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500', hoverGlow: 'hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]' },
  { id: 'neon-cyber', label: 'Neon Cyber', tagline: 'High energy. Late night grind.', icon: Zap, color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500', hoverGlow: 'hover:shadow-[0_0_20px_rgba(217,70,239,0.3)]' },
  { id: 'deep-ocean', label: 'Deep Ocean', tagline: 'Calm and steady. No distractions.', icon: Droplets, color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500', hoverGlow: 'hover:shadow-[0_0_20px_rgba(20,184,166,0.3)]' },
  { id: 'ember-minimal', label: 'Ember Minimal', tagline: 'Warm. Low stakes. Just vibes.', icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500', hoverGlow: 'hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]' }
];

const searchSuggestions = [
  "How money really works",
  "Quantum physics in 20 min",
  "Negotiation tactics",
  "CRISPR explained",
  "Music theory basics",
  "How the stock market works"
];

export default function Onboarding() {
  const { setSelectedDomain, currentSyllabus, setCurrentSyllabus, setIsGenerating, setTheme, theme, isGenerating } = useStore();
  const [searchQuery, setSearchQuery] = useState(currentSyllabus?.nextRecommendedQuery || '');
  const [errorMsg, setErrorMsg] = useState('');

  const [searchStatus, setSearchStatus] = useState<'idle' | 'searching' | 'found'>('idle');

  const handleSearch = async (e?: React.FormEvent, term?: string) => {
    if (e) e.preventDefault();
    const query = term || searchQuery;
    if (!query.trim()) return;

    // Show loading state on the same screen
    setIsGenerating(true);
    setSearchStatus('searching');
    setErrorMsg('');

    try {
      const response = await fetch('/api/search-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      if (!response.ok) {
        let errMsg = 'Failed to find video';
        try {
          const errorData = await response.json();
          if (errorData.error) errMsg = errorData.error;
        } catch (e) {}
        throw new Error(errMsg);
      }

      const { videoId, title } = await response.json();
      setSearchStatus('found');
      
      // Set initial syllabus with empty questions so the user can start watching
      setCurrentSyllabus({ videoId, title, questions: [] });
      setSelectedDomain(query.toLowerCase().replace(/\s+/g, '-'));

      // Background generation of questions
      useStore.getState().setIsGeneratingQuestions(true);
      fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId, title, query })
      })
      .then(res => res.json())
      .then(data => {
        if (data && data.questions) {
          useStore.getState().setCurrentSyllabus({ videoId, title, questions: data.questions });
        }
      })
      .catch(err => console.error("Background question generation failed:", err))
      .finally(() => {
        useStore.getState().setIsGeneratingQuestions(false);
      });

    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || 'An unexpected error occurred. Please try again.');
      setSearchStatus('idle');
    } finally {
      setIsGenerating(false);
    }
  };



  return (
    <div className="min-h-screen bg-[var(--color-theme-bg)] flex flex-col items-center justify-center p-6 transition-colors duration-1000 relative overflow-hidden" style={{ backgroundColor: 'var(--color-theme-bg, #020617)' }}>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-theme-primary)] opacity-10 blur-[128px] rounded-full animate-orb-float pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500 opacity-10 blur-[128px] rounded-full animate-orb-float pointer-events-none" style={{ animationDelay: '4s' }} />

      {/* Minimal Theme Selector at Top Right */}
      <div className="absolute top-6 right-6 flex items-center gap-3 z-50">
        {themeOptions.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            title={t.label}
            className={`w-8 h-8 rounded-full ${t.bg} flex items-center justify-center transition-all duration-300 hover:scale-110 ${
              theme === t.id ? `ring-2 ring-offset-2 ring-offset-[var(--color-theme-bg)] ${t.border}` : 'opacity-50 hover:opacity-100'
            }`}
          >
            <t.icon className={`w-4 h-4 ${t.color}`} />
          </button>
        ))}
      </div>

      <div className="max-w-5xl w-full space-y-12 relative z-10">
        <div className="text-center space-y-6 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-br from-white via-white to-slate-500 bg-clip-text text-transparent">
            What do you want to master today?
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto font-light" style={{ color: 'var(--color-theme-text-muted, #94a3b8)' }}>
            Enter any topic, from History and Literature to Finance and AI, and we will build your syllabus.
          </p>
        </div>

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

            {/* Curated Suggestions */}
            <div className="max-w-2xl mx-auto flex flex-wrap gap-2 justify-center animate-fade-in" style={{ animationDelay: '200ms' }}>
              {searchSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSearch(undefined, suggestion)}
                  className="px-4 py-2 rounded-full border border-slate-700/50 bg-slate-800/30 text-slate-300 text-sm hover:bg-[var(--color-theme-primary)]/20 hover:text-[var(--color-theme-primary)] hover:border-[var(--color-theme-primary)]/50 transition-all duration-300"
                >
                  {suggestion}
                </button>
              ))}
            </div>
            
            {errorMsg && (
              <div className="max-w-2xl mx-auto p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center animate-fade-in shadow-lg">
                <p className="font-medium">{errorMsg}</p>
              </div>
            )}
            {searchStatus === 'searching' && (
              <div className="max-w-2xl mx-auto flex items-center justify-center gap-3 px-6 py-3 rounded-full border bg-slate-800/50 border-slate-700/50 text-slate-300 animate-pulse">
                <Loader2 className="w-5 h-5 animate-spin text-[var(--color-theme-primary)]" />
                <span className="font-medium">Finding the best video for "{searchQuery}"...</span>
              </div>
            )}
          </div>
      </div>
    </div>
  );
}
