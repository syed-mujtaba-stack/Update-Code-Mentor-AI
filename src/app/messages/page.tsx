"use client";
import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';

export default function MessagesPage() {
  const { user, isLoaded } = useUser();
  const [withUser, setWithUser] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (user && withUser) {
      fetch(`/api/messages?with=${withUser}`)
        .then(res => res.json())
        .then(data => setMessages(data.messages || []));
    }
  }, [user, withUser]);

  const sendMessage = async () => {
    if (!message.trim() || !withUser) return;
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: withUser, text: message }),
    });
    setMessage('');
    fetch(`/api/messages?with=${withUser}`)
      .then(res => res.json())
      .then(data => setMessages(data.messages || []));
  };

  if (!isLoaded) return <div>Loading...</div>;
  if (!user) return <div>Please sign in.</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-indigo-100 p-8">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">User-to-User Messaging</h1>
        <input
          className="w-full border rounded p-2 mb-4 text-black"
          placeholder="Enter recipient user ID..."
          value={withUser}
          onChange={e => setWithUser(e.target.value)}
        />
        <div className="mb-4 h-48 overflow-y-auto bg-gray-50 rounded p-2 text-black">
          {messages.map((msg, idx) => (
            <div key={idx} className={`mb-2 ${msg.from === user.id ? 'text-right' : 'text-left'}`}> 
              <span className="inline-block px-3 py-1 rounded-lg bg-indigo-100 text-black max-w-xs break-words">
                <b>{msg.from === user.id ? 'You' : msg.from}:</b> {msg.text}
              </span>
              <span className="block text-xs text-gray-400">{new Date(msg.date).toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className="flex-1 border rounded p-2 text-black"
            placeholder="Type a message..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
          />
          <button className="bg-indigo-600 text-white px-4 py-2 rounded font-bold shadow hover:bg-indigo-700" onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}
