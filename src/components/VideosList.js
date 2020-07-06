import React from 'react'
import { VideoItem } from './VideoItem'

export const VideosList = ({ videos, handleClick }) => {
    return (
        <ul className="w-full mt-6 lg:mt-0 lg:w-1/3 lg:ml-6">
            {videos &&
                videos.map(video => (
                    <li key={video.id.videoId || video.id.channelId} className="mb-2 cursor-pointer">
                        <VideoItem video={video} handleClick={handleClick}/>
                    </li>

                ))
            }
        </ul>
    )
}
