'use client'

import { useState } from 'react'
import Editor from '@monaco-editor/react'

interface BlogTemplate {
  id: string
  title: string
  description: string
  structure: string
  targetAudience: string
  tone: 'professional' | 'casual' | 'technical' | 'conversational'
}

interface GeneratedContent {
  title: string
  content: string
  keywords: string[]
  metaDescription: string
  estimatedReadTime: number
}

const BLOG_TEMPLATES: BlogTemplate[] = [
  {
    id: 'tech-tutorial',
    title: 'Technical Tutorial',
    description: 'Step-by-step guide for technical concepts or implementations',
    structure: '1. Introduction\n2. Prerequisites\n3. Step-by-step guide\n4. Common issues\n5. Conclusion',
    targetAudience: 'Developers and technical professionals',
    tone: 'technical'
  },
  {
    id: 'tech-overview',
    title: 'Technology Overview',
    description: 'High-level explanation of technology concepts',
    structure: '1. What is it?\n2. Key features\n3. Use cases\n4. Pros and cons\n5. Getting started',
    targetAudience: 'Tech-savvy readers and decision makers',
    tone: 'professional'
  }
]

export default function BlogCreatorPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<BlogTemplate | null>(null)
  const [topic, setTopic] = useState('')
  const [keywords, setKeywords] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)

  const handleTemplateSelect = (template: BlogTemplate) => {
    setSelectedTemplate(template)
    setGeneratedContent(null)
  }

  const handleGenerate = async () => {
    if (!selectedTemplate || !topic) return

    setIsGenerating(true)
    // TODO: Implement actual AI content generation
    // Simulated API call
    setTimeout(() => {
      setGeneratedContent({
        title: `Understanding ${topic}: A Comprehensive Guide`,
        content: `# Understanding ${topic}: A Comprehensive Guide\n\n## Introduction\nIn this guide, we'll explore ${topic} in detail...\n\n## Key Concepts\n1. First concept\n2. Second concept\n\n## Practical Implementation\n...\n\n## Best Practices\n...\n\n## Conclusion\n...`,
        keywords: keywords.split(',').map(k => k.trim()),
        metaDescription: `Learn everything you need to know about ${topic} in this comprehensive guide...`,
        estimatedReadTime: 5
      })
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Blog Creator</h1>
          <p className="text-gray-600">
            Select a template and let AI help you create engaging blog content
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Templates */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Choose Template</h2>
            {BLOG_TEMPLATES.map(template => (
              <div
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer transition-all ${
                  selectedTemplate?.id === template.id
                    ? 'ring-2 ring-indigo-500'
                    : 'hover:shadow-xl'
                }`}
              >
                <h3 className="text-lg font-semibold mb-2">{template.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{template.description}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{template.tone}</span>
                  <span>{template.targetAudience}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Content Generation */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Generate Content</h2>
              
              {/* Input Fields */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Topic
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., React Hooks, Machine Learning, Cloud Computing"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Keywords (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="e.g., technology, programming, web development"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={!selectedTemplate || !topic || isGenerating}
                  className={`w-full py-2 px-4 rounded-lg text-white transition-colors ${
                    !selectedTemplate || !topic || isGenerating
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {isGenerating ? 'Generating...' : 'Generate Content'}
                </button>
              </div>

              {/* Generated Content */}
              {generatedContent && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Generated Content</h3>
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Title</span>
                      <span className="text-sm text-gray-500">
                        {generatedContent.estimatedReadTime} min read
                      </span>
                    </div>
                    <p className="text-lg mb-4">{generatedContent.title}</p>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Meta Description:</span>{' '}
                        {generatedContent.metaDescription}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Keywords:</span>{' '}
                        {generatedContent.keywords.join(', ')}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white border rounded-lg overflow-hidden">
                    <Editor
                      height="400px"
                      defaultLanguage="markdown"
                      value={generatedContent.content}
                      theme="vs-light"
                      options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        wordWrap: 'on'
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}