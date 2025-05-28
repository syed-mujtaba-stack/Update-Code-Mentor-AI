'use client'

import { useState, useEffect, useCallback } from 'react'
// import Link from 'next/link' // Not used yet, but might be useful
// import { useUser } from '@clerk/nextjs'; // Import if user-specific data is needed on this page

interface MCQ {
  id: string
  question: string
  options: string[]
  correctAnswer: string // Store the correct answer text or index
  explanation?: string
}

// Function to fetch MCQs from our API endpoint
async function fetchMcqsFromApi(topic: string, count: number = 5): Promise<MCQ[]> {
  console.log(`Fetching ${count} MCQs for topic: ${topic} from API`);
  try {
    const response = await fetch('/api/generate-mcqs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic, count }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to fetch MCQs from API:', errorData);
      // You might want to throw an error or return a default/empty array
      // For now, let's alert and return empty to prevent breaking the UI entirely
      alert(`Error fetching MCQs: ${errorData.error || response.statusText}`);
      return [];
    }

    const data = await response.json();
    if (!data.mcqs || !Array.isArray(data.mcqs)) {
      console.error('Invalid MCQs data structure from API:', data);
      alert('Received invalid MCQs data from the server.');
      return [];
    }
    return data.mcqs as MCQ[];
  } catch (error) {
    console.error('Error calling /api/generate-mcqs:', error);
    alert(`An unexpected error occurred while fetching MCQs: ${(error as Error).message}`);
    return [];
  }
}


export default function McqsPage() {
  // const { user, isSignedIn, isLoaded } = useUser(); // Uncomment if needed for user data

  const [selectedTopic, setSelectedTopic] = useState<string>('JavaScript Concepts')
  const [mcqs, setMcqs] = useState<MCQ[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [quizState, setQuizState] = useState<'selecting' | 'in-progress' | 'completed'>('selecting')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [score, setScore] = useState<number>(0)
  const [timeLeft, setTimeLeft] = useState<number>(0); // Time in seconds
  const [timerActive, setTimerActive] = useState<boolean>(false);

  const QUIZ_DURATION_PER_QUESTION = 60; // 60 seconds per question

  const topics = [
    'Coding Basics',
    'JavaScript Concepts',
    'React Fundamentals',
    'Node.js',
    'Python Basics',
    'AI Prompt Engineering',
    'OOP in C++',
  ]

  const handleStartQuiz = async () => {
    if (!selectedTopic) return;
    setIsLoading(true);
    setQuizState('in-progress');
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setScore(0);
    const fetchedMcqs = await fetchMcqsFromApi(selectedTopic, 5); // Fetch 5 MCQs
    if (fetchedMcqs && fetchedMcqs.length > 0) {
      setMcqs(fetchedMcqs);
      setTimeLeft(fetchedMcqs.length * QUIZ_DURATION_PER_QUESTION);
      setTimerActive(true);
    } else {
      // Handle case where no MCQs are fetched (e.g., API error)
      setMcqs([]);
      setTimerActive(false);
    }
    setIsLoading(false);
  }

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  const handleSubmitQuiz = useCallback(() => {
    let currentScore = 0;
    mcqs.forEach(mcq => {
      if (selectedAnswers[mcq.id] === mcq.correctAnswer) {
        currentScore++;
      }
    });
    setScore(currentScore);
    setQuizState('completed');
    setTimerActive(false); // Stop timer on manual submit
  }, [mcqs, selectedAnswers]);

  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
      return () => clearInterval(timerId);
    } else if (timerActive && timeLeft === 0) {
      setTimerActive(false);
      handleSubmitQuiz(); // Auto-submit when time is up
      alert("Time's up! Your quiz has been submitted.");
    }
  }, [timerActive, timeLeft, handleSubmitQuiz]);
  
  const currentQuestion = mcqs[currentQuestionIndex];

  // Clerk's middleware handles redirection.
  // Add a loading state or check `isLoaded` from `useUser` if needed before rendering.
  // For simplicity, assuming middleware has done its job if this component renders.

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            MCQs Mode (AI Generated Quizzes)
          </h1>
        </div>
      </header>
      <main>
        <div className="max-w-4xl mx-auto py-10 sm:px-6 lg:px-8">
          {quizState === 'selecting' && (
            <div className="bg-white shadow sm:rounded-lg p-6">
              <h3 className="text-xl leading-6 font-medium text-gray-900 mb-4">Select a Topic</h3>
              <div className="mb-6">
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
                  Choose a topic for your quiz:
                </label>
                <select
                  id="topic"
                  name="topic"
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  {topics.map(topic => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleStartQuiz}
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? 'Loading Quiz...' : 'Start Quiz'}
              </button>
            </div>
          )}

          {quizState === 'in-progress' && isLoading && (
            <div className="text-center p-6">
              <p className="text-lg text-gray-700">Generating your quiz... Please wait.</p>
              {/* Add a spinner or loading animation here */}
            </div>
          )}

          {quizState === 'in-progress' && !isLoading && currentQuestion && (
            <div className="bg-white shadow sm:rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Question {currentQuestionIndex + 1} of {mcqs.length}</h3>
                {timerActive && (
                  <div className="text-lg font-semibold text-indigo-600">
                    Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </div>
                )}
              </div>
              <p className="text-xl text-gray-700 mb-6">{currentQuestion.question}</p>
              <div className="space-y-4">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(currentQuestion.id, option)}
                    className={`w-full text-left p-4 border rounded-md transition-colors 
                                ${selectedAnswers[currentQuestion.id] === option 
                                  ? 'bg-indigo-100 border-indigo-500 ring-2 ring-indigo-500' 
                                  : 'bg-white hover:bg-gray-50 border-gray-300'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                {currentQuestionIndex < mcqs.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIndex(prev => Math.min(mcqs.length - 1, prev + 1))}
                    className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitQuiz}
                    className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    Submit Quiz
                  </button>
                )}
              </div>
            </div>
          )}
          
          {quizState === 'completed' && (
            <div className="bg-white shadow sm:rounded-lg p-6">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Quiz Completed!</h3>
              <p className="text-xl text-gray-700 mb-6">Your score: {score} out of {mcqs.length}</p>
              <div className="space-y-4">
                {mcqs.map((mcq, index) => (
                  <div key={mcq.id} className="p-4 border rounded-md bg-gray-50">
                    <p className="font-semibold text-gray-800">Q{index + 1}: {mcq.question}</p>
                    <p className={`mt-1 ${selectedAnswers[mcq.id] === mcq.correctAnswer ? 'text-green-600' : 'text-red-600'}`}>
                      Your answer: {selectedAnswers[mcq.id] || 'Not answered'}
                    </p>
                    <p className="mt-1 text-blue-700">
                      Correct answer: {mcq.correctAnswer}
                    </p>
                    {mcq.explanation && (
                      <div className="mt-2 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                        <strong>Explanation:</strong> {mcq.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  setQuizState('selecting');
                  setTimerActive(false); // Reset timer state
                  setTimeLeft(0);
                }}
                className="mt-8 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Take Another Quiz
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}