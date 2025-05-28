import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '../rate-limit';

interface VivaChatRequest {
  topic: string;
  questionHistory?: { question: string; answer?: string }[]; // Optional history of previous Q&A
  userAnswer?: string; // User's answer to the last AI question
  currentQuestionId?: string; // ID of the question the user is answering
}

interface VivaAIResponse {
  nextQuestion?: {
    id: string;
    text: string;
  };
  feedbackOnAnswer?: string; // AI's immediate feedback on the user's last answer
  isFinalQuestion?: boolean; // Flag if this is the last question
  overallSessionFeedback?: string; // If it's the end of the session
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
    const { topic, questionHistory = [], userAnswer, currentQuestionId } = await request.json() as VivaChatRequest;

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    // Construct a more conversational prompt
    let promptContent = `You are an AI interviewer conducting a viva session on the topic: "${topic}".
Keep your questions concise and focused. Ask one question at a time.
The goal is to assess the user's understanding through a series of 3-5 questions.
`;

    if (questionHistory.length > 0) {
      promptContent += "\n\nConversation History:\n";
      questionHistory.forEach((item, index) => {
        promptContent += `AI Question ${index + 1}: ${item.question}\n`;
        if (item.answer) {
          promptContent += `User Answer ${index + 1}: ${item.answer}\n`;
        }
      });
    }

    if (userAnswer && currentQuestionId) {
        // Find the question text for the currentQuestionId to provide context if needed
        const lastAiQuestion = questionHistory.find(q => q.question.includes(currentQuestionId)); // Simplistic find
        promptContent += `\nThe user just answered "${userAnswer}" to your question "${lastAiQuestion ? lastAiQuestion.question : 'your previous question'}".\n`;
        promptContent += `Provide brief feedback on this answer (1-2 sentences) and then ask the next relevant question.`;
    } else if (questionHistory.length === 0) {
        promptContent += `\nStart by asking the first question.`;
    } else {
        promptContent += `\nAsk the next relevant question based on the conversation so far.`;
    }
    
    // Determine if it's time to conclude (e.g., after 3 questions for this mock setup)
    const MAX_QUESTIONS = 3; 
    if (questionHistory.length >= MAX_QUESTIONS && userAnswer) { // If last answer submitted
        promptContent += `\nThis was the last question. Provide overall feedback for the session based on all answers and conclude the viva.`;
    }


    const model = "openai/gpt-3.5-turbo"; // Or a more conversational model

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: "You are a friendly and professional AI interviewer for technical vivas. Respond with a JSON object containing 'nextQuestion.id', 'nextQuestion.text', and optionally 'feedbackOnAnswer' or 'overallSessionFeedback'." },
          { role: "user", content: promptContent }
        ],
        // Attempt to get JSON directly if model supports it, otherwise parse from content
         response_format: { type: "json_object" }, 
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("OpenRouter API Error (Viva Chat):", response.status, errorBody);
      return NextResponse.json({ error: `Failed to fetch from OpenRouter: ${response.statusText}`, details: errorBody }, { status: response.status });
    }

    const data = await response.json();
    const llmResponseContent = data.choices?.[0]?.message?.content;

    if (!llmResponseContent) {
        console.error("No content in OpenRouter response (Viva Chat):", data);
        return NextResponse.json({ error: 'No content received from OpenRouter model for viva chat' }, { status: 500 });
    }

    try {
        const parsedResponse = JSON.parse(llmResponseContent) as VivaAIResponse;
        
        // Add a fallback ID for the next question if not provided
        if (parsedResponse.nextQuestion && !parsedResponse.nextQuestion.id) {
            parsedResponse.nextQuestion.id = `viva_q_${Date.now()}`;
        }
        
        // Determine if this is the final question based on our MAX_QUESTIONS logic
        if (questionHistory.length >= MAX_QUESTIONS -1 && userAnswer && parsedResponse.nextQuestion) {
             // If we asked MAX_QUESTIONS and user answered, the *next* interaction is feedback
        } else if (questionHistory.length >= MAX_QUESTIONS && !parsedResponse.nextQuestion && parsedResponse.overallSessionFeedback) {
            // This means the LLM is giving final feedback
        }


        return NextResponse.json(parsedResponse);
    } catch (e) {
        console.error("Failed to parse LLM response JSON (Viva Chat):", e, "\nRaw content:", llmResponseContent);
        // Fallback: if JSON parsing fails, return the raw text as a simple question
        // This is a basic fallback, ideally the LLM should always return JSON
        return NextResponse.json({ nextQuestion: { id: `viva_q_fallback_${Date.now()}`, text: llmResponseContent } });
    }

  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || 'Internal server error' }, { status: 500 });
  }
}