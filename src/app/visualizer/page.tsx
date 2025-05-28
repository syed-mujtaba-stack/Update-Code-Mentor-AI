'use client'

import { useState } from 'react'
import Editor from '@monaco-editor/react'

interface VisualizationStep {
  code: string
  variables: Record<string, any>
  output: string
  lineHighlight: number
  explanation: string
}

export default function CodeVisualizer() {
  const [code] = useState(`function bubbleSort(arr) {
  let len = arr.length;
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}

let numbers = [64, 34, 25, 12, 22, 11, 90];`)

  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1000)

  const [visualizationSteps] = useState<VisualizationStep[]>([
    {
      code,
      variables: { i: 0, j: 0, len: 7, arr: [64, 34, 25, 12, 22, 11, 90] },
      output: 'Starting bubble sort...',
      lineHighlight: 3,
      explanation: 'Initialize outer loop with i = 0'
    },
    {
      code,
      variables: { i: 0, j: 0, len: 7, arr: [34, 64, 25, 12, 22, 11, 90] },
      output: 'Comparing 64 and 34',
      lineHighlight: 5,
      explanation: 'First swap: 64 > 34, so swap them'
    },
    // Add more steps here...
  ])

  const startVisualization = () => setIsPlaying(true)
  const stopVisualization = () => setIsPlaying(false)

  const nextStep = () => {
    if (currentStep < visualizationSteps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleEditorMount = (editor: any, monaco: any) => {
    monaco.editor.defineTheme('customTheme', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.lineHighlightBackground': '#f0f0f0',
      }
    })
    monaco.editor.setTheme('customTheme')
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Code Visualizer</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Code Editor */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Code</h2>
                  <Editor
        height="400px"
        language="javascript"
        value={visualizationSteps[currentStep].code}
        options={{
          readOnly: true,
          minimap: { enabled: false },
          lineNumbers: 'on',
          renderLineHighlight: 'line'
        }}
        theme="customTheme"
        onMount={handleEditorMount}
      />

          </div>

          {/* Visualization Panel */}
          <div className="space-y-8">
            {/* Variables */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Variables</h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(visualizationSteps[currentStep].variables).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 p-3 rounded-lg">
                    <span className="font-mono text-indigo-600">{key}: </span>
                    <span className="font-mono">
                      {Array.isArray(value) ? `[${value.join(', ')}]` : value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Explanation */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Explanation</h2>
              <p className="text-gray-700">{visualizationSteps[currentStep].explanation}</p>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div className="space-x-4">
                  <button
                    onClick={previousStep}
                    disabled={currentStep === 0}
                    className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={isPlaying ? stopVisualization : startVisualization}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    {isPlaying ? 'Stop' : 'Start'}
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={currentStep === visualizationSteps.length - 1}
                    className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-600">Speed:</label>
                  <input
                    type="range"
                    min="100"
                    max="2000"
                    step="100"
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="w-32"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
