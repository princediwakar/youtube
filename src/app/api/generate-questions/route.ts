import { NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';
import OpenAI from 'openai';

// Initialize DeepSeek client using the OpenAI SDK
const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY || 'dummy_key',
});


export async function POST(req: Request) {
  try {
    const { videoId, title, query } = await req.json();

    if (!videoId || !title) {
      return NextResponse.json({ error: 'videoId and title are required' }, { status: 400 });
    }

    console.log(`Generating questions for video: ${title} (ID: ${videoId}) with query: ${query}`);

    // 2. Fetch transcript with timestamp formatting
    let transcriptText = "";
    try {
      const transcript = await YoutubeTranscript.fetchTranscript(videoId);
      // Determine if timestamps are in milliseconds (srv3 format) or seconds (classic format)
      const isMs = transcript.some(t => t.offset > 36000) || (transcript.length > 1 && (transcript[1].offset - transcript[0].offset) > 50);
      
      transcriptText = transcript.map(t => {
        const sec = Math.round(isMs ? t.offset / 1000 : t.offset);
        const mins = Math.floor(sec / 60);
        const remSecs = sec % 60;
        const timeFormatted = `${mins}:${remSecs < 10 ? '0' : ''}${remSecs}`;
        return `[${timeFormatted} (${sec}s)] ${t.text}`;
      }).join(' ').substring(0, 25000); // Allow up to 25k chars for comprehensive coverage
    } catch (e) {
      console.log('Transcript failed, falling back to empty text');
      // If transcript fails, we just rely on general LLM knowledge
    }

    // 3. Generate JSON with DeepSeek
    const prompt = `
      You are an elite educational AI designing an 11-star learning and assessment mastery track for a video.
      Topic / Target Domain: ${query || title}
      Video Title: ${title}
      Transcript Snippet (with [M:SS (Xs)] timestamp markers):
      ${transcriptText || "No transcript available. Design foundational mastery questions based on the topic and title."}

      Create an engaging, pedagogical learning syllabus that maps directly to this video.
      Identify 3-5 conceptual boundaries or critical learning milestones in the topic where a student should be challenged with a Flashpoint checkpoint.

      CRITICAL TIMING & TRANSITION RULES:
      1. EXACT TIMESTAMPS: You MUST select question timestamps (in seconds) that match exact second markers (Xs) from the transcript snippet provided. If no transcript is available, space checkpoints logically (e.g., 60, 150, 240 seconds).
      2. NATURAL BOUNDARIES: Place checkpoints at natural scene changes, topic transitions, breath pauses, or sentence completions so the video auto-pauses smoothly without interrupting mid-sentence.
      3. REMEDIATION TIMESTAMPS: For each question, provide a "remediationTimestamp" (in seconds) pointing to 15-40 seconds BEFORE the question timestamp, exactly where the video began explaining that specific concept.

      CRITICAL QUESTION QUALITY RULES:
      1. HIGH COGNITIVE DEPTH: Ask conceptual, analytical, problem-solving, or scenario-based questions. NEVER ask trivial recall or superficial memory trivia (e.g., avoid "What did the speaker say at 2:00?" or "What acronym was mentioned?"). Test true understanding of WHY and HOW.
      2. QUESTION VARIETY: Mix different question types across the checkpoints:
         - "mcq": Multiple choice questions with 4 plausible, well-articulated, distinct options. No joke options or "All/None of the above".
         - "code": Fill-in-the-blank code challenges (if the topic is technical/coding). Provide a concise "codeSnippet" with exactly one "______" (6 underscores) representing a key missing syntax, function, parameter, or keyword.
         - "free-text": Open-ended analytical explanation challenges requiring student synthesis.
      3. ACTIONABLE HINTS: Provide a pedagogical "hint" for each question that guides conceptual reasoning without revealing the exact answer.

      Output MUST be a valid JSON object matching this schema exactly:
      {
        "videoId": "${videoId}",
        "title": "Mastery Track: ${query || title}",
        "summaryNotes": "4-6 concise, high-yield bullet points summarizing core concepts and architectural takeaways from the video based on the transcript.",
        "nextRecommendedQuery": "A compelling, related search query (2-4 words) for the student's next step in mastery.",
        "questions": [
          {
            "id": "q1",
            "timestamp": number (in seconds, e.g., 45, 120),
            "type": "mcq" | "free-text" | "code",
            "text": "The challenging question text testing conceptual mastery",
            "options": ["Option 1", "Option 2", "Option 3", "Option 4"], // Required ONLY if type is "mcq"
            "codeSnippet": "const result = array.______((acc, val) => acc + val, 0);", // Required ONLY if type is "code"
            "correctAnswer": "0" (index 0-3 as string for mcq) OR "reduce" (exact string match for code or keyword for free-text),
            "hint": "Pedagogical guidance to nudge them towards the concept if stuck.",
            "remediationTimestamp": number (in seconds, e.g., 20, 95)
          }
        ]
      }
      
      Respond ONLY with valid JSON. No markdown formatting or extra commentary.
      CRITICAL: Ensure any code snippets and summary notes properly escape newlines (\\n) and double quotes (\\") to remain valid JSON.
    `;

    const response = await openai.chat.completions.create({
      model: 'deepseek-v4-pro',
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
        title: "Mastery Track: " + (query || title),
        questions: []
      };
    }
    
    // Ensure videoId matches what we found and validate/sanitize questions
    domainContent.videoId = videoId;
    if (Array.isArray(domainContent.questions)) {
      domainContent.questions = domainContent.questions
        .filter((q: any) => q && typeof q.timestamp === 'number' && q.timestamp > 0 && q.text)
        .map((q: any, idx: number) => ({
          ...q,
          id: q.id || `q-${idx + 1}`,
          timestamp: Math.round(q.timestamp),
          remediationTimestamp: typeof q.remediationTimestamp === 'number' && q.remediationTimestamp >= 0 
            ? Math.min(Math.round(q.remediationTimestamp), Math.round(q.timestamp) - 5)
            : Math.max(0, Math.round(q.timestamp) - 30)
        }))
        .sort((a: any, b: any) => a.timestamp - b.timestamp);
    }

    return NextResponse.json(domainContent);

  } catch (error: any) {
    console.error('Error generating questions:', error);
    return NextResponse.json({
      videoId: "dQw4w9WgXcQ", 
      title: "Mastery Track",
      questions: []
    }, { status: 200 });
  }
}
