'use client'

import { useState } from 'react'

interface LearningPath {
  id: string
  title: string
  description: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: string
  topics: string[]
  prerequisites: string[]
  modules: LearningModule[]
  enrolledCount: number
  rating: number
  reviews: number
}

interface LearningModule {
  id: string
  title: string
  description: string
  type: 'video' | 'reading' | 'quiz' | 'project' | 'exercise'
  duration: string
  completed?: boolean
}

const SAMPLE_PATHS: LearningPath[] = [
  {
    id: 'fullstack-web',
    title: 'Full-Stack Web Development',
    description: 'Master modern web development from front-end to back-end, including React, Node.js, and databases.',
    level: 'Intermediate',
    duration: '12 weeks',
    topics: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'REST APIs', 'GraphQL'],
    prerequisites: ['Basic JavaScript', 'HTML & CSS', 'Git basics'],
    enrolledCount: 1250,
    rating: 4.8,
    reviews: 342,
    modules: [
      {
        id: 'm1',
        title: 'Modern JavaScript Fundamentals',
        description: 'Deep dive into ES6+ features and modern JavaScript concepts.',
        type: 'video',
        duration: '2 hours'
      },
      {
        id: 'm2',
        title: 'React Fundamentals',
        description: 'Learn React hooks, components, and state management.',
        type: 'exercise',
        duration: '3 hours'
      },
      {
        id: 'm3',
        title: 'Building REST APIs with Node.js',
        description: 'Create scalable backend services using Express and MongoDB.',
        type: 'project',
        duration: '4 hours'
      }
    ]
  },
  {
    id: 'data-structures',
    title: 'Data Structures & Algorithms',
    description: 'Master fundamental data structures and algorithms with practical implementations.',
    level: 'Advanced',
    duration: '8 weeks',
    topics: ['Arrays', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming', 'Sorting'],
    prerequisites: ['Object-Oriented Programming', 'Basic Algorithm Analysis'],
    enrolledCount: 850,
    rating: 4.9,
    reviews: 215,
    modules: [
      {
        id: 'm1',
        title: 'Array and String Algorithms',
        description: 'Master common array manipulation and string processing techniques.',
        type: 'reading',
        duration: '1.5 hours'
      },
      {
        id: 'm2',
        title: 'Tree Traversal Techniques',
        description: 'Learn different ways to traverse and manipulate tree structures.',
        type: 'quiz',
        duration: '1 hour'
      },
      {
        id: 'm3',
        title: 'Graph Algorithms Implementation',
        description: 'Implement popular graph algorithms like DFS, BFS, and Dijkstra.',
        type: 'project',
        duration: '3 hours'
      }
    ]
  },
  {
    id: 'python-ml',
    title: 'Python for Machine Learning',
    description: 'Learn Python programming with a focus on machine learning applications.',
    level: 'Beginner',
    duration: '10 weeks',
    topics: ['Python Basics', 'NumPy', 'Pandas', 'Scikit-learn', 'Data Visualization'],
    prerequisites: ['Basic Programming Concepts'],
    enrolledCount: 2100,
    rating: 4.7,
    reviews: 528,
    modules: [
      {
        id: 'm1',
        title: 'Python Programming Basics',
        description: 'Get started with Python syntax, data types, and control structures.',
        type: 'video',
        duration: '2.5 hours'
      },
      {
        id: 'm2',
        title: 'Data Analysis with Pandas',
        description: 'Learn to manipulate and analyze data using Pandas.',
        type: 'exercise',
        duration: '2 hours'
      },
      {
        id: 'm3',
        title: 'Basic Machine Learning Models',
        description: 'Implement your first machine learning models using Scikit-learn.',
        type: 'project',
        duration: '3 hours'
      }
    ]
  }
]

export default function LearningPathsPage() {
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null)
  const [showModal, setShowModal] = useState(false)

  const handlePathSelect = (path: LearningPath) => {
    setSelectedPath(path)
    setShowModal(true)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Learning Paths</h1>
          <p className="mt-2 text-gray-600">Choose a structured learning path to master new skills</p>
        </div>

        {/* Path Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SAMPLE_PATHS.map((path) => (
            <div
              key={path.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => handlePathSelect(path)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-900">{path.title}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    path.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                    path.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {path.level}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{path.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {path.topics.map((topic) => (
                    <span
                      key={topic}
                      className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>⏱ {path.duration}</span>
                  <span>👥 {path.enrolledCount.toLocaleString()} enrolled</span>
                  <span>⭐ {path.rating} ({path.reviews} reviews)</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Path Details Modal */}
        {showModal && selectedPath && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedPath.title}</h2>
                    <p className="text-gray-600 mt-1">{selectedPath.description}</p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Prerequisites */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Prerequisites</h3>
                  <ul className="list-disc list-inside text-gray-600">
                    {selectedPath.prerequisites.map((prereq) => (
                      <li key={prereq}>{prereq}</li>
                    ))}
                  </ul>
                </div>

                {/* Modules */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Modules</h3>
                  <div className="space-y-4">
                    {selectedPath.modules.map((module) => (
                      <div key={module.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-800">{module.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            module.type === 'video' ? 'bg-blue-100 text-blue-800' :
                            module.type === 'reading' ? 'bg-purple-100 text-purple-800' :
                            module.type === 'quiz' ? 'bg-yellow-100 text-yellow-800' :
                            module.type === 'project' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {module.type.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{module.description}</p>
                        <div className="text-sm text-gray-500">Duration: {module.duration}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enroll Button */}
                <button
                  onClick={() => {
                    // TODO: Implement enrollment logic
                    alert('Enrollment functionality coming soon!')
                  }}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  Enroll Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}