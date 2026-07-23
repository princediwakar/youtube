import React, { useState } from 'react';
import { Question } from '@/types';
import { useStore, ChatMessage } from '@/store/useStore';
import { Bot, User, Send, ArrowLeft, Lightbulb, Play } from 'lucide-react';

interface TutorModeProps {
  question: Question;
  wrongAnswer: string;
  onReturnToQuiz: () => void;
}

export default function TutorMode({ question, wrongAnswer, onReturnToQuiz }: TutorModeProps) {
  const { tutorChatHistory, addTutorMessage, clearTutorChat } = useStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isInsightRequest = wrongAnswer === "User requested insight card";

  // Initialize chat if empty
  React.useEffect(() => {
    if (tutorChatHistory.length === 0) {
      sendMessageToTutor([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessageToTutor = async (history: ChatMessage[], userMessage?: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatHistory: userMessage 
            ? [...history, { role: 'user', content: userMessage }]
            : history,
          question,
          wrongAnswer,
          contextHint: question.hint
        })
      });

      const data = await response.json();
      if (data.content) {
        addTutorMessage({ role: 'assistant', content: data.content });
      }
    } catch (error) {
      console.error('Failed to communicate with Tutor AI:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: input };
    addTutorMessage(userMsg);
    setInput('');
    
    sendMessageToTutor(tutorChatHistory, input);
  };

  return (
    <div className="relative bg-slate-900/90 backdrop-blur-3xl border border-amber-500/30 rounded-3xl p-6 w-full max-w-2xl shadow-2xl flex flex-col h-[500px]">
      <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-800">
        <h3 className={`font-bold flex items-center gap-2 ${isInsightRequest ? 'text-[var(--color-theme-primary)]' : 'text-amber-500'}`}>
          {isInsightRequest ? <Lightbulb className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
          {isInsightRequest ? 'Concept Insight' : 'Guided Tutor'}
        </h3>
        <button 
          onClick={() => {
            clearTutorChat();
            onReturnToQuiz();
          }}
          className="text-sm px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-2 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Quiz
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
        {/* Initial context message showing what went wrong */}
        {!isInsightRequest && (
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
            <p className="text-slate-400 text-sm mb-2">Original Question:</p>
            <p className="text-white font-medium mb-3">{question.text}</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-red-400">Your answer:</span>
              <span className="text-white px-2 py-1 bg-black/30 rounded">{wrongAnswer}</span>
            </div>
          </div>
        )}

        {tutorChatHistory.map((msg, i) => {
          // Special styling for the first AI response in Insight Mode
          if (isInsightRequest && i === 0 && msg.role === 'assistant') {
            return (
              <div key={i} className="mb-8">
                <div className="p-8 rounded-3xl bg-[var(--color-theme-primary)]/10 border border-[var(--color-theme-primary)]/30 text-white text-xl md:text-2xl font-medium leading-relaxed shadow-[0_0_40px_rgba(var(--color-theme-primary-rgb),0.1)] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-theme-primary)] opacity-20 blur-3xl rounded-full" />
                  <p className="relative z-10">{msg.content}</p>
                  
                  <button 
                    onClick={() => {
                      clearTutorChat();
                      onReturnToQuiz();
                    }}
                    className="relative z-10 mt-6 px-6 py-3 bg-[var(--color-theme-primary)] text-slate-900 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-lg cursor-pointer"
                  >
                    <Play className="w-5 h-5" /> Got it, resume video
                  </button>
                </div>
                <div className="flex items-center gap-4 mt-6">
                  <div className="h-px bg-slate-800 flex-1"></div>
                  <span className="text-slate-500 text-sm">Still confused? Ask below.</span>
                  <div className="h-px bg-slate-800 flex-1"></div>
                </div>
              </div>
            );
          }

          return (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-[var(--color-theme-primary)]/20 text-[var(--color-theme-primary)]' : 'bg-amber-500/20 text-amber-500'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`p-3 rounded-2xl max-w-[85%] ${msg.role === 'user' ? 'bg-[var(--color-theme-primary)]/10 text-white rounded-tr-sm border border-[var(--color-theme-primary)]/20' : 'bg-slate-800 text-slate-200 rounded-tl-sm border border-slate-700'}`}>
                {msg.content}
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-amber-500 animate-pulse" />
            </div>
            <div className="p-3 bg-slate-800 rounded-2xl rounded-tl-sm flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="relative mt-auto">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a clarifying question..."
          className="w-full bg-black/50 border border-slate-700 rounded-xl py-3 pl-4 pr-12 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
        />
        <button 
          type="submit" 
          disabled={!input.trim() || isLoading}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-amber-500 disabled:opacity-50 transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
