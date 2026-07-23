"use client";

import React from 'react';
import { useStore } from '../store/useStore';
import { Brain, Code, ChefHat, BookOpen } from 'lucide-react';

const domainOptions = [
  { id: 'coding', label: 'Coding', icon: Code, description: 'Master web development and programming' },
  { id: 'cooking', label: 'Cooking', icon: ChefHat, description: 'Learn culinary techniques and recipes' },
  { id: 'history', label: 'History', icon: BookOpen, description: 'Understand key historical events' },
];

export default function Onboarding() {
  const { setSelectedDomain } = useStore();

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
