'use client'

import { useState } from 'react'
import Editor from '@monaco-editor/react'

interface CodeReview {
  id: string
  title: string
  description: string
  language: string
  codeToReview: string
  feedback: ReviewFeedback[]
  status: 'pending' | 'in_review' | 'completed'
  submittedAt: string
  completedAt?: string
}

interface ReviewFeedback {
  id: string
  lineNumber: number
  type: 'suggestion' | 'issue' | 'praise'
  comment: string
  severity?: 'low' | 'medium' | 'high'
  codeSnippet?: string
}

const SAMPLE_CODE_REVIEW: CodeReview = {
  id: 'review-1',
  title: 'React Component Optimization',
  description: 'Please review my React component for performance and best practices',
  language: 'typescript',
  status: 'in_review',
  submittedAt: new Date().toISOString(),
  codeToReview: `import React, { useState, useEffect } from 'react';

interface Props {
  items: string[];
}

const ItemList = (props: Props) => {
  const [items, setItems] = useState(props.items);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setItems(props.items);
  }, [props.items]);

  const handleClick = (index) => {
    const newItems = items;
    newItems.splice(index, 1);
    setItems(newItems);
  };

  return (
    <div>
      {items.map((item, index) => (
        <div onClick={() => handleClick(index)}>
          {item}
        </div>
      ))}
    </div>
  );
};

export default ItemList;`,
  feedback: [
    {
      id: 'f1',
      lineNumber: 8,
      type: 'suggestion',
      comment: 'Consider using React.memo() to prevent unnecessary re-renders if parent component updates frequently.',
      severity: 'medium'
    },
    {
      id: 'f2',
      lineNumber: 15,
      type: 'issue',
      comment: 'Avoid using useEffect for state synchronization. Props.items can be used directly.',
      severity: 'high',
      codeSnippet: '// Remove useEffect and use props.items directly in the component'
    },
    {
      id: 'f3',
      lineNumber: 18,
      type: 'issue',
      comment: 'Mutating state directly can cause issues. Create a new array instead.',
      severity: 'high',
      codeSnippet: `const handleClick = (index) => {
  const newItems = [...items];
  newItems.splice(index, 1);
  setItems(newItems);
};`
    },
    {
      id: 'f4',
      lineNumber: 24,
      type: 'issue',
      comment: 'Missing key prop in mapped elements can cause performance issues.',
      severity: 'medium',
      codeSnippet: '<div key={index} onClick={() => handleClick(index)}>'
    },
    {
      id: 'f5',
      lineNumber: 1,
      type: 'praise',
      comment: 'Good use of TypeScript interfaces for props typing.',
      severity: 'low'
    }
  ]
}

export default function CodeReviewPage() {
  const [review, setReview] = useState<CodeReview>(SAMPLE_CODE_REVIEW)
  const [selectedFeedback, setSelectedFeedback] = useState<ReviewFeedback | null>(null)
  const [newComment, setNewComment] = useState('')

  const handleAddComment = () => {
    if (!newComment.trim()) return

    const newFeedback: ReviewFeedback = {
      id: `f${review.feedback.length + 1}`,
      lineNumber: selectedFeedback ? selectedFeedback.lineNumber : 1,
      type: 'suggestion',
      comment: newComment,
      severity: 'medium'
    }

    setReview(prev => ({
      ...prev,
      feedback: [...prev.feedback, newFeedback]
    }))
    setNewComment('')
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Review Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{review.title}</h1>
              <p className="text-gray-600">{review.description}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                review.status === 'completed' ? 'bg-green-100 text-green-800' :
                review.status === 'in_review' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-600'
              }`}>
                {review.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Code Editor */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="h-[600px]">
              <Editor
                height="100%"
                language={review.language}
                value={review.codeToReview}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  renderLineHighlight: 'all',
                }}
              />
            </div>
          </div>

          {/* Feedback Panel */}
          <div className="space-y-6">
            {/* Feedback List */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Review Feedback</h2>
              <div className="space-y-4">
                {review.feedback.map((feedback) => (
                  <div
                    key={feedback.id}
                    onClick={() => setSelectedFeedback(feedback)}
                    className={`p-4 rounded-lg cursor-pointer ${
                      selectedFeedback?.id === feedback.id
                        ? 'bg-indigo-50 border-2 border-indigo-500'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          feedback.type === 'issue' ? 'bg-red-100 text-red-800' :
                          feedback.type === 'suggestion' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {feedback.type.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-500">Line {feedback.lineNumber}</span>
                      </div>
                      {feedback.severity && (
                        <span className={`text-xs font-medium ${
                          feedback.severity === 'high' ? 'text-red-600' :
                          feedback.severity === 'medium' ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {feedback.severity.toUpperCase()} PRIORITY
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 mb-2">{feedback.comment}</p>
                    {feedback.codeSnippet && (
                      <pre className="bg-gray-800 text-gray-200 p-3 rounded text-sm overflow-x-auto">
                        {feedback.codeSnippet}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Add Comment */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Comment</h2>
              <div className="space-y-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Type your comment here..."
                  className="w-full h-32 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleAddComment}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Add Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}