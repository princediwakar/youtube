"use client";

import React, { useEffect, useRef, useState } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
import { Question } from '@/types';
import { useStore } from '@/store/useStore';
import QuizOverlay from '@/components/QuizOverlay';
import SessionComplete from '@/components/SessionComplete';
import { Play, Pause, Maximize } from 'lucide-react';

export default function VideoPlayer() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  const { isFlowMode, selectedDomain, currentSyllabus, incrementScore } = useStore();
  const watchTimeSeconds = useRef(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
  const [hasStarted, setHasStarted] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [fallbackMode, setFallbackMode] = useState(false);
  const [autoStartCountdown, setAutoStartCountdown] = useState(4);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Custom Control State
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMouseIdle, setIsMouseIdle] = useState(false);
  const hideCursorTimeout = useRef<NodeJS.Timeout | null>(null);

  // If in fallback mode, use a safe video ID
  const videoId = fallbackMode ? 'zjkBMFhNj_g' : (currentSyllabus?.videoId || 'zjkBMFhNj_g');
  const questions = currentSyllabus?.questions || [];

  // Polling for video time
  useEffect(() => {
    if (isFlowMode || currentQuestion || !hasStarted) return;

    const interval = setInterval(async () => {
      if (playerRef.current && isPlaying) {
        watchTimeSeconds.current += 1;
        if (watchTimeSeconds.current >= 60) {
          incrementScore();
          watchTimeSeconds.current = 0;
        }

        const time = await playerRef.current.getCurrentTime();
        if (time !== undefined) {
          const vidDuration = await playerRef.current.getDuration();
          if (vidDuration && vidDuration !== duration) setDuration(vidDuration);
          if (vidDuration) setProgress((time / vidDuration) * 100);

          // Trigger transition slightly earlier for the fade effect
          const matchingQuestion = questions.find(
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
  }, [isFlowMode, currentQuestion, answeredQuestions, questions, hasStarted, isPlaying, duration]);

  const onReady: YouTubeProps['onReady'] = (event: any) => {
    playerRef.current = event.target;
    setIsPlayerReady(true);
  };

  const onStateChange: YouTubeProps['onStateChange'] = (event: any) => {
    if (event.data === 1) setIsPlaying(true);
    else if (event.data === 2 || event.data === 0) {
      setIsPlaying(false);
      if (event.data === 0) setSessionComplete(true);
    }
  };

  const onError: YouTubeProps['onError'] = () => {
    // Silently ignore embedding errors; the video simply won't play
    console.warn('YouTube player error — video may not support embedding.');
  };

  const handleStartSession = () => {
    setHasStarted(true);
    if (playerRef.current) {
      playerRef.current.playVideo();
    }
  };

  // Auto-start countdown logic
  useEffect(() => {
    if (hasStarted || !isPlayerReady) return;

    if (questions.length === 0) {
      handleStartSession();
      return;
    }

    if (autoStartCountdown <= 0) {
      handleStartSession();
      return;
    }
    const timer = setTimeout(() => setAutoStartCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [autoStartCountdown, hasStarted, isPlayerReady, questions.length]);


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

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input or textarea
      if (
        document.activeElement?.tagName === 'INPUT' || 
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.getAttribute('contenteditable') === 'true'
      ) {
        return;
      }
      
      if (!playerRef.current || !hasStarted || currentQuestion) return;

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k': {
          e.preventDefault();
          const state = await playerRef.current.getPlayerState();
          if (state === 1) playerRef.current.pauseVideo();
          else playerRef.current.playVideo();
          break;
        }
        case 'f': {
          e.preventDefault();
          toggleFullScreen();
          break;
        }
        case 'arrowright':
        case 'l': {
          e.preventDefault();
          const time = await playerRef.current.getCurrentTime();
          playerRef.current.seekTo(time + 10, true);
          break;
        }
        case 'arrowleft':
        case 'j': {
          e.preventDefault();
          const time = await playerRef.current.getCurrentTime();
          playerRef.current.seekTo(Math.max(0, time - 10), true);
          break;
        }
        case 'c': {
          e.preventDefault();
          try {
            playerRef.current.loadModule('captions');
            const currentTrack = await playerRef.current.getOption('captions', 'track');
            if (currentTrack && currentTrack.languageCode) {
              playerRef.current.setOption('captions', 'track', {}); // disable
            } else {
              playerRef.current.setOption('captions', 'track', { languageCode: 'en' }); // enable english
            }
          } catch (err) {
            console.log('Captions toggle failed', err);
          }
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasStarted, currentQuestion]);

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

  const handleMouseMove = () => {
    setIsMouseIdle(false);
    if (hideCursorTimeout.current) clearTimeout(hideCursorTimeout.current);
    hideCursorTimeout.current = setTimeout(() => {
      setIsMouseIdle(true);
    }, 2000);
  };

  const handleMouseLeave = () => {
    setIsMouseIdle(false);
    if (hideCursorTimeout.current) clearTimeout(hideCursorTimeout.current);
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
      iv_load_policy: 3,
      origin: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
    },
  };

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full aspect-video group bg-black overflow-hidden rounded-xl ${isMouseIdle && isPlaying && !currentQuestion ? 'cursor-none' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
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
      {hasStarted && !currentQuestion && (
        <div 
          className={`absolute inset-0 z-10 ${isMouseIdle ? 'cursor-none' : 'cursor-pointer'}`}
          onClick={togglePlay}
        />
      )}

      {/* Top Right Fullscreen Button */}
      {hasStarted && !currentQuestion && (
        <div className={`absolute top-4 right-4 transition-opacity duration-300 z-20 ${(isPlaying && isMouseIdle) ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
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
      {hasStarted && !currentQuestion && (
        <div className={`absolute bottom-0 left-0 right-0 pb-0 pt-16 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-500 z-20 flex flex-col justify-end ${(isPlaying && isMouseIdle) ? 'opacity-0' : (isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100')}`}>
          
          <div className="relative w-full h-10 group/scrub">
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
            <div className="absolute bottom-0 left-0 w-full h-2 group-hover/scrub:h-3 transition-all duration-300 bg-white/20 overflow-hidden z-10">
              {/* Progress Fill */}
              <div 
                className="absolute top-0 left-0 h-full bg-white transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Checkpoint Markers */}
            {duration > 0 && questions.map(q => (
              <div 
                key={q.id}
                className={`absolute bottom-0 w-2.5 h-2.5 rounded-full shadow-[0_0_8px_var(--color-theme-primary)] transition-colors z-20 pointer-events-none ${answeredQuestions.has(q.id) ? 'bg-emerald-400' : 'bg-amber-400'}`}
                style={{ left: `calc(${(q.timestamp / duration) * 100}% - 5px)` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Mission Briefing Overlay */}
      {!hasStarted && questions.length > 0 && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-20 flex flex-col items-center justify-center p-8 animate-fade-in">
          <div className="max-w-md w-full bg-slate-900/50 border border-slate-700/50 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-theme-primary)] opacity-10 blur-3xl rounded-full" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[var(--color-theme-primary)] opacity-10 blur-3xl rounded-full" />

            
            <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-wide">
              {selectedDomain ? selectedDomain.replace('-', ' ') : 'Coding'} Mastery
            </h2>
            <p className="text-slate-400 mb-8">
              This module contains <strong className="text-white">{questions.length} Flashpoints</strong>. 
              The video will auto-pause to challenge you.
            </p>
            
            <button 
              onClick={handleStartSession}
              className="w-full py-4 px-6 rounded-2xl bg-[var(--color-theme-primary)] hover:bg-[var(--color-theme-primary-hover)] text-slate-950 font-bold text-lg transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_var(--color-theme-primary)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              Start Mission ({autoStartCountdown})
            </button>
          </div>
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

      {/* Session Complete Overlay */}
      {sessionComplete && (
        <SessionComplete />
      )}
    </div>
  );
}
