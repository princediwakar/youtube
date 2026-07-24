import { NextResponse } from 'next/server';
// @ts-ignore
import ytSearch from 'yt-search';

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    console.log(`Searching video for: ${query}`);

    // 0. Check if the query is actually a direct YouTube URL
    let explicitVideoId = null;
    const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = query.match(ytRegex);
    if (match && match[1]) {
      explicitVideoId = match[1];
      console.log(`Detected direct YouTube URL. Extracting ID: ${explicitVideoId}`);
    }

    let topVideo;

    if (explicitVideoId) {
      // If a URL was provided, bypass search and mock a topVideo object
      topVideo = { videoId: explicitVideoId, title: "Custom Video URL" };
    } else {
      // 1. Search YouTube for the best educational video
      // Append negative keywords to filter out regional content and force English
      const advancedQuery = `${query} (course OR tutorial) English`;
      const searchResult = await ytSearch({
        query: advancedQuery,
        gl: 'US',
        hl: 'en'
      });
      
      // Filter out common mega-channels that dominate tech searches if the user wants diverse/western creators
      const excludedChannels = ['apnacollege', 'chaiaurcode', 'simplilearn', 'edureka', 'codewithharry', 'telusko', 'krishnaik', 'geeksforgeeks', 'programmingwithmosh'];
      const nonEnglishTitleKeywords = ['hindi', 'हिंदी', 'urdu', 'bangla', 'tamil', 'telugu', 'marathi', 'punjabi', 'gujarati', 'kannada', 'malayalam', 'français', 'español', 'deutsch', 'italiano', 'português', 'türkçe', 'русский', '日本語', '中文', '한국어', '阿拉伯'];
      
      topVideo = searchResult.videos.find((video: any) => {
        const channelName = (video.author?.name?.toLowerCase() || '').replace(/\s+/g, '');
        const title = video.title?.toLowerCase() || '';
        
        // Skip if channel name is in our exclusion list
        if (excludedChannels.some(excluded => channelName.includes(excluded))) return false;
        
        // Skip if the video title contains non-English language indicators
        if (nonEnglishTitleKeywords.some(kw => title.includes(kw.toLowerCase()))) return false;
        
        return true;
      }) || searchResult.videos[0]; // fallback to first if all are filtered out
    }

    if (!topVideo) {
      console.log('No video found, using fallback.');
      topVideo = { videoId: 'dQw4w9WgXcQ', title: 'Fallback Video' };
    }

    console.log(`Found video: ${topVideo.title} (ID: ${topVideo.videoId})`);

    return NextResponse.json({
      videoId: topVideo.videoId,
      title: topVideo.title
    });

  } catch (error: any) {
    console.error('Error searching video:', error);
    return NextResponse.json({
      videoId: "dQw4w9WgXcQ", 
      title: "Mastery Track"
    }, { status: 200 });
  }
}
