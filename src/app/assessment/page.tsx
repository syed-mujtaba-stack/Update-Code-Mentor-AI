'use client'

import { useState } from 'react'
import Editor from '@monaco-editor/react'

interface Assessment {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  timeLimit: number // in minutes
  questions: AssessmentQuestion[]
}

interface AssessmentQuestion {
  id: string
  type: 'coding' | 'multiple-choice' | 'short-answer'
  question: string
  points: number
  codeTemplate?: string
  options?: string[]
  correctAnswer?: string | string[]
  testCases?: TestCase[]
}

interface TestCase {
  input: string
  expectedOutput: string
  description: string
}

const SAMPLE_ASSESSMENT: Assessment = {
  id: 'js-fundamentals',
  title: 'JavaScript Fundamentals Assessment',
  description: 'Test your knowledge of JavaScript basics including variables, functions, and control flow.',
  category: 'JavaScript',
  difficulty: 'Beginner',
  timeLimit: 30,
  questions: [
    {
      id: 'q1',
      type: 'multiple-choice',
      question: 'Which of the following is a primitive type in JavaScript?',
      points: 5,
      options: ['Array', 'Object', 'undefined', 'Function'],
      correctAnswer: 'undefined'
    },
    {
      id: 'q2',
      type: 'coding',
      question: 'Write a function that returns the sum of all numbers in an array.',
      points: 10,
      codeTemplate: `function arraySum(numbers) {
  // Your code here
}`,
      testCases: [
        {
          input: '[1, 2, 3, 4]',
          expectedOutput: '10',
          description: 'Sum of positive numbers'
        },
        {
          input: '[-1, 0, 1]',
          expectedOutput: '0',
          description: 'Sum including negative numbers'
        }
      ]
    },
    {
      id: 'q3',
      type: 'short-answer',
      question: 'Explain the difference between let and const in JavaScript.',
      points: 5,
      correctAnswer: ['block scope', 'reassignment', 'mutable']
    }
  ]
}

export default function AssessmentPage() {
  const [assessment] = useState<Assessment>(SAMPLE_ASSESSMENT)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [timeRemaining, setTimeRemaining] = useState(assessment.timeLimit * 60) // in seconds
  const [isSubmitted, setIsSubmitted] = useState(false)

  const currentQuestion = assessment.questions[currentQuestionIndex]

  const handleAnswerChange = (answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }))
  }

  const handleSubmit = () => {
    setIsSubmitted(true)
    // TODO: Implement submission logic and scoring
    alert('Assessment submitted!')
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Assessment Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">{assessment.title}</h1>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                assessment.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                assessment.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {assessment.difficulty}
              </span>
              <span className="text-xl font-mono bg-gray-100 px-4 py-2 rounded">
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>
          <p className="text-gray-600">{assessment.description}</p>
        </div>

        {/* Question Navigation */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {assessment.questions.map((q, index) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${currentQuestionIndex === index
                  ? 'bg-indigo-600 text-white'
                  : answers[q.id]
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                  }`}
              >
                <span>Q{index + 1}</span>
                <span className="text-xs">{q.points} pts</span>
              </button>
            ))}
          </div>
        </div>

        {/* Question Content */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Question {currentQuestionIndex + 1}
            </h2>
            <p className="text-gray-600 mb-4">{currentQuestion.question}</p>
            <div className="text-sm text-gray-500 mb-4">
              Points: {currentQuestion.points}
            </div>
          </div>

          {/* Question Input Based on Type */}
          {currentQuestion.type === 'coding' && (
            <div className="h-[400px] border rounded-lg overflow-hidden">
              <Editor
                height="100%"
                language="javascript"
                value={answers[currentQuestion.id] || currentQuestion.codeTemplate}
                onChange={(value) => handleAnswerChange(value)}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                }}
              />
            </div>
          )}

          {currentQuestion.type === 'multiple-choice' && (
            <div className="space-y-4">
              {currentQuestion.options?.map((option) => (
                <label
                  key={option}
                  className={`block p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                    answers[currentQuestion.id] === option ? 'border-indigo-500 bg-indigo-50' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    value={option}
                    checked={answers[currentQuestion.id] === option}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    className="mr-3"
                  />
                  {option}
                </label>
              ))}
            </div>
          )}

          {currentQuestion.type === 'short-answer' && (
            <textarea
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
              className="w-full h-32 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Type your answer here..."
            />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          {currentQuestionIndex === assessment.questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitted}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              Submit Assessment
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.min(assessment.questions.length - 1, prev + 1))}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  )
}