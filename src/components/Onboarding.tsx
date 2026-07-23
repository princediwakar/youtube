"use client";

import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  Brain, Code, ChefHat, BookOpen, Target, Workflow, Activity, 
  Search, ArrowRight, PenTool, PiggyBank, Cpu, PenLine, Music, 
  Telescope, Camera, Sparkles, Droplets, Zap, Flame
} from 'lucide-react';

const domainOptions = [
  { id: 'coding', label: 'Coding', icon: Code, description: 'Master web development' },
  { id: 'cooking', label: 'Cooking', icon: ChefHat, description: 'Culinary techniques' },
  { id: 'history', label: 'History', icon: BookOpen, description: 'Historical events' },
  { id: 'product-management', label: 'Product Mgt', icon: Target, description: 'Define products' },
  { id: 'agentic-workflows', label: 'AI Agents', icon: Workflow, description: 'Build AI agents' },
  { id: 'health-fitness', label: 'Health & Fit', icon: Activity, description: 'Physical well-being' },
  { id: 'creative-writing', label: 'Writing', icon: PenTool, description: 'Craft compelling stories' },
  { id: 'personal-finance', label: 'Finance', icon: PiggyBank, description: 'Manage your money' },
  { id: 'machine-learning', label: 'Machine Lrng', icon: Cpu, description: 'Train models' },
  { id: 'graphic-design', label: 'Design', icon: PenLine, description: 'Visual communication' },
  { id: 'music-theory', label: 'Music Theory', icon: Music, description: 'Understand harmony' },
  { id: 'astronomy', label: 'Astronomy', icon: Telescope, description: 'Explore the cosmos' },
  { id: 'photography', label: 'Photography', icon: Camera, description: 'Capture moments' }
];

const themeOptions = [
  { id: 'star-chart', label: 'Star Chart', icon: Sparkles, color: 'bg-indigo-500', border: 'border-indigo-500' },
  { id: 'neon-cyber', label: 'Neon Cyber', icon: Zap, color: 'bg-fuchsia-500', border: 'border-fuchsia-500' },
  { id: 'deep-ocean', label: 'Deep Ocean', icon: Droplets, color: 'bg-teal-500', border: 'border-teal-500' },
  { id: 'ember-minimal', label: 'Ember Minimal', icon: Flame, color: 'bg-orange-500', border: 'border-orange-500' }
];

export default function Onboarding() {
  const { setSelectedDomain, setTheme, theme } = useStore();
  const [step, setStep] = useState<1 | 2>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [tempDomain, setTempDomain] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const matchingDomain = domainOptions.find(d => 
        d.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (matchingDomain) {
        setTempDomain(matchingDomain.id);
      } else {
        setTempDomain(searchQuery.toLowerCase().replace(/\s+/g, '-'));
      }
      setStep(2);
    }
  };

  const selectDomain = (id: string) => {
    setTempDomain(id);
    setStep(2);
  };

  const finishOnboarding = (themeId: string) => {
    setTheme(themeId);
    if (tempDomain) {
      setSelectedDomain(tempDomain);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-theme-bg)] flex flex-col items-center justify-center p-6 transition-colors duration-500" style={{ backgroundColor: 'var(--color-theme-bg, #020617)' }}>
      <div className="max-w-4xl w-full space-y-12">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-[var(--color-theme-surface)] rounded-full flex items-center justify-center border border-[var(--color-theme-border)]" style={{ backgroundColor: 'var(--color-theme-surface, #0f172a)', borderColor: 'var(--color-theme-border, #334155)' }}>
              <Brain className="w-10 h-10" style={{ color: 'var(--color-theme-primary, #6366f1)' }} />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            {step === 1 ? 'Welcome to ZenTube' : 'Choose Your Theme'}
          </h1>
          <p className="text-xl max-w-lg mx-auto" style={{ color: 'var(--color-theme-text-muted, #94a3b8)' }}>
            {step === 1 ? 'What do you want to get better at?' : 'Personalize your mastery experience.'}
          </p>
        </div>

        {step === 1 && (
          <>
            <form onSubmit={handleSearch} className="max-w-xl mx-auto w-full relative">
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-6 h-6 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search to declare a goal (e.g. 'Conversational Spanish')"
                  className="w-full pl-12 pr-14 py-4 rounded-2xl border text-white focus:outline-none focus:ring-1 transition-all"
                  style={{ 
                    backgroundColor: 'var(--color-theme-surface, #0f172a)', 
                    borderColor: 'var(--color-theme-border, #334155)',
                  }}
                />
                <button
                  type="submit"
                  disabled={!searchQuery.trim()}
                  className="absolute right-3 p-2 text-white rounded-xl transition-colors disabled:opacity-50"
                  style={{ backgroundColor: 'var(--color-theme-primary, #6366f1)' }}
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </form>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              {domainOptions.map((domain) => {
                const Icon = domain.icon;
                return (
                  <button
                    key={domain.id}
                    onClick={() => selectDomain(domain.id)}
                    className="flex flex-col items-center text-center p-6 rounded-2xl border transition-all group"
                    style={{ 
                      backgroundColor: 'var(--color-theme-surface, #0f172a)', 
                      borderColor: 'var(--color-theme-border, #334155)'
                    }}
                  >
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors" style={{ backgroundColor: 'var(--color-theme-surface-hover, #1e293b)' }}>
                      <Icon className="w-6 h-6 transition-colors" style={{ color: 'var(--color-theme-text-muted, #94a3b8)' }} />
                    </div>
                    <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--color-theme-text-main, #f8fafc)' }}>{domain.label}</h3>
                    <p className="text-xs" style={{ color: 'var(--color-theme-text-muted, #94a3b8)' }}>{domain.description}</p>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 max-w-2xl mx-auto">
            {themeOptions.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => finishOnboarding(t.id)}
                  onMouseEnter={() => setTheme(t.id)}
                  className={`flex items-center gap-4 p-6 rounded-2xl border-2 transition-all group ${
                    theme === t.id ? t.border : 'border-transparent'
                  }`}
                  style={{ backgroundColor: 'var(--color-theme-surface, #0f172a)' }}
                >
                  <div className={`w-12 h-12 rounded-full ${t.color} bg-opacity-20 flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${theme === t.id ? 'text-white' : 'text-slate-400'} group-hover:text-white transition-colors`} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-semibold" style={{ color: 'var(--color-theme-text-main, #f8fafc)' }}>{t.label}</h3>
                    <p className="text-sm" style={{ color: 'var(--color-theme-text-muted, #94a3b8)' }}>Select to continue</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
