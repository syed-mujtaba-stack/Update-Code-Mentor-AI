'use client'

import { useState } from 'react'

interface DocSection {
  id: string
  title: string
  content: string
  tags: string[]
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  lastUpdated: string
  category: string
  codeSnippets?: string[]
}

const SAMPLE_DOCS: DocSection[] = [
  {
    id: 'ai-blog-creator',
    title: 'AI-Powered Blog Creation',
    content: `# AI Blog Creator Guide

Learn how to use our AI-powered blog creation tools to generate engaging content efficiently.

## Key Features
- AI-assisted topic generation
- Content structure recommendations
- SEO optimization suggestions
- Writing style adaptation
- Automatic proofreading

## Using the Blog Creator

### 1. Topic Generation
Start by entering your main subject area, and the AI will suggest relevant topics based on:
- Current trends
- Your target audience
- Content gaps in your niche

### 2. Content Structure
The AI helps organize your blog post with:
- Engaging introductions
- Logical section flow
- Compelling conclusions
- Call-to-action suggestions

### 3. SEO Optimization
Get real-time suggestions for:
- Keywords and phrases
- Meta descriptions
- Header optimization
- Internal linking`,
    tags: ['AI', 'blogging', 'content-creation', 'SEO'],
    difficulty: 'Intermediate',
    lastUpdated: '2024-01-20',
    category: 'Content Creation',
    codeSnippets: [
      `// Example: Using the Blog Creator API
async function generateBlogContent(topic) {
  const response = await fetch('/api/blog-creator', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      topic,
      targetAudience: 'developers',
      contentType: 'technical-tutorial',
      length: 'medium'
    })
  });
  return await response.json();
}`,
      `// Example: Applying SEO Recommendations
function applySeoSuggestions(content) {
  const seoAnalyzer = new SeoAnalyzer(content);
  const suggestions = seoAnalyzer.analyze();
  
  return {
    optimizedContent: seoAnalyzer.optimize(),
    keywordDensity: suggestions.keywordDensity,
    readabilityScore: suggestions.readabilityScore,
    improvements: suggestions.recommendations
  };
}`
    ]
  },
  {
    id: 'teacher-ai',
    title: 'Teaching with AI Assistant',
    content: `# AI Teaching Assistant Guide

Learn how to leverage AI to enhance your teaching and student engagement.

## Core Capabilities
- Personalized learning paths
- Automated assessment generation
- Real-time student feedback
- Progress tracking and analytics
- Interactive lesson planning

## Implementation Guide

### 1. Setting Up Your AI Teacher
- Configure subject areas and difficulty levels
- Define learning objectives
- Set up student profiles
- Customize feedback parameters

### 2. Creating Interactive Lessons
- Design engaging exercises
- Generate practice problems
- Create adaptive quizzes
- Develop multimedia content

### 3. Monitoring Progress
- Track individual student performance
- Analyze class-wide trends
- Identify learning gaps
- Generate progress reports`,
    tags: ['AI', 'education', 'teaching', 'assessment'],
    difficulty: 'Advanced',
    lastUpdated: '2024-01-18',
    category: 'Education',
    codeSnippets: [
      `// Example: Creating an AI-powered lesson
class AILesson {
  constructor(subject, level) {
    this.subject = subject;
    this.level = level;
    this.exercises = [];
  }

  async generateContent() {
    const content = await AITeacher.generateLesson({
      subject: this.subject,
      level: this.level,
      duration: 45, // minutes
      includeAssessments: true
    });
    
    this.exercises = content.exercises;
    return content;
  }

  async assessStudent(studentId, answers) {
    const assessment = await AITeacher.evaluate({
      studentId,
      exercises: this.exercises,
      answers,
      provideFeedback: true
    });
    
    return assessment;
  }
}`,
      `// Example: Tracking student progress
class ProgressTracker {
  async analyzePerformance(studentId) {
    const data = await Database.getStudentHistory(studentId);
    
    return {
      strengths: this.identifyStrengths(data),
      weaknesses: this.identifyWeaknesses(data),
      recommendations: this.generateRecommendations(data),
      progressTrend: this.calculateTrend(data)
    };
  }

  generateReport(analysis) {
    return AITeacher.createReport(analysis, {
      format: 'detailed',
      includeVisualizations: true,
      recommendNextSteps: true
    });
  }
}`
    ]
  },
  {
    id: 'js-basics',
    title: 'JavaScript Fundamentals',
    content: `# Variables and Data Types
JavaScript has several data types:
- **Primitives**: number, string, boolean, null, undefined, symbol
- **Objects**: object, array, function

## Variable Declaration
\`\`\`javascript
// Using let (block-scoped)
let name = 'John';

// Using const (immutable reference)
const age = 25;
\`\`\`

## Control Flow
\`\`\`javascript
// If statements
if (condition) {
  // code
} else {
  // code
}

// Loops
for (let i = 0; i < 5; i++) {
  console.log(i);
}
\`\`\``,
    tags: ['javascript', 'basics', 'variables'],
    difficulty: 'Beginner',
    lastUpdated: '2024-01-15',
    category: 'JavaScript',
    codeSnippets: [
      `// Variable declarations
let name = 'John';
const age = 25;
var legacy = 'old way';

// Data types
const number = 42;
const string = 'Hello';
const boolean = true;
const array = [1, 2, 3];
const object = { key: 'value' };`,
      `// Control flow examples
// If statement
if (age >= 18) {
  console.log('Adult');
} else {
  console.log('Minor');
}

// Loop examples
for (let i = 0; i < 3; i++) {
  console.log(i);
}

while (condition) {
  // do something
}`
    ]
  },
  {
    id: 'react-hooks',
    title: 'React Hooks',
    content: `# React Hooks

## useState
Manage state in functional components:
\`\`\`javascript
const [count, setCount] = useState(0);
\`\`\`

## useEffect
Handle side effects:
\`\`\`javascript
useEffect(() => {
  // Effect code
  return () => {
    // Cleanup code
  };
}, [dependencies]);
\`\`\`

## Custom Hooks
Create reusable logic:
\`\`\`javascript
function useCustomHook() {
  const [value, setValue] = useState(null);
  // Hook logic
  return value;
}
\`\`\``,
    tags: ['react', 'hooks', 'state-management'],
    difficulty: 'Intermediate',
    lastUpdated: '2024-01-10',
    category: 'React',
    codeSnippets: [
      `// useState examples
function Counter() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type something..."
      />
    </div>
  );
}`,
      `// useEffect examples
function DataFetcher() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('https://api.example.com/data');
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  return <div>{/* render data */}</div>;
}`
    ]
  },
  {
    id: 'design-patterns',
    title: 'Design Patterns in JavaScript',
    content: `# Common Design Patterns

## Singleton Pattern
\`\`\`javascript
class Singleton {
  private static instance: Singleton;
  
  private constructor() {}
  
  public static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }
}

## Observer Pattern
\`\`\`javascript
class Subject {
  private observers: Observer[] = [];
  
  public attach(observer: Observer): void {
    this.observers.push(observer);
  }
  
  public notify(): void {
    this.observers.forEach(observer => observer.update());
  }
}
\`\`\``,
    tags: ['design-patterns', 'architecture', 'advanced'],
    difficulty: 'Advanced',
    lastUpdated: '2024-01-05',
    category: 'JavaScript',
    codeSnippets: [
      `// Singleton Pattern Implementation
class Database {
  private static instance: Database;
  private constructor() {
    // Initialize the database connection
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public query(sql: string) {
    // Execute query
  }
}

// Usage
const db1 = Database.getInstance();
const db2 = Database.getInstance();
console.log(db1 === db2); // true`,
      `// Observer Pattern Implementation
interface Observer {
  update(data: any): void;
}

class NewsAgency {
  private observers: Observer[] = [];
  private news: string = '';

  public attach(observer: Observer): void {
    this.observers.push(observer);
  }

  public detach(observer: Observer): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  public setNews(news: string): void {
    this.news = news;
    this.notify();
  }

  private notify(): void {
    this.observers.forEach(observer => observer.update(this.news));
  }
}

class NewsChannel implements Observer {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  public update(news: string): void {
    console.log(\`\${this.name} received news: \${news}\`);
  }
}`
    ]
  }
]

