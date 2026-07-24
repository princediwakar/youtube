import { NextResponse } from 'next/server';
// @ts-ignore
import ytSearch from 'yt-search';
import { YoutubeTranscript } from 'youtube-transcript';
import OpenAI from 'openai';

// Initialize DeepSeek client using the OpenAI SDK
const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY || 'dummy_key',
});


export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    console.log(`Generating syllabus for: ${query}`);


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
      const searchResult = await ytSearch(advancedQuery);
      
      // Filter out common mega-channels that dominate tech searches if the user wants diverse/western creators
      const excludedChannels = ['apnacollege', 'chaiaurcode', 'simplilearn', 'edureka', 'codewithharry', 'telusko', 'krishnaik', 'geeksforgeeks', 'programmingwithmosh'];
      
      topVideo = searchResult.videos.find((video: any) => {
        // Strip all whitespace from the channel name to make the match foolproof against spacing
        const channelName = (video.author?.name?.toLowerCase() || '').replace(/\s+/g, '');
        const title = (video.title?.toLowerCase() || '').replace(/\s+/g, '');
        
        // Skip if channel name is in our exclusion list
        if (excludedChannels.some(excluded => channelName.includes(excluded))) return false;
        
        return true;
      }) || searchResult.videos[0]; // fallback to first if all are filtered out
    }


    if (!topVideo) {
      console.log('No video found, using fallback.');
      topVideo = { videoId: 'dQw4w9WgXcQ', title: 'Fallback Video' };
    }

    console.log(`Found video: ${topVideo.title} (ID: ${topVideo.videoId})`);

    // 2. Fetch transcript
    let transcriptText = "";
    try {
      const transcript = await YoutubeTranscript.fetchTranscript(topVideo.videoId);
      transcriptText = transcript.map(t => t.text).join(' ').substring(0, 5000); // Limit to first 5000 chars for prompt length
    } catch (e) {
      console.log('Transcript failed, falling back to empty text');
      // If transcript fails, we just rely on general LLM knowledge
    }

    // 3. Generate JSON with DeepSeek
    const prompt = `
      You are an expert educational AI designing an 11-star learning experience. 
      Topic: ${query}
      Video Title: ${topVideo.title}
      Transcript Snippet: ${transcriptText}

      Create a learning syllabus that maps to this video.
      Identify 2-3 conceptual boundaries in the topic where a student should be tested.
      CRITICAL: Choose timestamps that occur during natural scene changes, breath pauses, or at the end of a sentence for a 'cinematic transition'.
      
      Output MUST be a valid JSON object matching this schema exactly:
      {
        "videoId": "${topVideo.videoId}",
        "title": "Mastery Track: ${query}",
        "questions": [
          {
            "id": "q1",
            "timestamp": number (in seconds, e.g., 60, 120),
            "type": "mcq" | "free-text" | "code",
            "text": "The question text",
            "options": ["option 1", "option 2", "option 3", "option 4"], // only if type is "mcq"
            "codeSnippet": "function test() { _____ }", // only if type is "code"
            "correctAnswer": "0" (index of correct option for mcq) OR "string match" (for free-text or code),
            "hint": "A helpful hint if they get it wrong to be used by the AI tutor.",
            "remediationTimestamp": number (in seconds, slightly before the question timestamp)
          }
        ]
      }
      
      Respond ONLY with valid JSON. No markdown formatting.
      CRITICAL: Ensure any code snippets properly escape newlines (\\n) and double quotes (\\") to remain valid JSON.
    `;

    const response = await openai.chat.completions.create({
      model: 'deepseek-v4-flash',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0].message.content;
    
    if (!content) {
      throw new Error("Failed to generate content");
    }

    let domainContent;
    try {
      // Find the first '{' and the last '}' to extract the JSON object, ignoring any other text/markdown
      const firstBrace = content.indexOf('{');
      const lastBrace = content.lastIndexOf('}');
      
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const jsonString = content.substring(firstBrace, lastBrace + 1);
        domainContent = JSON.parse(jsonString);
      } else {
        throw new Error("No JSON object found in the response");
      }
    } catch (parseError: any) {
      console.error("Failed to parse JSON. Raw content:", content);
      domainContent = {
        title: "Mastery Track: " + query,
        questions: []
      };
    }
    
    // Ensure videoId matches what we found
    domainContent.videoId = topVideo.videoId;

    return NextResponse.json(domainContent);

  } catch (error: any) {
    console.error('Error generating syllabus:', error);
    return NextResponse.json({
      videoId: "dQw4w9WgXcQ", 
      title: "Mastery Track",
      questions: []
    }, { status: 200 });
  }
}
