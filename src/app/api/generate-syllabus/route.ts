import { NextResponse } from 'next/server';
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

    // 1. Search YouTube for the best educational video
    const searchResult = await ytSearch(query + " course OR tutorial");
    const topVideo = searchResult.videos[0];

    if (!topVideo) {
      return NextResponse.json({ error: 'No video found for this query' }, { status: 404 });
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
      You are an expert educational AI. 
      Topic: ${query}
      Video Title: ${topVideo.title}
      Transcript Snippet: ${transcriptText}

      Create a learning syllabus that maps to this video.
      Identify 2-3 conceptual boundaries in the topic where a student should be tested.
      
      Output MUST be a valid JSON object matching this schema exactly:
      {
        "videoId": "${topVideo.videoId}",
        "questions": [
          {
            "id": "q1",
            "timestamp": number (in seconds, e.g., 60, 120),
            "type": "mcq" | "free-text",
            "text": "The question text",
            "options": ["option 1", "option 2", "option 3", "option 4"], // only if type is "mcq"
            "correctAnswer": "0" (index of correct option as string for mcq) OR "string match" (for free-text),
            "hint": "A helpful hint if they get it wrong",
            "remediationTimestamp": number (in seconds, slightly before the question timestamp)
          }
        ]
      }
      
      Respond ONLY with valid JSON. No markdown formatting.
    `;

    const response = await openai.chat.completions.create({
      model: 'deepseek-chat',
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
      throw new Error("Failed to parse JSON from AI response: " + parseError.message);
    }
    
    // Ensure videoId matches what we found
    domainContent.videoId = topVideo.videoId;

    return NextResponse.json(domainContent);

  } catch (error: any) {
    console.error('Error generating syllabus:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
