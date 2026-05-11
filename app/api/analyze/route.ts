import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import pdf from 'pdf-parse';

export const runtime = 'nodejs';
export const maxDuration = 60;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Please upload a PDF file.' }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File must be under 10MB.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const pdfData = await pdf(buffer);
    const rawText = pdfData.text?.trim();
    const numPages = pdfData.numpages;

    if (!rawText) {
      return NextResponse.json(
        { error: 'Could not extract text. The PDF may be scanned/image-based.' },
        { status: 400 }
      );
    }

    const truncatedText = rawText.slice(0, 50000);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are SmartRead, an expert document analyst. Analyze the document below and return ONLY a valid JSON object — no markdown, no backticks, no explanation.

Use this exact structure:
{
  "title": "inferred document title",
  "summary": "A clear 2-3 paragraph executive summary",
  "keyInsights": [
    { "point": "insight text", "importance": "high", "page": 1 },
    { "point": "insight text", "importance": "medium", "page": 2 },
    { "point": "insight text", "importance": "low", "page": 3 },
    { "point": "insight text", "importance": "high", "page": 4 },
    { "point": "insight text", "importance": "medium", "page": 5 }
  ],
  "actionItems": ["action 1", "action 2", "action 3"],
  "themes": ["Theme One", "Theme Two", "Theme Three"],
  "documentType": "report",
  "readingTime": "X min read",
  "wordCount": 1234
}

Rules:
- "importance" must be exactly one of: "high", "medium", "low"
- "documentType" must be exactly one of: "report", "contract", "research", "manual", "proposal", "other"
- Return ONLY the JSON object, nothing else

Document (${numPages} pages, filename: "${file.name}"):
${truncatedText}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    let analysis;
    try {
      const clean = text.replace(/```json|```/g, '').trim();
      analysis = JSON.parse(clean);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        analysis = JSON.parse(match[0]);
      } else {
        throw new Error('AI returned invalid JSON. Please try again.');
      }
    }

    return NextResponse.json({ analysis, rawText: truncatedText, numPages, fileName: file.name });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Analysis failed';
    console.error('[analyze]', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
