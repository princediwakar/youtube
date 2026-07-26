import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY || 'dummy_key',
});

export async function POST(req: Request) {
  let isInsightRequest = false;
  try {
    const { chatHistory, question, wrongAnswer, contextHint } = await req.json();

    if (!chatHistory || !question) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    isInsightRequest = wrongAnswer === "User requested insight card";
    let systemPrompt = '';
    
    if (isInsightRequest) {
      systemPrompt = `You are an elite educational AI. The user requested an "Insight Card" because they are stuck on this concept: "${question.text}".
Provide a concise, vivid analogy or a one-sentence TLDR that instantly clarifies the concept. Do NOT ask a guiding question. Give them the "aha" moment directly. Keep it under 2 sentences. Respond in English.`;
    } else {
      systemPrompt = `You are an elite, empathetic AI tutor using the Socratic method.
The user just answered a question incorrectly.
Question: "${question.text}"
Their wrong answer/attempt: "${wrongAnswer}"
Hint for the correct path: "${contextHint}"

Your goal is to NOT give them the exact correct answer directly. Instead, gently point out the flaw in their reasoning and ask a guiding question to lead them to the correct answer. Be concise and conversational (1-2 sentences maximum). Respond in English.`;
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      ...chatHistory
    ];

    let content: string | null = null;
    try {
      const response = await openai.chat.completions.create({
        model: 'deepseek-v4-flash',
        messages: messages as any,
      });
      content = response.choices[0]?.message?.content || null;
    } catch (e: any) {
      console.warn('deepseek-v4-flash failed in tutor API, falling back to deepseek-v4-pro:', e?.message || e);
      const fallbackRes = await openai.chat.completions.create({
        model: 'deepseek-v4-pro',
        messages: messages as any,
      });
      content = fallbackRes.choices[0]?.message?.content || null;
    }

    if (!content) {
      throw new Error("Failed to generate response from AI tutor.");
    }

    return NextResponse.json({ content });
  } catch (error: any) {
    console.error('Error in tutor API:', error);
    const fallbackMessage = isInsightRequest 
      ? "Here is a quick insight: Break this concept down into its core components and consider how they interact in the video example."
      : "Let's rethink this step by step. What key assumption in your answer might conflict with what was just explained in the video?";
    return NextResponse.json({ content: fallbackMessage }, { status: 200 });
  }
}

