import React from 'react'
import moment from 'moment'

export const VideoItem = ({video, handleClick}) => {
    return (
            <div className="flex" onClick={()=>handleClick(video)}>
                <img src={video.snippet.thumbnails.default.url} alt={video.title} />
                <div className="mx-2">
                    <p className="text-sm">{video.snippet.title}</p>
                    <p className="text-gray-700 text-xs">{video.snippet.channelTitle}</p>
                    <p className="text-gray-700 text-xs">{moment(video.snippet.publishedAt).startOf('day').fromNow()}</p>
                </div>
            </div>
    )
}

