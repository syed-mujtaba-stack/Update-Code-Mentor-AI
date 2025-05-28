'use client'

import { useState } from 'react'
import Editor from '@monaco-editor/react'
import { useUser } from '@clerk/nextjs'

interface BlogPost {
  id: string
  title: string
  content: string
  author: {
    name: string
    avatar: string
  }
  tags: string[]
  createdAt: string
  updatedAt: string
  status: 'draft' | 'published'
  aiSuggestions?: {
    seoScore: number
    readabilityScore: number
    suggestions: string[]
  }
}

const SAMPLE_BLOG_POST: BlogPost = {
  id: 'post-1',
  title: 'Getting Started with React Hooks',
  content: '# Getting Started with React Hooks\n\nReact Hooks are a powerful feature...',
  author: {
    name: 'John Doe',
    avatar: '/avatars/default.png'
  },
  tags: ['react', 'javascript', 'hooks'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  status: 'draft',
  aiSuggestions: {
    seoScore: 85,
    readabilityScore: 92,
    suggestions: [
      'Consider adding more code examples',
      'Include a section about useEffect dependencies',
      'Add meta description for better SEO'
    ]
  }
}

export default function BlogPage() {
  const { user } = useUser()
  const [blogPost, setBlogPost] = useState<BlogPost>(SAMPLE_BLOG_POST)
  const [isEditing, setIsEditing] = useState(false)
  const [showAiSuggestions, setShowAiSuggestions] = useState(false)

  const handleContentChange = (value: string | undefined) => {
    if (!value) return
    setBlogPost(prev => ({
      ...prev,
      content: value,
      updatedAt: new Date().toISOString()
    }))
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBlogPost(prev => ({
      ...prev,
      title: e.target.value,
      updatedAt: new Date().toISOString()
    }))
  }

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBlogPost(prev => ({
      ...prev,
      tags: e.target.value.split(',').map(tag => tag.trim()),
      updatedAt: new Date().toISOString()
    }))
  }

  const handlePublish = () => {
    setBlogPost(prev => ({
      ...prev,
      status: 'published',
      updatedAt: new Date().toISOString()
    }))
    // TODO: Implement actual publishing logic
    alert('Blog post published!')
  }

  const handleRequestAiSuggestions = () => {
    // TODO: Implement AI analysis API call
    setShowAiSuggestions(true)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Blog Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              value={blogPost.title}
              onChange={handleTitleChange}
              className="text-2xl font-bold w-full bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded p-2"
              placeholder="Enter blog title..."
            />
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              {isEditing ? 'Preview' : 'Edit'}
            </button>
          </div>
          <div className="flex gap-4 items-center">
            <input
              type="text"
              value={blogPost.tags.join(', ')}
              onChange={handleTagsChange}
              className="flex-1 bg-gray-50 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter tags separated by commas..."
            />
            <span className="text-gray-500">{blogPost.status}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Editor/Preview */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {isEditing ? (
                <Editor
                  height="600px"
                  defaultLanguage="markdown"
                  value={blogPost.content}
                  onChange={handleContentChange}
                  theme="vs-light"
                  options={{
                    minimap: { enabled: false },
                    wordWrap: 'on',
                    lineNumbers: 'off'
                  }}
                />
              ) : (
                <div className="p-6 prose max-w-none h-[600px] overflow-y-auto">
                  {/* TODO: Add markdown rendering */}
                  <pre className="whitespace-pre-wrap">{blogPost.content}</pre>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Assistant */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">AI Assistant</h3>
              <button
                onClick={handleRequestAiSuggestions}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors mb-4"
              >
                Analyze Content
              </button>
              {showAiSuggestions && blogPost.aiSuggestions && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>SEO Score</span>
                    <span className="font-semibold">{blogPost.aiSuggestions.seoScore}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Readability</span>
                    <span className="font-semibold">{blogPost.aiSuggestions.readabilityScore}%</span>
                  </div>
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Suggestions</h4>
                    <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                      {blogPost.aiSuggestions.suggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Publishing */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Publishing</h3>
              <button
                onClick={handlePublish}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Publish Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}