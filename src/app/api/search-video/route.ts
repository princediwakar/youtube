import { NextResponse } from 'next/server';

// Channel-level blocklist (normalised, no spaces)
const EXCLUDED_CHANNELS = [
  'apnacollege', 'chaiaurcode', 'simplilearn', 'edureka', 'codewithharry',
  'telusko', 'krishnaik', 'geeksforgeeks', 'programmingwithmosh',
  'rachanaranade', 'carachana', 'labmumbai', 'finology', 'zerodha',
  'anilsinghvi', 'nptel', 'unacademy', 'byjus', 'vedantu', 'physicswallah',
  'careerride', 'intellipaat', 'javapoint', 'tutorialspoint'
];

// Title-level blocklist
const BLOCKED_TITLE_PATTERNS = [
  'hindi', 'हिंदी', 'urdu', 'bangla', 'tamil', 'telugu',
  'marathi', 'punjabi', 'gujarati', 'kannada', 'malayalam',
  'français', 'español', 'deutsch', 'italiano', 'português',
  'türkçe', 'русский', '日本語', '中文', '한국어',
  'by ca ', '| ca ', 'ca rachana', 'ca ranade',
  'in hindi', 'in urdu', 'in tamil', 'in telugu', 'in bangla'
];

function isAllowed(channelTitle: string, videoTitle: string, strict = true): boolean {
  const ch = channelTitle.toLowerCase().replace(/\s+/g, '');
  const t = videoTitle.toLowerCase();
  if (EXCLUDED_CHANNELS.some(ex => ch.includes(ex))) return false;
  if (BLOCKED_TITLE_PATTERNS.some(p => t.includes(p.toLowerCase()))) return false;
  return true;
}

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    console.log(`Searching video for: ${query}`);

    // 0. Check if the query is a direct YouTube URL
    const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const urlMatch = query.match(ytRegex);
    if (urlMatch?.[1]) {
      console.log(`Direct YouTube URL detected. ID: ${urlMatch[1]}`);
      return NextResponse.json({ videoId: urlMatch[1], title: 'Custom Video URL' });
    }

    // 1. Use YouTube Data API v3 (works reliably in serverless / Vercel production)
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    if (!apiKey) throw new Error('YouTube API key not configured');

    const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
    searchUrl.searchParams.set('part', 'snippet');
    searchUrl.searchParams.set('q', `${query} explained`);
    searchUrl.searchParams.set('type', 'video');
    searchUrl.searchParams.set('maxResults', '20');
    searchUrl.searchParams.set('relevanceLanguage', 'en');
    searchUrl.searchParams.set('regionCode', 'US');
    searchUrl.searchParams.set('videoEmbeddable', 'true');
    searchUrl.searchParams.set('key', apiKey);

    const ytRes = await fetch(searchUrl.toString());
    if (!ytRes.ok) {
      const errBody = await ytRes.text();
      throw new Error(`YouTube API error ${ytRes.status}: ${errBody}`);
    }

    const ytData = await ytRes.json();
    const items: any[] = ytData.items || [];

    // 2. Apply blocklist filters — strict first, then relaxed
    let topItem =
      items.find(item => {
        const ch = item.snippet?.channelTitle || '';
        const t = item.snippet?.title || '';
        return isAllowed(ch, t, true);
      }) ||
      items.find(item => {
        const ch = item.snippet?.channelTitle || '';
        const t = item.snippet?.title || '';
        // relaxed: only channel blocklist
        return !EXCLUDED_CHANNELS.some(ex => ch.toLowerCase().replace(/\s+/g, '').includes(ex));
      }) ||
      items[0];

    if (!topItem) {
      console.log('No video found via API, using fallback.');
      return NextResponse.json({ videoId: 'dQw4w9WgXcQ', title: 'Fallback Video' });
    }

    const videoId = topItem.id?.videoId;
    const title = topItem.snippet?.title || 'Educational Video';
    console.log(`Found video: ${title} (ID: ${videoId})`);

    return NextResponse.json({ videoId, title });

  } catch (error: any) {
    console.error('Error searching video:', error);
    return NextResponse.json({
      videoId: 'dQw4w9WgXcQ',
      title: 'Mastery Track'
    }, { status: 200 });
  }
}
