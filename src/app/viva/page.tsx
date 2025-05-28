'use client'

import { useState, useRef } from 'react' // Removed useEffect
// import { useUser } from '@clerk/nextjs'; // Import if user-specific data is needed

// Interfaces for Viva Mode
interface VivaQuestion {
  id: string;
  text: string;
}

interface VivaQuestionHistoryItem {
  questionText: string; // Storing text for context in prompt
  questionId: string;
  answer: string;
}

// Simplified feedback structure based on what viva-chat API provides
interface VivaSessionFeedback {
  overallSessionFeedback?: string;
  // We can add score or other detailed fields if API evolves
}

// API response structure from /api/viva-chat
interface VivaAIAPIResponse {
  nextQuestion?: VivaQuestion;
  feedbackOnAnswer?: string;
  overallSessionFeedback?: string;
}

const ALL_TOPICS = [
  'Coding Basics',
  'JavaScript Concepts',
  'React Fundamentals',
  'Node.js',
  'Python Basics',
  'AI Prompt Engineering',
  // Add more topics as needed
];

export default function VivaPage() {
  // const { user, isSignedIn, isLoaded } = useUser(); // Uncomment if needed

  const [selectedTopic, setSelectedTopic] = useState<string>(ALL_TOPICS[0]);
  const [interviewState, setInterviewState] = useState<'selecting' | 'in-progress' | 'completed'>('selecting');
  
  const [currentQuestion, setCurrentQuestion] = useState<VivaQuestion | null>(null);
  const [questionHistory, setQuestionHistory] = useState<VivaQuestionHistoryItem[]>([]);
  
  const [currentAnswer, setCurrentAnswer] = useState<string>('');
  const [immediateFeedback, setImmediateFeedback] = useState<string | null>(null); // For feedback on individual answers
  const [finalFeedback, setFinalFeedback] = useState<VivaSessionFeedback | null>(null); // For overall session feedback
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const callVivaApi = async (payload: unknown): Promise<VivaAIAPIResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/viva-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `API Error: ${response.status}`);
      }
      return await response.json() as VivaAIAPIResponse;
    } catch (err) {
      console.error("Viva API call failed:", err);
      setError((err as Error).message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartInterview = async () => {
    if (!selectedTopic) {
      setError("Please select a topic.");
      return;
    }
    setInterviewState('in-progress');
    setCurrentQuestion(null);
    setQuestionHistory([]);
    setCurrentAnswer('');
    setImmediateFeedback(null);
    setFinalFeedback(null);

    const apiResponse = await callVivaApi({ topic: selectedTopic });
    if (apiResponse?.nextQuestion) {
      setCurrentQuestion(apiResponse.nextQuestion);
    } else if (!apiResponse) {
      // Error handled by callVivaApi, potentially reset state
      setInterviewState('selecting');
    }
  };

  const handleSubmitAnswer = async () => {
    if (!currentQuestion || currentAnswer.trim() === '') {
      setError("Please provide an answer.");
      return;
    }

    const newHistoryItem: VivaQuestionHistoryItem = {
      questionId: currentQuestion.id,
      questionText: currentQuestion.text, // Store text for context
      answer: currentAnswer,
    };
    const updatedHistory = [...questionHistory, newHistoryItem];
    setQuestionHistory(updatedHistory);
    
    setImmediateFeedback(null); // Clear previous immediate feedback

    const apiResponse = await callVivaApi({
      topic: selectedTopic,
      questionHistory: updatedHistory.map(h => ({ question: h.questionText, answer: h.answer })), // API expects question text
      userAnswer: currentAnswer,
      currentQuestionId: currentQuestion.id,
    });

    setCurrentAnswer(''); // Clear input field

    if (apiResponse) {
      if (apiResponse.feedbackOnAnswer) {
        setImmediateFeedback(apiResponse.feedbackOnAnswer);
      }
      if (apiResponse.nextQuestion) {
        setCurrentQuestion(apiResponse.nextQuestion);
      } else if (apiResponse.overallSessionFeedback) {
        // Interview ended by AI
        setFinalFeedback({ overallSessionFeedback: apiResponse.overallSessionFeedback });
        setCurrentQuestion(null);
        setInterviewState('completed');
      } else if (!apiResponse.nextQuestion && !apiResponse.overallSessionFeedback) {
        // Unexpected: AI didn't provide next question or final feedback
        setError("The AI did not provide a next step. The interview may have ended unexpectedly.");
        setInterviewState('completed'); // Or 'selecting'
        setFinalFeedback({ overallSessionFeedback: "Interview concluded unexpectedly."});
      }
    } else {
      // Error occurred, callVivaApi already set the error message
      // Potentially reset to selection or show error prominently
    }
  };
  
  // Text-to-speech for question
  const speakQuestion = (text: string) => {
    if ('speechSynthesis' in window) {
      const utter = new window.SpeechSynthesisUtterance(text);
      utter.lang = 'en-US';
      setIsSpeaking(true);
      utter.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utter);
    }
  };

  // Speech-to-text for answer
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser.');
      return;
    }
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setCurrentAnswer(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    setIsListening(true);
    recognition.start();
    recognitionRef.current = recognition;
  };
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Clerk's middleware handles redirection.
  // Add a loading state or check `isLoaded` from `useUser` if needed before rendering.

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Viva Mode (AI Interview)
          </h1>
        </div>
      </header>
      <main>
        <div className="max-w-3xl mx-auto py-10 sm:px-6 lg:px-8">
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-400 rounded">
              <p><strong>Error:</strong> {error}</p>
            </div>
          )}

          {interviewState === 'selecting' && (
            <div className="bg-white shadow sm:rounded-lg p-6">
              <h3 className="text-xl leading-6 font-medium text-gray-900 mb-4">Start Your AI Coding Interview</h3>
              <p className="text-sm text-gray-500 mb-6">Select a topic to begin your AI interview. The AI will ask you questions and provide feedback.</p>
              
              <div className="mb-6">
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Topic
                </label>
                <select
                  id="topic"
                  name="topic"
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  {ALL_TOPICS.map(topic => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
              </div>
              
              <button
                type="button"
                onClick={handleStartInterview}
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? 'Starting...' : 'Start Interview'}
              </button>
              
              <div className="mt-8">
                <h4 className="text-md font-medium text-gray-900 mb-2">How It Works (Simplified for Text Input):</h4>
                <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                  <li>Select a topic to focus your interview on.</li>
                  <li>AI will ask you coding questions one by one.</li>
                  <li>Type your answers in the provided text area.</li>
                  <li>AI will analyze your answers (mock analysis for now).</li>
                  <li>Receive detailed feedback at the end.</li>
                </ol>
              </div>
            </div>
          )}

          {interviewState === 'in-progress' && (
            <div className="bg-white shadow sm:rounded-lg p-6">
              {isLoading && !currentQuestion && <p className="text-center text-gray-600">Loading first question...</p>}
              
              {currentQuestion && (
                <>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    AI Asks (Question {questionHistory.length + 1}):
                  </h3>
                  <p className="text-xl text-gray-700 mb-4 bg-gray-50 p-3 rounded flex items-center gap-2">
                    {currentQuestion.text}
                    <button
                      type="button"
                      className="ml-2 px-2 py-1 rounded bg-gradient-to-r from-indigo-400 to-fuchsia-400 text-white text-xs font-semibold shadow hover:scale-105 transition"
                      onClick={() => speakQuestion(currentQuestion.text)}
                      disabled={isSpeaking}
                      title="Listen to question"
                    >
                      {isSpeaking ? 'Speaking...' : '🔊 Listen'}
                    </button>
                  </p>
                  
                  {immediateFeedback && (
                    <div className="my-4 p-3 bg-blue-50 text-blue-700 border-l-4 border-blue-400 rounded">
                      <strong>AI Explanation:</strong> {immediateFeedback}
                    </div>
                  )}

                  <div className="flex gap-2 mb-2">
                    <button
                      type="button"
                      className={`px-3 py-1 rounded bg-gradient-to-r from-pink-400 to-indigo-400 text-white text-xs font-semibold shadow ${isListening ? 'opacity-60' : 'hover:scale-105'} transition`}
                      onClick={isListening ? stopListening : startListening}
                      disabled={isListening}
                      title="Answer by speaking"
                    >
                      {isListening ? 'Listening...' : '🎤 Speak Answer'}
                    </button>
                    <span className="text-xs text-gray-400">or type below</span>
                  </div>
                  <textarea
                    rows={6}
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Type your answer here or use the mic..."
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={isLoading || currentAnswer.trim() === ''}
                    className="mt-6 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {isLoading ? 'Processing...' : 'Submit Answer'}
                  </button>
                </>
              )}
              {isLoading && currentQuestion && <p className="text-center text-gray-600 mt-4">Loading next question or feedback...</p>}
            </div>
          )}

          {interviewState === 'completed' && finalFeedback && (
            <div className="bg-white shadow sm:rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Interview Completed</h2>
              <div className="space-y-3 text-gray-700 p-4 bg-gray-50 rounded">
                <p><strong>Overall Session Feedback from AI:</strong></p>
                <p>{finalFeedback.overallSessionFeedback || "No overall feedback provided."}</p>
              </div>
              <button
                onClick={() => {
                  setInterviewState('selecting');
                  setCurrentQuestion(null);
                  setQuestionHistory([]);
                  setFinalFeedback(null);
                  setError(null);
                  setImmediateFeedback(null);
                }}
                className="mt-8 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Start New Interview
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}