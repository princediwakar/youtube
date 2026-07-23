"use client";

import React, { useEffect, useRef, useState } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
import { domains, Question } from '../data/mockBrain';
import { useStore } from '../store/useStore';
import QuizOverlay from './QuizOverlay';

export default function VideoPlayer() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  const { isFlowMode, selectedDomain } = useStore();
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());

  // Get current domain content, fallback to coding if not found or null
  const currentDomainContent = selectedDomain && domains[selectedDomain] ? domains[selectedDomain] : domains.coding;
  const videoId = currentDomainContent.videoId;
  const mockQuestions = currentDomainContent.questions;

  // Polling for video time
  useEffect(() => {
    if (isFlowMode || currentQuestion) return;

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
  }, [isFlowMode, currentQuestion, answeredQuestions, mockQuestions]);

  const onReady: YouTubeProps['onReady'] = (event: any) => {
    playerRef.current = event.target;
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
      autoplay: 0,
      modestbranding: 1,
      rel: 0,
    },
  };

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl bg-black border border-slate-700">
      <YouTube 
        videoId={videoId} 
        opts={opts} 
        onReady={onReady} 
        className="w-full h-full"
        iframeClassName="w-full h-full"
      />
      {currentQuestion && (
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-10 flex items-center justify-center p-6">
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
