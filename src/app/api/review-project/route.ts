import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '../rate-limit';

interface AiFeedbackRequest {
  code: string;
  taskTitle: string;
  taskDescription: string;
  taskRequirements: string[];
}

interface AiFeedbackResponse {
  codeStructure: string;
  functionality: string;
  efficiency: string;
  correctness: string;
  suggestions?: string[]; // Optional suggestions for improvement
  score: number; // out of 10
}

// Define the expected structure of the LLM's JSON output
interface LLMReviewResponse {
  review: AiFeedbackResponse;
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
    const { code, taskTitle, taskDescription, taskRequirements } = await request.json() as AiFeedbackRequest;

    if (!code || !taskTitle) {
      return NextResponse.json({ error: 'Code and taskTitle are required' }, { status: 400 });
    }

    const requirementsString = taskRequirements ? taskRequirements.join('\n- ') : 'No specific requirements listed.';

    const prompt = `
      You are an expert code reviewer and AI programming tutor.
      Review the following code submission for the project titled "${taskTitle}".

      Project Description: ${taskDescription}
      Project Requirements:
      - ${requirementsString}

      Submitted Code:
      \`\`\`
      ${code}
      \`\`\`

      Please provide feedback on the following aspects:
      1.  "codeStructure": (string) How well is the code organized? Are components/functions well-defined? Is it readable?
      2.  "functionality": (string) Does the code appear to meet the project requirements based on a static analysis?
      3.  "efficiency": (string) Are there any obvious performance issues or areas for optimization?
      4.  "correctness": (string) Are there any apparent logical errors, bugs, or deviations from best practices?
      5.  "suggestions": (optional array of strings) Provide 2-3 specific, actionable suggestions for improvement if applicable.
      6.  "score": (number) Assign an overall score out of 10 for this submission.

      Return the response as a single JSON object with a key "review" which is an object containing these feedback points.
      Ensure the JSON is well-formed.

      Example for the "review" object:
      {
        "codeStructure": "The code is well-structured with clear separation of concerns.",
        "functionality": "The core functionality of the TODO app (add, complete, delete) seems to be implemented.",
        "efficiency": "No major efficiency concerns for an app of this scale.",
        "correctness": "The use of LocalStorage for persistence is correct. Consider adding error handling for LocalStorage operations.",
        "suggestions": ["Add input validation for new tasks.", "Consider using a unique ID generator for tasks instead of array index."],
        "score": 8
      }
    `;

    // You can choose a different model available on OpenRouter, potentially one good at code analysis.
    // e.g., "openai/gpt-4", "anthropic/claude-2"
    const model = "openai/gpt-3.5-turbo"; // Using gpt-3.5-turbo for cost/speed, consider gpt-4 for better review

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: "You are an expert code reviewer. Output JSON only." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("OpenRouter API Error (Project Review):", response.status, errorBody);
      return NextResponse.json({ error: `Failed to fetch from OpenRouter: ${response.statusText}`, details: errorBody }, { status: response.status });
    }

    const data = await response.json();
    const llmResponseContent = data.choices?.[0]?.message?.content;

    if (!llmResponseContent) {
        console.error("No content in OpenRouter response (Project Review):", data);
        return NextResponse.json({ error: 'No content received from OpenRouter model for project review' }, { status: 500 });
    }
    
    let parsedReview: LLMReviewResponse;
    try {
        parsedReview = JSON.parse(llmResponseContent) as LLMReviewResponse;
    } catch (e) {
        console.error("Failed to parse LLM response JSON (Project Review):", e, "\nRaw content:", llmResponseContent);
        return NextResponse.json({ error: 'Failed to parse project review from OpenRouter. The model might not have returned valid JSON.', rawResponse: llmResponseContent }, { status: 500 });
    }

    if (!parsedReview.review) {
      console.error("Invalid review structure from OpenRouter:", parsedReview);
      return NextResponse.json({ error: 'Invalid review structure received from OpenRouter' }, { status: 500 });
    }

    return NextResponse.json({ review: parsedReview.review });

  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || 'Internal server error' }, { status: 500 });
  }
}