export default function Documentation() {
  const [selectedDoc, setSelectedDoc] = useState<DocSection | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  const categories = Array.from(new Set(SAMPLE_DOCS.map(doc => doc.category)))

  const filteredDocs = SAMPLE_DOCS.filter(doc => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      doc.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDifficulty = difficultyFilter === 'all' || doc.difficulty === difficultyFilter
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter
    return matchesSearch && matchesDifficulty && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Documentation</h1>
          <p className="mt-2 text-gray-600">Browse through our comprehensive documentation and tutorials</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search in docs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Documentation List */}
          <div className="md:col-span-1 bg-white rounded-xl shadow-lg p-6 h-fit">
            <h2 className="text-xl font-semibold mb-4">Topics</h2>
            <div className="space-y-3">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${
                    selectedDoc?.id === doc.id
                      ? 'bg-indigo-50 border-2 border-indigo-500'
                      : 'hover:bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <h3 className="font-medium text-gray-800">{doc.title}</h3>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    <span>{doc.category}</span>
                    <span>•</span>
                    <span>Updated {doc.lastUpdated}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className={`px-2 py-1 rounded text-sm ${
                      doc.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                      doc.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {doc.difficulty}
                    </span>
                    {doc.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Documentation Content */}
          <div className="md:col-span-2">
            {selectedDoc ? (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedDoc.title}</h2>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                      <span>{selectedDoc.category}</span>
                      <span>•</span>
                      <span>Updated {selectedDoc.lastUpdated}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedDoc.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                    selectedDoc.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedDoc.difficulty}
                  </span>
                </div>

                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: selectedDoc.content }} />
                </div>

                {selectedDoc.codeSnippets && selectedDoc.codeSnippets.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Code Examples</h3>
                    <div className="space-y-4">
                      {selectedDoc.codeSnippets.map((snippet, index) => (
                        <pre key={index} className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                          <code>{snippet}</code>
                        </pre>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {selectedDoc.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <h2 className="text-xl text-gray-600">Select a topic to start learning</h2>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}