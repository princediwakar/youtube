import React, { useState, useEffect } from 'react';
import { Header, VideoDetails, VideosList } from './components'
import axios from 'axios';
import LoadingBar from 'react-top-loading-bar'


const API_KEY = process.env.REACT_APP_API_KEY
const BASE_URL = process.env.REACT_APP_BASE_URL


export const App = () => {
  const [videos, setVideos] = useState([])
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [loadingProgress, setLoadingProgress] = useState(0)


  const playVideoOnClick = (videoId) =>
    setSelectedVideo(videoId)


  const fetchVideos = async (query) => {
    setLoadingProgress(30)
    await axios
      .get(`${BASE_URL}/search?part=snippet&maxResults=6&key=${API_KEY}&q=${query}`)
      .then(response => {
        const videoResults = response.data.items.filter(item => item.id.kind === "youtube#video")
        setLoadingProgress(80)

        setVideos(videoResults)
        setSelectedVideo(videoResults[0])

        setLoadingProgress(100)

      })
      .catch(error => console.log('!!Something went wrong!!'))
  }

  useEffect(() => {
    fetchVideos('learn react')
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