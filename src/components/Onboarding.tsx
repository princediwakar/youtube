"use client";

import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { WatchedVideo } from '@/types';
import { 
  Search, ArrowRight, Sparkles, Droplets, Zap, Flame, Loader2, Moon,
  Clock, X, BookOpen, Play, Calendar, ChevronRight, FileText
} from 'lucide-react';

const themeOptions = [
  { id: 'star-chart', label: 'Star Chart', tagline: 'For the night owl. Deep space focus.', icon: Sparkles, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500', hoverGlow: 'hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]' },
  { id: 'neon-cyber', label: 'Neon Cyber', tagline: 'High energy. Late night grind.', icon: Zap, color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500', hoverGlow: 'hover:shadow-[0_0_20px_rgba(217,70,239,0.3)]' },
  { id: 'deep-ocean', label: 'Deep Ocean', tagline: 'Calm and steady. No distractions.', icon: Droplets, color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500', hoverGlow: 'hover:shadow-[0_0_20px_rgba(20,184,166,0.3)]' },
  { id: 'ember-minimal', label: 'Ember Minimal', tagline: 'Warm. Low stakes. Just vibes.', icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500', hoverGlow: 'hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]' },
  { id: 'obsidian', label: 'Obsidian', tagline: 'Pure dark mode. Ultimate focus.', icon: Moon, color: 'text-zinc-400', bg: 'bg-zinc-500/10', border: 'border-zinc-500', hoverGlow: 'hover:shadow-[0_0_20px_rgba(161,161,170,0.3)]' }
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
  const { 
    setSelectedDomain, 
    currentSyllabus, 
    setCurrentSyllabus, 
    setIsGenerating, 
    setTheme, 
    theme, 
    isGenerating,
    watchHistory = [] 
  } = useStore();
  const [searchQuery, setSearchQuery] = useState(currentSyllabus?.nextRecommendedQuery || '');
  const [errorMsg, setErrorMsg] = useState('');
  const [searchStatus, setSearchStatus] = useState<'idle' | 'searching' | 'found'>('idle');
  
  // History Drawer State
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedNoteItem, setSelectedNoteItem] = useState<WatchedVideo | null>(null);

  const handleSearch = async (e?: React.FormEvent, term?: string) => {
    if (e) e.preventDefault();
    const query = term || searchQuery;
    if (!query.trim()) return;

    if (term) setSearchQuery(term);

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

  const handleWatchFromHistory = (item: WatchedVideo) => {
    setIsHistoryOpen(false);
    setSelectedNoteItem(null);
    
    setCurrentSyllabus({ 
      videoId: item.videoId, 
      title: item.title, 
      summaryNotes: item.summaryNotes,
      nextRecommendedQuery: item.nextRecommendedQuery,
      questions: [] 
    });
    setSelectedDomain((item.query || item.title).toLowerCase().replace(/\s+/g, '-'));

    // Regenerate questions in background so they get checkpoints again
    useStore.getState().setIsGeneratingQuestions(true);
    fetch('/api/generate-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoId: item.videoId, title: item.title, query: item.query || item.title })
    })
    .then(res => res.json())
    .then(data => {
      if (data && data.questions) {
        useStore.getState().setCurrentSyllabus({ 
          videoId: item.videoId, 
          title: item.title, 
          summaryNotes: item.summaryNotes,
          nextRecommendedQuery: item.nextRecommendedQuery,
          questions: data.questions 
        });
      }
    })
    .catch(err => console.error("Background question generation failed:", err))
    .finally(() => {
      useStore.getState().setIsGeneratingQuestions(false);
    });
  };

  return (
    <div className="min-h-screen bg-[var(--color-theme-bg)] flex flex-col items-center justify-center p-6 transition-colors duration-1000 relative overflow-hidden" style={{ backgroundColor: 'var(--color-theme-bg, #020617)' }}>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-theme-primary)] opacity-10 blur-[128px] rounded-full animate-orb-float pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500 opacity-10 blur-[128px] rounded-full animate-orb-float pointer-events-none" style={{ animationDelay: '4s' }} />

      {/* History Button at Top Left */}
      <div className="absolute top-6 left-6 z-40">
        <button
          onClick={() => { setIsHistoryOpen(true); setSelectedNoteItem(null); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 hover:border-slate-500 transition-all backdrop-blur-md shadow-lg group cursor-pointer"
          title="View Watch History & Notes"
        >
          <Clock className="w-4 h-4 text-[var(--color-theme-primary)] group-hover:rotate-12 transition-transform" />
          <span className="text-sm font-semibold">History ({watchHistory.length})</span>
        </button>
      </div>

      {/* Minimal Theme Selector at Top Right */}
      <div className="absolute top-6 right-6 flex items-center gap-3 z-40">
        {themeOptions.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              title={t.label}
              className={`w-8 h-8 rounded-full ${t.bg} flex items-center justify-center transition-all duration-300 ${
                theme === t.id 
                  ? 'opacity-100 scale-110 shadow-lg' 
                  : 'opacity-40 hover:opacity-80 hover:scale-105'
              }`}
            >
              <Icon className={`w-4 h-4 ${t.color}`} />
            </button>
          );
        })}
      </div>

      <div className="max-w-5xl w-full space-y-12 relative z-10">
        <div className="text-center space-y-6 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-br from-white via-white to-slate-500 bg-clip-text text-transparent">
            What do you want to master today?
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto font-light" style={{ color: 'var(--color-theme-text-muted, #94a3b8)' }}>
            Drop a topic or paste a YouTube link below to instantly start learning.
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
                  className="absolute right-3 p-3 rounded-2xl transition-all disabled:scale-100 disabled:bg-slate-800 disabled:text-slate-500 bg-white text-black hover:bg-slate-200 hover:scale-105 cursor-pointer"
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
                  className="px-4 py-2 rounded-full border border-slate-700/50 bg-slate-800/30 text-slate-300 text-sm hover:bg-[var(--color-theme-primary)]/20 hover:text-[var(--color-theme-primary)] hover:border-[var(--color-theme-primary)]/50 transition-all duration-300 cursor-pointer"
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

      {/* Watch History Drawer / Modal */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 flex justify-start animate-fade-in">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
            onClick={() => { setIsHistoryOpen(false); setSelectedNoteItem(null); }}
          />

          {/* Slide-over Panel */}
          <div className="relative w-full max-w-lg bg-slate-900 border-r border-slate-800 shadow-2xl flex flex-col h-full z-10 animate-slide-right">
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-theme-primary)]/10 border border-[var(--color-theme-primary)]/30 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[var(--color-theme-primary)]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white leading-tight">Watch History</h2>
                  <p className="text-xs text-slate-400">Your past sessions & saved study notes</p>
                </div>
              </div>
              <button 
                onClick={() => { setIsHistoryOpen(false); setSelectedNoteItem(null); }}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {selectedNoteItem ? (
                /* Note Detail View */
                <div className="space-y-6 animate-fade-in">
                  <button 
                    onClick={() => setSelectedNoteItem(null)}
                    className="flex items-center gap-2 text-sm text-[var(--color-theme-primary)] hover:underline font-semibold cursor-pointer"
                  >
                    ← Back to History List
                  </button>

                  <div className="bg-slate-800/50 border border-slate-700/80 rounded-2xl p-5 space-y-4">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Video Title</span>
                      <h3 className="text-lg font-bold text-white mt-1">{selectedNoteItem.title}</h3>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-400 border-y border-slate-700/50 py-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        <span>Watched on {new Date(selectedNoteItem.watchedAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-theme-primary)]">
                        <FileText className="w-4 h-4" />
                        <span>Saved Study Notes & AI Summary</span>
                      </div>
                      <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 text-slate-300 text-sm font-mono whitespace-pre-wrap leading-relaxed min-h-[160px] max-h-[350px] overflow-y-auto">
                        {selectedNoteItem.notes || selectedNoteItem.summaryNotes || "No notes were saved for this session."}
                      </div>
                    </div>

                    <button
                      onClick={() => handleWatchFromHistory(selectedNoteItem)}
                      className="w-full py-3 px-4 rounded-xl bg-[var(--color-theme-primary)] hover:bg-[var(--color-theme-primary-hover)] text-slate-950 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_var(--color-theme-primary)] cursor-pointer mt-4"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      Re-watch This Video
                    </button>
                  </div>
                </div>
              ) : watchHistory.length === 0 ? (
                /* Empty State */
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-slate-800/60 flex items-center justify-center text-slate-500 mb-2">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <h3 className="text-white font-bold text-lg">No Watch History Yet</h3>
                  <p className="text-slate-400 text-sm max-w-xs">
                    Complete your first learning session and your video history and notes will automatically appear here!
                  </p>
                </div>
              ) : (
                /* History List */
                watchHistory.map((item) => (
                  <div 
                    key={item.videoId + '-' + item.watchedAt}
                    className="bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/50 hover:border-slate-600 rounded-2xl p-4 transition-all duration-200 group flex flex-col gap-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 flex-1 min-w-0">
                        <h4 className="text-white font-bold text-sm truncate group-hover:text-[var(--color-theme-primary)] transition-colors">
                          {item.title || item.query || "Untitled Video"}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-amber-400" />
                            {new Date(item.watchedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Note preview snippet if exists */}
                    {(item.notes || item.summaryNotes) && (
                      <p className="text-xs text-slate-400 font-mono line-clamp-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                        {item.notes || item.summaryNotes}
                      </p>
                    )}

                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-700/40">
                      <button
                        onClick={() => setSelectedNoteItem(item)}
                        className="px-3 py-1.5 rounded-lg bg-slate-700/40 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-cyan-400" />
                        Read Notes
                      </button>

                      <button
                        onClick={() => handleWatchFromHistory(item)}
                        className="px-3 py-1.5 rounded-lg bg-[var(--color-theme-primary)]/10 hover:bg-[var(--color-theme-primary)] text-[var(--color-theme-primary)] hover:text-slate-950 border border-[var(--color-theme-primary)]/30 hover:border-transparent text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        Watch
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
