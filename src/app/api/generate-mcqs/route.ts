import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { checkRateLimit } from '../rate-limit';

// Define the expected structure for an MCQ item
interface MCQItem {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string; // This should be one of the strings from options
  explanation: string;
}

// Define the expected structure of the LLM's JSON output
interface LLMResponse {
  mcqs: MCQItem[];
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Rate limit exceeded. Please try again later.' }, { status: 429 });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'OpenRouter API key not configured' }, { status: 500 });
  }

  try {
    const { topic, count = 5 } = await request.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const prompt = `
      Generate ${count} multiple-choice questions (MCQs) for the topic: "${topic}".
      Each MCQ should have a unique "id" (string, e.g., "q1", "q2"), a "question" (string),
      an array of 4 "options" (array of strings), the "correctAnswer" (string, which must be one of the options),
      and a brief "explanation" (string) for the correct answer.

      Return the response as a single JSON object with a key "mcqs" which is an array of these MCQ objects.
      Ensure the JSON is well-formed.

      Example for one MCQ object:
      {
        "id": "q1",
        "question": "What is the capital of France?",
        "options": ["Berlin", "Madrid", "Paris", "Rome"],
        "correctAnswer": "Paris",
        "explanation": "Paris is the capital and most populous city of France."
      }
    `;

    // You can choose a different model available on OpenRouter
    // For example: "openai/gpt-3.5-turbo", "anthropic/claude-2", "google/gemini-pro"
    // Check OpenRouter documentation for available models and their identifiers.
    const model = "openai/gpt-3.5-turbo"; 

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: "You are an expert quiz generator. Output JSON only." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }, // Request JSON output if model supports it
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("OpenRouter API Error:", response.status, errorBody);
      return NextResponse.json({ error: `Failed to fetch from OpenRouter: ${response.statusText}`, details: errorBody }, { status: response.status });
    }

    const data = await response.json();
    const llmResponseContent = data.choices?.[0]?.message?.content;

    if (!llmResponseContent) {
        console.error("No content in OpenRouter response:", data);
        return NextResponse.json({ error: 'No content received from OpenRouter model' }, { status: 500 });
    }

    // The content might be a stringified JSON, so parse it.
    let parsedMcqs: LLMResponse;
    try {
        parsedMcqs = JSON.parse(llmResponseContent) as LLMResponse;
    } catch (e) {
        console.error("Failed to parse LLM response JSON:", e, "\nRaw content:", llmResponseContent);
        return NextResponse.json({ error: 'Failed to parse MCQs from OpenRouter response. The model might not have returned valid JSON.', rawResponse: llmResponseContent }, { status: 500 });
    }
    

    if (!parsedMcqs.mcqs || !Array.isArray(parsedMcqs.mcqs)) {
      console.error("Invalid MCQs structure from OpenRouter:", parsedMcqs);
      return NextResponse.json({ error: 'Invalid MCQs structure received from OpenRouter' }, { status: 500 });
    }
    
    // Add unique IDs if the model didn't provide them consistently or to ensure client-side uniqueness
    const finalMcqs = parsedMcqs.mcqs.map((mcq, index) => ({
        ...mcq,
        id: mcq.id || `gen_q${index + 1}` // Fallback ID
    }));


    return NextResponse.json({ mcqs: finalMcqs });

  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || 'Internal server error' }, { status: 500 });
  }
}