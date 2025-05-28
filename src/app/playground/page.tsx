'use client'

import { useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'

interface CodeSuggestion {
  id: string
  lineNumber: number
  suggestion: string
  explanation: string
  type: 'improvement' | 'bug-fix' | 'performance' | 'security'
}

interface CodeError {
  lineNumber: number
  message: string
  severity: 'error' | 'warning' | 'info'
  code: string
}

const SAMPLE_CODE = `// Welcome to the AI-powered Code Playground!
// Try writing some code below and see real-time suggestions

function calculateFactorial(n: number): number {
  if (n < 0) return 0;
  if (n <= 1) return 1;
  return n * calculateFactorial(n - 1);
}

function findMaxNumber(numbers: number[]): number {
  let max = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] > max) {
      max = numbers[i];
    }
  }
  return max;
}

// Example usage:
const numbers = [1, 5, 3, 9, 2, 8, 4];
const maxNumber = findMaxNumber(numbers);
console.log('Max number:', maxNumber);

const factorial5 = calculateFactorial(5);
console.log('Factorial of 5:', factorial5);`

const SAMPLE_SUGGESTIONS: CodeSuggestion[] = [
  {
    id: 'sug1',
    lineNumber: 4,
    suggestion: 'Consider adding input validation for large numbers to prevent stack overflow',
    explanation: 'Recursive functions can cause stack overflow for large inputs. Add a maximum limit or consider using iteration instead.',
    type: 'security'
  },
  {
    id: 'sug2',
    lineNumber: 10,
    suggestion: 'Handle empty array case',
    explanation: 'The function might throw an error if the input array is empty. Add a check at the beginning of the function.',
    type: 'bug-fix'
  },
  {
    id: 'sug3',
    lineNumber: 11,
    suggestion: 'Consider using Math.max() with spread operator',
    explanation: 'For better performance and cleaner code, you can use: return Math.max(...numbers)',
    type: 'performance'
  }
]

const LANGUAGES = [
  { id: 'typescript', name: 'TypeScript' },
  { id: 'javascript', name: 'JavaScript' },
  { id: 'python', name: 'Python' },
  { id: 'java', name: 'Java' },
  { id: 'csharp', name: 'C#' },
]

const THEMES = [
  { id: 'vs-dark', name: 'Dark' },
  { id: 'light', name: 'Light' },
]

export default function PlaygroundPage() {
  const [code, setCode] = useState(SAMPLE_CODE)
  const [language, setLanguage] = useState('typescript')
  const [theme, setTheme] = useState('vs-dark')
  const [suggestions, setSuggestions] = useState<CodeSuggestion[]>(SAMPLE_SUGGESTIONS)
  const [errors, setErrors] = useState<CodeError[]>([])
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)

  const handleRunCode = () => {
    setIsRunning(true)
    setOutput('Running code...')

    // TODO: Implement actual code execution
    setTimeout(() => {
      setOutput('Max number: 9\nFactorial of 5: 120')
      setIsRunning(false)
    }, 1000)
  }

  const handleCodeChange = (value: string | undefined) => {
    if (!value) return
    setCode(value)
    // TODO: Implement real-time code analysis and error detection
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.id} value={lang.id}>{lang.name}</option>
              ))}
            </select>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {THEMES.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Running...
              </>
            ) : (
              <>▶ Run Code</>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Editor */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="h-[600px]">
              <Editor
                height="100%"
                language={language}
                value={code}
                theme={theme}
                onChange={handleCodeChange}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  renderLineHighlight: 'all',
                  automaticLayout: true,
                }}
              />
            </div>
          </div>

          {/* Suggestions and Output */}
          <div className="space-y-6">
            {/* AI Suggestions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">AI Suggestions</h2>
              <div className="space-y-4">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        suggestion.type === 'bug-fix' ? 'bg-red-100 text-red-800' :
                        suggestion.type === 'performance' ? 'bg-yellow-100 text-yellow-800' :
                        suggestion.type === 'security' ? 'bg-orange-100 text-orange-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {suggestion.type.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-500">Line {suggestion.lineNumber}</span>
                    </div>
                    <p className="text-gray-800 font-medium mb-1">{suggestion.suggestion}</p>
                    <p className="text-sm text-gray-600">{suggestion.explanation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Output Console */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Output</h2>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap">
                {output || 'Click "Run Code" to see the output'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}