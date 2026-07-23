import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY || 'dummy_key',
});

export async function POST(req: Request) {
  try {
    const { chatHistory, question, wrongAnswer, contextHint } = await req.json();

    if (!chatHistory || !question) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const isInsightRequest = wrongAnswer === "User requested insight card";
    let systemPrompt = '';
    
    if (isInsightRequest) {
      systemPrompt = `You are an elite educational AI. The user requested an "Insight Card" because they are stuck on this concept: "${question.text}".
Provide a concise, vivid analogy or a one-sentence TLDR that instantly clarifies the concept. Do NOT ask a guiding question. Give them the "aha" moment directly. Keep it under 2 sentences.`;
    } else {
      systemPrompt = `You are an elite, empathetic AI tutor using the Socratic method.
The user just answered a question incorrectly.
Question: "${question.text}"
Their wrong answer/attempt: "${wrongAnswer}"
Hint for the correct path: "${contextHint}"

Your goal is to NOT give them the exact correct answer directly. Instead, gently point out the flaw in their reasoning and ask a guiding question to lead them to the correct answer. Be concise and conversational (1-2 sentences maximum).`;
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      ...chatHistory
    ];

    const response = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: messages as any,
    });

    const content = response.choices[0].message.content;

    return NextResponse.json({ content });
  } catch (error: any) {
    console.error('Error in tutor API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
