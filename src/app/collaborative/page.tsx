'use client'

import { useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import { useUser } from '@clerk/nextjs'

interface CollaboratorCursor {
  id: string
  name: string
  position: {
    lineNumber: number
    column: number
  }
  color: string
}

interface ChatMessage {
  id: string
  sender: string
  message: string
  timestamp: Date
}

export default function CollaborativeCoding() {
  const { user } = useUser()
  const [code, setCode] = useState('// Start coding here...')
  const [language, setLanguage] = useState('javascript')
  const [collaborators, setCollaborators] = useState<CollaboratorCursor[]>([])
  const [chat, setChat] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')

  // Mock collaborators for demo
  useEffect(() => {
    setCollaborators([
      {
        id: '1',
        name: 'Alice',
        position: { lineNumber: 1, column: 1 },
        color: '#FF5733'
      },
      {
        id: '2',
        name: 'Bob',
        position: { lineNumber: 3, column: 5 },
        color: '#33FF57'
      }
    ])
  }, [])

  const handleEditorChange = (value: string | undefined) => {
    if (value) {
      setCode(value)
      // TODO: Implement real-time sync with other users
    }
  }

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        sender: user?.username || 'Anonymous',
        message: newMessage,
        timestamp: new Date()
      }
      setChat([...chat, message])
      setNewMessage('')
      // TODO: Implement real-time chat sync
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Code Editor Section */}
      <div className="flex-1 p-4">
        <div className="bg-white rounded-lg shadow-lg p-4 h-full">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Collaborative Coding</h1>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-1 border rounded-md"
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
            </select>
          </div>
          
          <div className="h-[calc(100vh-12rem)] relative">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={handleEditorChange}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
              }}
            />
            
            {/* Collaborator Cursors */}
            {collaborators.map((collaborator) => (
              <div
                key={collaborator.id}
                className="absolute pointer-events-none"
                style={{
                  top: `${collaborator.position.lineNumber * 20}px`,
                  left: `${collaborator.position.column * 8}px`,
                }}
              >
                <div
                  className="w-2 h-4"
                  style={{ backgroundColor: collaborator.color }}
                />
                <div
                  className="px-2 py-1 text-xs text-white rounded mt-1"
                  style={{ backgroundColor: collaborator.color }}
                >
                  {collaborator.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Section */}
      <div className="w-80 bg-white shadow-lg flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Chat</h2>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto">
          {chat.map((message) => (
            <div key={message.id} className="mb-4">
              <div className="flex items-baseline">
                <span className="font-medium text-indigo-600">{message.sender}</span>
                <span className="ml-2 text-xs text-gray-500">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <p className="mt-1 text-gray-700">{message.message}</p>
            </div>
          ))}
        </div>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border rounded-md"
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}