import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'nodejs';
export const maxDuration = 30;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

type ChatMessage = { role: 'user' | 'assistant'; content: string };

export async function POST(req: NextRequest) {
  try {
    const { messages, documentContext, documentTitle } = await req.json() as {
      messages: ChatMessage[];
      documentContext: string;
      documentTitle?: string;
    };

    if (!messages || !documentContext) {
      return NextResponse.json({ error: 'Missing messages or document context.' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Build the full prompt with document context + conversation history
    const history = messages
      .slice(0, -1) // all except last message
      .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n');

    const lastMessage = messages[messages.length - 1];

    const prompt = `You are SmartRead's document assistant. Help users understand the document "${documentTitle || 'Untitled'}".

RULES:
- Answer ONLY based on the document content below
- Always cite page numbers when referencing information (e.g., "As mentioned on page 3...")
- If the answer is not in the document, say so clearly
- Keep answers concise and well-structured
- Be friendly but professional

DOCUMENT CONTENT:
${documentContext.slice(0, 40000)}

${history ? `CONVERSATION SO FAR:\n${history}\n` : ''}
User: ${lastMessage.content}
Assistant:`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    return NextResponse.json({ reply });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Chat failed';
    console.error('[chat]', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
