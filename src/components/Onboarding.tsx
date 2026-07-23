"use client";

import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Brain, Code, ChefHat, BookOpen, Target, Workflow, Activity, Search, ArrowRight } from 'lucide-react';

const domainOptions = [
  { id: 'coding', label: 'Coding', icon: Code, description: 'Master web development and programming' },
  { id: 'cooking', label: 'Cooking', icon: ChefHat, description: 'Learn culinary techniques and recipes' },
  { id: 'history', label: 'History', icon: BookOpen, description: 'Understand key historical events' },
  { id: 'product-management', label: 'Product Management', icon: Target, description: 'Define and launch successful products' },
  { id: 'agentic-workflows', label: 'Agentic Workflows', icon: Workflow, description: 'Build and orchestrate AI agents' },
  { id: 'health-fitness', label: 'Health & Fitness', icon: Activity, description: 'Optimize your physical well-being' },
];

export default function Onboarding() {
  const { setSelectedDomain } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const matchingDomain = domainOptions.find(d => 
        d.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (matchingDomain) {
        setSelectedDomain(matchingDomain.id);
      } else {
        setSelectedDomain(searchQuery.toLowerCase().replace(/\s+/g, '-'));
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-12">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center border border-indigo-500/30">
              <Brain className="w-10 h-10 text-indigo-400" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Welcome to ZenTube
          </h1>
          <p className="text-xl text-slate-400 max-w-lg mx-auto">
            What do you want to get better at?
          </p>
        </div>

        <form onSubmit={handleSearch} className="max-w-xl mx-auto w-full relative">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-6 h-6 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search to declare a goal (e.g. 'Conversational Spanish')"
              className="w-full pl-12 pr-14 py-4 rounded-2xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-lg transition-all"
            />
            <button
              type="submit"
              disabled={!searchQuery.trim()}
              className="absolute right-3 p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {domainOptions.map((domain) => {
            const Icon = domain.icon;
            return (
              <button
                key={domain.id}
                onClick={() => setSelectedDomain(domain.id)}
                className="flex flex-col items-center text-center p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500 hover:bg-slate-800 transition-all group"
              >
                <div className="w-16 h-16 rounded-full bg-slate-800 group-hover:bg-indigo-500/20 flex items-center justify-center mb-6 transition-colors">
                  <Icon className="w-8 h-8 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-slate-200 mb-2">{domain.label}</h3>
                <p className="text-slate-500 text-sm">{domain.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
