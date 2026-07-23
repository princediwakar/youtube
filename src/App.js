"use client";
import React, { useState, useEffect } from 'react';
import { Header, VideoDetails, VideosList } from './components'
import axios from 'axios';
import LoadingBar from 'react-top-loading-bar'


const API_KEY = process.env.NEXT_PUBLIC_API_KEY
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL


export const App = () => {
  const [videos, setVideos] = useState([])
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [loadingProgress, setLoadingProgress] = useState(0)


  const playVideoOnClick = (videoId) =>
    setSelectedVideo(videoId)


  const fetchVideos = async (query) => {
    setLoadingProgress(30)
    
    // Using mock data as fallback when API fails or keys are missing
    const handleMockData = () => {
      const mockVideoResults = [
        {
          id: { kind: "youtube#video", videoId: 'dQw4w9WgXcQ' },
          snippet: {
            title: 'Rick Astley - Never Gonna Give You Up (Official Music Video)',
            channelTitle: 'Rick Astley',
            description: 'The official video for “Never Gonna Give You Up” by Rick Astley',
            publishedAt: '2009-10-24T00:00:00Z',
            thumbnails: {
              default: { url: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/default.jpg' }
            }
          }
        },
        {
          id: { kind: "youtube#video", videoId: 'kJQP7kiw5Fk' },
          snippet: {
            title: 'Luis Fonsi - Despacito ft. Daddy Yankee',
            channelTitle: 'Luis Fonsi',
            description: 'Despacito ft. Daddy Yankee (Official Music Video)',
            publishedAt: '2017-01-13T00:00:00Z',
            thumbnails: {
              default: { url: 'https://i.ytimg.com/vi/kJQP7kiw5Fk/default.jpg' }
            }
          }
        }
      ]
      setLoadingProgress(80)
      setVideos(mockVideoResults)
      setSelectedVideo(mockVideoResults[0])
      setLoadingProgress(100)
    }

    if (!API_KEY || !BASE_URL) {
        console.warn('API_KEY or BASE_URL is missing. Using mock data.')
        handleMockData()
        return
    }

    await axios
      .get(`${BASE_URL}/search?part=snippet&maxResults=12&key=${API_KEY}&q=${query}`)
      .then(response => {
        const videoResults = response.data.items.filter(item => item.id.kind === "youtube#video")
        setLoadingProgress(80)

        setVideos(videoResults)
        setSelectedVideo(videoResults[0])

        setLoadingProgress(100)

      })
      .catch(error => {
        console.error('API request failed. Falling back to mock data.', error)
        handleMockData()
      })
  }
  const aiKeywords = [
    'agentic ai workflows',
    'autonomous ai agents',
    'large language models',
    'prompt engineering techniques',
    'retrieval augmented generation',
    'gpt-4 applications',
    'machine learning tutorials',
    'deep learning crash course',
    'open source ai models',
    'artificial general intelligence',
    'ai software engineering',
    'agentic workflows in production',
    'designing machine learning systems',
    'deploying large language models',
    'llm evaluation and metrics',
    'operationalizing llms',
    'vector databases and embeddings',
    'fine tuning llms in production',
    'mlops and ai engineering',
    'streaming machine learning data',
    'ai product manager',
    'director of product management'
  ];

  useEffect(() => {
    const randomKeyword = aiKeywords[Math.floor(Math.random() * aiKeywords.length)];
    fetchVideos(randomKeyword)
  }, [])



  return (
    <div className="flex flex-col w-full h-screen bg-gray-100 antialiased">
      <Header handleSubmit={fetchVideos} />
      <LoadingBar
        progress={loadingProgress}
        height={3}
        color='red'
      />

      <div className="lg:flex mx-6 mt-4">
        {selectedVideo && <VideoDetails video={selectedVideo} />}

        {videos && <VideosList videos={videos} handleClick={playVideoOnClick} />}
      </div>
    </div>
  )
}