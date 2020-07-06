import React from 'react'

export const VideoDetails = ({ video }) => {
    if (!video) return <div>Loading...</div>

    const videoSrc = `https://www.youtube.com/embed/${video.id.videoId}`

    return (
        <div className="w-full lg:w-2/3">
            <div className="embed-responsive aspect-ratio-16/9">
                <iframe
                    title="Video Player"
                    height="100%" width="100%"
                    className="embed-responsive-item"
                    src={videoSrc}
                    frameBorder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen>
                </iframe>
            </div>
            <div className="pt-4">
                <h2 className="text-xl font-medium">{video.snippet.title}</h2>
                <h2 className="font-semibold mt-2">{video.snippet.channelTitle}</h2>
                <p className="text-sm mt-4">{video.snippet.description}</p>
            </div>
        </div>
    )
}


