"use client";

import React, { useEffect, useRef, useState } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
import { Question } from '@/types';
import { useStore } from '@/store/useStore';
import QuizOverlay from '@/components/QuizOverlay';
import { Play, AlertTriangle, RefreshCw, BrainCircuit } from 'lucide-react';

export default function VideoPlayer() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  const { isFlowMode, selectedDomain, currentSyllabus } = useStore();
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
  const [hasStarted, setHasStarted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [fallbackMode, setFallbackMode] = useState(false);

  // If in fallback mode, use a safe video ID
  const videoId = fallbackMode ? 'PkZNo7MFNFg' : (currentSyllabus?.videoId || 'PkZNo7MFNFg');
  const mockQuestions = currentSyllabus?.questions || [];

  // Polling for video time
  useEffect(() => {
    if (isFlowMode || currentQuestion || !hasStarted) return;

    const interval = setInterval(async () => {
      if (playerRef.current) {
        const time = await playerRef.current.getCurrentTime();
        if (time !== undefined) {
          const matchingQuestion = mockQuestions.find(
            (q) => !answeredQuestions.has(q.id) && time >= q.timestamp && time < q.timestamp + 2
          );

          if (matchingQuestion) {
            setCurrentQuestion(matchingQuestion);
            playerRef.current.pauseVideo();
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isFlowMode, currentQuestion, answeredQuestions, mockQuestions, hasStarted]);

  const onReady: YouTubeProps['onReady'] = (event: any) => {
    playerRef.current = event.target;
  };

  const onError: YouTubeProps['onError'] = () => {
    setHasError(true);
  };

  const handleStartSession = () => {
    setHasStarted(true);
    if (playerRef.current) {
      playerRef.current.playVideo();
    }
  };

  const handleFallback = () => {
    setFallbackMode(true);
    setHasError(false);
    setHasStarted(true); // Auto-start the fallback
  };

  const handleQuizPass = (questionId: string) => {
    setAnsweredQuestions(new Set(answeredQuestions).add(questionId));
    setCurrentQuestion(null);
    if (playerRef.current) {
      playerRef.current.playVideo();
    }
  };

  const handleRemediation = (remediationTimestamp: number) => {
    setCurrentQuestion(null);
    if (playerRef.current) {
      playerRef.current.seekTo(remediationTimestamp, true);
      playerRef.current.playVideo();
    }
  };
  
  const handleSkip = (questionId: string) => {
    setAnsweredQuestions(new Set(answeredQuestions).add(questionId));
    setCurrentQuestion(null);
    if (playerRef.current) {
      playerRef.current.playVideo();
    }
  };

  const opts: YouTubeProps['opts'] = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: fallbackMode ? 1 : 0,
      modestbranding: 1,
      rel: 0,
    },
  };

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl bg-black border border-slate-700 group">
      <YouTube 
        videoId={videoId} 
        opts={opts} 
        onReady={onReady} 
        onError={onError}
        className="w-full h-full"
        iframeClassName="w-full h-full"
      />

      {/* Mission Briefing Overlay */}
      {!hasStarted && !hasError && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-20 flex flex-col items-center justify-center p-8 animate-fade-in">
          <div className="max-w-md w-full bg-slate-900/50 border border-slate-700/50 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-theme-primary)] opacity-10 blur-3xl rounded-full" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[var(--color-theme-primary)] opacity-10 blur-3xl rounded-full" />
            
            <div className="w-16 h-16 rounded-full bg-[var(--color-theme-primary)]/20 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(var(--color-theme-primary-rgb),0.3)]">
              <BrainCircuit className="w-8 h-8 text-[var(--color-theme-primary)]" />
            </div>
            
            <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-wide">
              {selectedDomain ? selectedDomain.replace('-', ' ') : 'Coding'} Mastery
            </h2>
            <p className="text-slate-400 mb-8">
              This module contains <strong className="text-white">{mockQuestions.length} conceptual checkpoints</strong>. 
              The engine will automatically pause to test your recall.
            </p>
            
            <button 
              onClick={handleStartSession}
              className="w-full py-4 px-6 rounded-2xl bg-[var(--color-theme-primary)] hover:bg-[var(--color-theme-primary-hover)] text-slate-950 font-bold text-lg transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_var(--color-theme-primary)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              Initialize Neural Link
            </button>
          </div>
        </div>
      )}

      {/* Error Fallback Overlay */}
      {hasError && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl z-30 flex flex-col items-center justify-center p-8 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
            <AlertTriangle className="w-10 h-10 text-red-500 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Signal Lost</h2>
          <p className="text-slate-400 text-center max-w-md mb-8">
            The source video restricted external embedding. Would you like to load a safe simulation to continue testing the engine?
          </p>
          <button 
            onClick={handleFallback}
            className="py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors border border-slate-600 flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-5 h-5" />
            Load Fallback Simulation
          </button>
        </div>
      )}

      {/* Quiz Overlay */}
      {currentQuestion && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xl z-10 flex items-center justify-center p-6 animate-fade-in transition-all duration-500">
          <QuizOverlay 
            question={currentQuestion} 
            onPass={() => handleQuizPass(currentQuestion.id)} 
            onRemediation={() => handleRemediation(currentQuestion.remediationTimestamp)}
            onSkip={() => handleSkip(currentQuestion.id)}
          />
        </div>
      )}
    </div>
  );
}
