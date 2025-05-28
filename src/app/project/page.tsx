'use client'

import { useState } from 'react'
import Editor from '@monaco-editor/react';
// import { useUser } from '@clerk/nextjs'; // Import if user-specific data is needed

type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'

interface ProjectTask {
  title: string
  description: string
  requirements: string[]
}

interface AiFeedback {
  codeStructure: string;
  functionality: string;
  efficiency: string;
  correctness: string;
  suggestions?: string[];
  score: number; // out of 10
}

// Mock function to get project task based on difficulty
const getMockProjectTask = (difficulty: Difficulty): ProjectTask => {
  if (difficulty === 'Beginner') {
    return {
      title: 'Simple Counter App',
      description: 'Create a simple counter application using React.',
      requirements: [
        'Display a number (the count).',
        'Have two buttons: one to increment the count and one to decrement.',
        'The count should not go below 0.',
      ],
    }
  } else if (difficulty === 'Intermediate') {
    return {
      title: 'TODO App with LocalStorage',
      description: 'Create a TODO application that saves tasks to LocalStorage.',
      requirements: [
        'Allow users to add new tasks.',
        'Display a list of tasks.',
        'Allow users to mark tasks as completed.',
        'Allow users to delete tasks.',
        'Persist tasks in LocalStorage so they remain after a page refresh.',
      ],
    }
  } else {
    // Advanced
    return {
      title: 'Basic Weather App',
      description: 'Create a weather application that fetches data from a free weather API.',
      requirements: [
        'Allow users to search for a city.',
        'Display current weather information (e.g., temperature, humidity, condition).',
        'Handle API errors gracefully.',
        'Bonus: Show a 3-day forecast.',
      ],
    }
  }
}

// Function to get AI code review from our API endpoint
const getAiFeedbackFromApi = async (
  code: string,
  task: ProjectTask
): Promise<AiFeedback | null> => {
  console.log(`Requesting AI review for task: ${task.title}`);
  try {
    const response = await fetch('/api/review-project', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        taskTitle: task.title,
        taskDescription: task.description,
        taskRequirements: task.requirements,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to fetch project review from API:', errorData);
      alert(`Error fetching project review: ${errorData.error || response.statusText}`);
      return null;
    }

    const data = await response.json();
    if (!data.review) {
      console.error('Invalid review data structure from API:', data);
      alert('Received invalid review data from the server.');
      return null;
    }
    return data.review as AiFeedback;
  } catch (error) {
    console.error('Error calling /api/review-project:', error);
    alert(`An unexpected error occurred while fetching project review: ${(error as Error).message}`);
    return null;
  }
}

export default function ProjectPage() {
  // const { user, isSignedIn, isLoaded } = useUser(); // Uncomment if needed

  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('Beginner')
  const [projectTask, setProjectTask] = useState<ProjectTask | null>(null)
  const [userCode, setUserCode] = useState<string>('')
  const [aiFeedback, setAiFeedback] = useState<AiFeedback | null>(null)
  const [isLoadingTask, setIsLoadingTask] = useState<boolean>(false)
  const [isReviewing, setIsReviewing] = useState<boolean>(false)

  const difficulties: Difficulty[] = ['Beginner', 'Intermediate', 'Advanced']

  const handleSelectDifficulty = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty)
    setProjectTask(null) // Clear previous task
    setAiFeedback(null) // Clear previous feedback
    setUserCode('') // Clear previous code
  }

  const handleGetProjectTask = () => {
    setIsLoadingTask(true)
    // Simulate fetching task
    setTimeout(() => {
      setProjectTask(getMockProjectTask(selectedDifficulty))
      setIsLoadingTask(false)
    }, 500)
  }

  const handleSubmitCode = async () => {
    if (!userCode || !projectTask) return
    setIsReviewing(true)
    setAiFeedback(null)
    const feedback = await getAiFeedbackFromApi(userCode, projectTask)
    if (feedback) {
      setAiFeedback(feedback)
    }
    setIsReviewing(false)
  }
  
  // Clerk's middleware handles redirection.
  // Add a loading state or check `isLoaded` from `useUser` if needed before rendering.

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Project Mode (Mini Project + AI Review)
          </h1>
        </div>
      </header>
      <main>
        <div className="max-w-4xl mx-auto py-10 sm:px-6 lg:px-8">
          <div className="bg-white shadow sm:rounded-lg p-6 mb-8">
            <h3 className="text-xl leading-6 font-medium text-gray-900 mb-4">Select Project Difficulty</h3>
            <div className="flex space-x-4 mb-6">
              {difficulties.map(diff => (
                <button
                  key={diff}
                  onClick={() => handleSelectDifficulty(diff)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                    ${selectedDifficulty === diff 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  {diff}
                </button>
              ))}
            </div>
            <button
              onClick={handleGetProjectTask}
              disabled={isLoadingTask}
              className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoadingTask ? 'Loading Task...' : `Get ${selectedDifficulty} Project Task`}
            </button>
          </div>

          {projectTask && (
            <div className="bg-white shadow sm:rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">{projectTask.title}</h2>
              <p className="text-gray-600 mb-4">{projectTask.description}</p>
              <h4 className="text-md font-medium text-gray-700 mb-2">Requirements:</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-1 mb-6">
                {projectTask.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
              
              <div>
                <label htmlFor="userCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Code Submission:
                </label>
                <div className="mt-1 border border-gray-300 rounded-md shadow-sm overflow-hidden">
                  <Editor
                    height="400px" // Adjust height as needed
                    defaultLanguage="javascript" // Set default language, can be dynamic
                    defaultValue="// Start coding here..."
                    value={userCode}
                    onChange={(value) => setUserCode(value || '')}
                    theme="vs-dark" // Or "light"
                    options={{
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      fontSize: 14,
                      wordWrap: 'on',
                    }}
                  />
                </div>
              </div>
              <button
                onClick={handleSubmitCode}
                disabled={isReviewing || !userCode.trim()}
                className="mt-6 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {isReviewing ? 'AI Reviewing Code...' : 'Submit Code for AI Review'}
              </button>
            </div>
          )}

          {aiFeedback && (
            <div className="bg-white shadow sm:rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">AI Feedback</h2>
              <div className="space-y-3">
                <div><strong>Overall Score:</strong> {aiFeedback.score} / 10</div>
                <div><strong>Code Structure:</strong> {aiFeedback.codeStructure}</div>
                <div><strong>Functionality:</strong> {aiFeedback.functionality}</div>
                <div><strong>Efficiency:</strong> {aiFeedback.efficiency}</div>
                <div><strong>Correctness:</strong> {aiFeedback.correctness}</div>
                {aiFeedback.suggestions && aiFeedback.suggestions.length > 0 && (
                  <div>
                    <strong>Suggestions for Improvement:</strong>
                    <ul className="list-disc list-inside ml-4 text-sm">
                      {aiFeedback.suggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  setProjectTask(null);
                  setAiFeedback(null);
                  setUserCode('');
                }}
                className="mt-6 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Start New Project Task
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}