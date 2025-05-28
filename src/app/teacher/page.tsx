'use client'

import { useState } from 'react'
import Editor from '@monaco-editor/react'

interface TeachingSession {
  id: string
  topic: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  learningStyle: 'Visual' | 'Interactive' | 'Theoretical'
  progress: number
  currentModule: string
  modules: LearningModule[]
}

interface LearningModule {
  id: string
  title: string
  content: string
  type: 'explanation' | 'example' | 'exercise' | 'quiz'
  completed: boolean
  code?: string
  quiz?: {
    question: string
    options: string[]
    correctAnswer: number
  }
}

const SAMPLE_SESSION: TeachingSession = {
  id: 'session-1',
  topic: 'JavaScript Fundamentals',
  difficulty: 'Beginner',
  learningStyle: 'Interactive',
  progress: 0,
  currentModule: 'mod-1',
  modules: [
    {
      id: 'mod-1',
      title: 'Variables and Data Types',
      content: 'Let\'s understand how variables work in JavaScript...',
      type: 'explanation',
      completed: false
    },
    {
      id: 'mod-2',
      title: 'Working with Variables',
      content: 'Here\'s an example of using variables:',
      type: 'example',
      completed: false,
      code: `// Declaring variables
let name = "John";
const age = 25;

// Using variables
console.log(\`My name is \${name} and I am \${age} years old.\`);

`
    },
    {
      id: 'mod-3',
      title: 'Practice Time',
      content: 'Create variables for a user profile:',
      type: 'exercise',
      completed: false,
      code: `// TODO: Create variables for:
// 1. User's email (string)
// 2. User's age (number)
// 3. Is premium user (boolean)
// 4. User's hobbies (array)
`
    },
    {
      id: 'mod-4',
      title: 'Quick Check',
      content: 'Let\'s test your understanding:',
      type: 'quiz',
      completed: false,
      quiz: {
        question: 'Which of the following is a correct way to declare a constant in JavaScript?',
        options: [
          'const name = "John";',
          'let const name = "John";',
          'constant name = "John";',
          'var const name = "John";'
        ],
        correctAnswer: 0
      }
    }
  ]
}

export default function TeacherPage() {
  const [session, setSession] = useState<TeachingSession>(SAMPLE_SESSION)
  const [userCode, setUserCode] = useState('')
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [feedback, setFeedback] = useState('')

  const currentModule = session.modules.find(m => m.id === session.currentModule)

  const handleNextModule = () => {
    const currentIndex = session.modules.findIndex(m => m.id === session.currentModule)
    if (currentIndex < session.modules.length - 1) {
      setSession(prev => ({
        ...prev,
        currentModule: session.modules[currentIndex + 1].id,
        progress: ((currentIndex + 1) / (session.modules.length - 1)) * 100
      }))
    }
  }

  const handleCodeChange = (value: string | undefined) => {
    if (!value) return
    setUserCode(value)
    // TODO: Implement real-time code analysis and feedback
    setFeedback('Looking good! Consider adding comments to explain your code.')
  }

  const handleQuizAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    if (currentModule?.type === 'quiz' && currentModule.quiz) {
      const isCorrect = answerIndex === currentModule.quiz.correctAnswer
      setFeedback(isCorrect ? 'Correct! Well done!' : 'Not quite. Try again!')
    }
  }

  const renderModule = () => {
    if (!currentModule) return null

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">{currentModule.title}</h2>
        <p className="text-gray-600">{currentModule.content}</p>

        {currentModule.type === 'example' && currentModule.code && (
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <Editor
              height="200px"
              defaultLanguage="javascript"
              value={currentModule.code}
              theme="vs-light"
              options={{ readOnly: true, minimap: { enabled: false } }}
            />
          </div>
        )}

        {currentModule.type === 'exercise' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg overflow-hidden">
              <Editor
                height="200px"
                defaultLanguage="javascript"
                value={userCode || currentModule.code}
                onChange={handleCodeChange}
                theme="vs-light"
                options={{ minimap: { enabled: false } }}
              />
            </div>
            {feedback && (
              <div className="bg-blue-50 text-blue-700 p-4 rounded-lg">
                {feedback}
              </div>
            )}
          </div>
        )}

        {currentModule.type === 'quiz' && currentModule.quiz && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold mb-4">{currentModule.quiz.question}</h3>
              <div className="space-y-2">
                {currentModule.quiz.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuizAnswer(index)}
                    className={`w-full p-3 text-left rounded-lg transition-colors ${
                      selectedAnswer === index
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            {feedback && (
              <div className={`p-4 rounded-lg ${
                feedback.includes('Correct')
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}>
                {feedback}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{session.topic}</h1>
              <p className="text-gray-600">
                Level: {session.difficulty} | Style: {session.learningStyle}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-indigo-600">
                {Math.round(session.progress)}%
              </div>
              <div className="text-sm text-gray-500">Progress</div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all"
              style={{ width: `${session.progress}%` }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-8">
          {/* Current Module */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            {renderModule()}
          </div>

          {/* Navigation */}
          <div className="flex justify-end">
            <button
              onClick={handleNextModule}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Next Module
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}