'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  progress: number
  maxProgress: number
  unlocked: boolean
}

interface CommunityPost {
  id: string
  author: {
    name: string
    avatar: string
    achievements: string[]
  }
  content: string
  code?: string
  likes: number
  comments: number
  timestamp: Date
  tags: string[]
}

const SAMPLE_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-code',
    title: 'First Line of Code',
    description: 'Write your first line of code',
    icon: '🎯',
    progress: 1,
    maxProgress: 1,
    unlocked: true
  },
  {
    id: 'coding-streak',
    title: 'Coding Streak',
    description: 'Code for 7 consecutive days',
    icon: '🔥',
    progress: 5,
    maxProgress: 7,
    unlocked: false
  },
  {
    id: 'helper',
    title: 'Community Helper',
    description: 'Help 10 other developers with their questions',
    icon: '🤝',
    progress: 3,
    maxProgress: 10,
    unlocked: false
  }
]

const SAMPLE_POSTS: CommunityPost[] = [
  {
    id: '1',
    author: {
      name: 'Alice Johnson',
      avatar: '/default-avatar.png',
      achievements: ['first-code', 'coding-streak']
    },
    content: 'Just completed my first React project! Here\'s what I learned about hooks...',
    code: 'const [count, setCount] = useState(0);',
    likes: 15,
    comments: 5,
    timestamp: new Date('2024-01-15T10:30:00'),
    tags: ['react', 'javascript', 'beginners']
  },
  {
    id: '2',
    author: {
      name: 'Bob Smith',
      avatar: '/default-avatar.png',
      achievements: ['helper']
    },
    content: 'Quick tip: Use optional chaining to handle nested objects safely!',
    code: 'const value = obj?.nested?.property;',
    likes: 32,
    comments: 8,
    timestamp: new Date('2024-01-14T15:45:00'),
    tags: ['javascript', 'tips']
  }
]

export default function Community() {
  const { user } = useUser()
  const [achievements] = useState<Achievement[]>(SAMPLE_ACHIEVEMENTS)
  const [posts] = useState<CommunityPost[]>(SAMPLE_POSTS)
  const [newPost, setNewPost] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const filteredPosts = selectedTag
    ? posts.filter(post => post.tags.includes(selectedTag))
    : posts

  const handleCreatePost = () => {
    if (newPost.trim()) {
      // TODO: Implement post creation
      alert('Post created!')
      setNewPost('')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Achievements Section */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Achievements</h2>
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg ${achievement.unlocked ? 'bg-green-50' : 'bg-gray-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-800">{achievement.title}</h3>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {achievement.progress} / {achievement.maxProgress}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Community Feed */}
          <div className="md:col-span-2">
            {/* Create Post */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share your thoughts, code, or questions..."
                className="w-full h-32 p-3 border rounded-lg resize-none"
              />
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleCreatePost}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Post
                </button>
              </div>
            </div>

            {/* Tags Filter */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {['all', 'javascript', 'react', 'python', 'beginners', 'tips'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag === 'all' ? null : tag)}
                  className={`px-4 py-2 rounded-full ${selectedTag === tag || (tag === 'all' && !selectedTag)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Posts */}
            <div className="space-y-6">
              {filteredPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">{post.author.name}</h3>
                      <p className="text-sm text-gray-500">
                        {post.timestamp.toLocaleDateString()} at {post.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{post.content}</p>

                  {post.code && (
                    <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto mb-4">
                      <code className="text-sm font-mono">{post.code}</code>
                    </pre>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                      <button className="flex items-center gap-2 text-gray-600 hover:text-indigo-600">
                        <span>👍</span> {post.likes}
                      </button>
                      <button className="flex items-center gap-2 text-gray-600 hover:text-indigo-600">
                        <span>💬</span> {post.comments}
                      </button>
                    </div>
                    <div className="flex gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}