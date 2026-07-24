"use client";

import React, { useEffect, useRef, useState } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
import { Question } from '@/types';
import { useStore } from '@/store/useStore';
import QuizOverlay from '@/components/QuizOverlay';
import { Play, Pause, AlertTriangle, RefreshCw, BrainCircuit, Maximize } from 'lucide-react';

export default function VideoPlayer() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  const { isFlowMode, selectedDomain, currentSyllabus } = useStore();
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
  const [hasStarted, setHasStarted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [fallbackMode, setFallbackMode] = useState(false);
  const [autoStartCountdown, setAutoStartCountdown] = useState(4);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Custom Control State
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  // If in fallback mode, use a safe video ID
  const videoId = fallbackMode ? 'zjkBMFhNj_g' : (currentSyllabus?.videoId || 'zjkBMFhNj_g');
  const mockQuestions = currentSyllabus?.questions || [];

  // Polling for video time
  useEffect(() => {
    if (isFlowMode || currentQuestion || !hasStarted) return;

    const interval = setInterval(async () => {
      if (playerRef.current && isPlaying) {
        const time = await playerRef.current.getCurrentTime();
        if (time !== undefined) {
          const vidDuration = await playerRef.current.getDuration();
          if (vidDuration && vidDuration !== duration) setDuration(vidDuration);
          if (vidDuration) setProgress((time / vidDuration) * 100);

          // Trigger transition slightly earlier for the fade effect
          const matchingQuestion = mockQuestions.find(
            (q) => !answeredQuestions.has(q.id) && time >= q.timestamp - 2 && time < q.timestamp
          );

          if (matchingQuestion) {
            // Cinematic Transition: Duck volume then pause
            let volume = await playerRef.current.getVolume();
            const fadeOutInterval = setInterval(() => {
              if (volume > 10) {
                volume -= 10;
                playerRef.current.setVolume(volume);
              } else {
                clearInterval(fadeOutInterval);
                playerRef.current.pauseVideo();
                playerRef.current.setVolume(100); // reset for when it resumes
                setCurrentQuestion(matchingQuestion);
              }
            }, 100);
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isFlowMode, currentQuestion, answeredQuestions, mockQuestions, hasStarted, isPlaying, duration]);

  const onReady: YouTubeProps['onReady'] = (event: any) => {
    playerRef.current = event.target;
    setIsPlayerReady(true);
  };

  const onStateChange: YouTubeProps['onStateChange'] = (event: any) => {
    if (event.data === 1) setIsPlaying(true);
    else if (event.data === 2 || event.data === 0) setIsPlaying(false);
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

  // Auto-start countdown logic
  useEffect(() => {
    if (hasStarted || hasError || !isPlayerReady) return;
    if (autoStartCountdown <= 0) {
      handleStartSession();
      return;
    }
    const timer = setTimeout(() => setAutoStartCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [autoStartCountdown, hasStarted, hasError, isPlayerReady]);

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

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) playerRef.current.pauseVideo();
    else playerRef.current.playVideo();
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    const newTime = (newProgress / 100) * duration;
    if (playerRef.current) {
      playerRef.current.seekTo(newTime, true);
      setProgress(newProgress);
    }
  };

  const opts: YouTubeProps['opts'] = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: fallbackMode ? 1 : 0,
      modestbranding: 1,
      rel: 0,
      controls: 0,
      disablekb: 1,
      fs: 0,
      iv_load_policy: 3
    },
  };

  return (
    <div ref={containerRef} className="relative w-full aspect-video group bg-black overflow-hidden rounded-xl">
      <div className="absolute inset-0 pointer-events-none z-0">
        <YouTube 
          videoId={videoId} 
          opts={opts} 
          onReady={onReady} 
          onStateChange={onStateChange}
          onError={onError}
          className="w-full h-full pointer-events-none"
          iframeClassName="w-full h-full pointer-events-none"
        />
      </div>

      {/* Invisible overlay to capture clicks and prevent YouTube native UI from showing on hover */}
      {hasStarted && !hasError && !currentQuestion && (
        <div 
          className="absolute inset-0 z-10 cursor-pointer"
          onClick={togglePlay}
        />
      )}

      {/* Top Right Fullscreen Button */}
      {hasStarted && !hasError && !currentQuestion && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <button 
            onClick={toggleFullScreen}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-md transition-all border border-white/10 hover:border-white/30 shadow-lg"
            title="Full Screen"
          >
            <Maximize className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Custom Controls Overlay (Bottom Timeline) */}
      {hasStarted && !hasError && !currentQuestion && (
        <div className={`absolute bottom-0 left-0 right-0 px-8 pb-4 pt-16 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-500 z-20 flex flex-col justify-end ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
          
          <div className="relative w-full h-10 flex items-center group/scrub">
            {/* Fat-Finger Touch Target */}
            <input 
              type="range" 
              min="0" 
              max="100" 
              step="0.1"
              value={progress}
              onChange={handleSeek}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
            />
            
            {/* Visual Track */}
            <div className="relative w-full h-1 group-hover/scrub:h-2 transition-all duration-300 bg-white/20 rounded-full overflow-hidden z-10">
              {/* Progress Fill */}
              <div 
                className="absolute top-0 left-0 h-full bg-white transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Checkpoint Markers */}
            {duration > 0 && mockQuestions.map(q => (
              <div 
                key={q.id}
                className={`absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full shadow-[0_0_8px_var(--color-theme-primary)] transition-colors z-20 pointer-events-none ${answeredQuestions.has(q.id) ? 'bg-emerald-400' : 'bg-amber-400'}`}
                style={{ left: `calc(${(q.timestamp / duration) * 100}% - 5px)` }}
              />
            ))}
          </div>
        </div>
      )}

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
              Start Learning Session ({autoStartCountdown})
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
            onSkip={() => handleSkip(currentQuestion.id)}
          />
        </div>
      )}
    </div>
  );
}
