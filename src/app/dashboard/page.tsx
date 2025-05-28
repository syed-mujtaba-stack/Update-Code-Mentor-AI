'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useUser, UserButton } from '@clerk/nextjs'
import React from 'react';

// Mock data types for progress
interface McqProgress {
  topic: string
  score: number
  totalQuestions: number
  date: string
}

interface VivaProgress {
  topic: string
  score: number // out of 10
  date: string
}

interface ProjectProgress {
  title: string
  score: number // out of 10
  status: 'Submitted' | 'Reviewed'
  date: string
}

// Simple MCQ progress chart (bar chart using divs)
function MCQProgressChart({ data }: { data: { date: string, score: number, totalQuestions: number }[] }) {
  if (!data.length) return null;
  return (
    <div className="mt-4">
      <h4 className="font-semibold mb-2">MCQ Progress Chart</h4>
      <div className="flex space-x-2 items-end h-24">
        {data.map((mcq, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div
              className="bg-indigo-500 w-6 rounded-t"
              style={{ height: `${(mcq.score / mcq.totalQuestions) * 80 + 10}px` }}
              title={`Score: ${mcq.score}/${mcq.totalQuestions}`}
            />
            <span className="text-xs mt-1">{mcq.date.slice(5)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, isSignedIn, isLoaded } = useUser();
  const [selectedLanguage, setSelectedLanguage] = useState<string>('JavaScript');
  const [mcqProgress, setMcqProgress] = useState<McqProgress[]>([])
  const [vivaProgress, setVivaProgress] = useState<VivaProgress[]>([])
  const [projectProgress, setProjectProgress] = useState<ProjectProgress[]>([])
  const [isLoadingProgress, setIsLoadingProgress] = useState<boolean>(true)
  // Leaderboard and gamification placeholders
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [badges, setBadges] = useState<string[]>([]);
  const [dailyChallenge, setDailyChallenge] = useState<{ title: string; description: string } | null>(null);

  useEffect(() => {
    if (isSignedIn && user?.id) {
      setIsLoadingProgress(true);
      fetch('/api/user-progress')
        .then(async res => {
          try { return await res.json(); } catch { return {}; }
        })
        .then(data => {
          setMcqProgress(data.progress?.filter((p: any) => p.type === 'mcq') || []);
          setVivaProgress(data.progress?.filter((p: any) => p.type === 'viva') || []);
          setProjectProgress(data.progress?.filter((p: any) => p.type === 'project') || []);
          setIsLoadingProgress(false);
        });
      // Fetch leaderboard
      fetch('/api/leaderboard')
        .then(async res => { try { return await res.json(); } catch { return {}; } })
        .then(data => setLeaderboard(data.leaderboard || []));
      // Fetch achievements
      fetch('/api/achievements')
        .then(async res => { try { return await res.json(); } catch { return {}; } })
        .then(data => setBadges(data.achievements || []));
    }
    // Fetch daily challenge (not user-dependent)
    fetch('/api/daily-challenge')
      .then(async res => { try { return await res.json(); } catch { return {}; } })
      .then(data => setDailyChallenge(data.challenge));
    if (isLoaded && !isSignedIn) {
      setIsLoadingProgress(false);
    }
  }, [user, isSignedIn, isLoaded])

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100"><p>Loading user information...</p></div>;
  }
  
  // Clerk's middleware should handle redirection for unauthenticated users.
  // If somehow an unauthenticated user reaches here, they might see a flicker or an empty dashboard.
  // For a better UX, you could add a specific message or redirect again, but middleware is primary.
  if (isLoaded && !isSignedIn) {
     return <div className="min-h-screen flex items-center justify-center bg-gray-100"><p>Please sign in to view your dashboard.</p></div>;
  }


  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow" role="banner">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900" tabIndex={0} aria-label="Welcome message">
            Welcome, {user?.firstName || user?.username || user?.primaryEmailAddress?.emailAddress}!
          </h1>
          <UserButton afterSignOutUrl="/" aria-label="User menu" />
        </div>
      </header>
      <main role="main">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-2 py-6 sm:px-0">
            {/* Quick Links Section */}
            <nav aria-label="Quick links" className="mb-8 flex flex-wrap gap-4">
              <Link href="/code-playground" className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-5 py-2 rounded-lg font-bold shadow hover:scale-105 transition focus:outline focus:ring-2 focus:ring-indigo-500" tabIndex={0}>Code Playground</Link>
              <Link href="/messages" className="bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white px-5 py-2 rounded-lg font-bold shadow hover:scale-105 transition focus:outline focus:ring-2 focus:ring-fuchsia-500" tabIndex={0}>Messages</Link>
              <Link href="/custom-quizzes" className="bg-gradient-to-r from-yellow-400 to-pink-400 text-white px-5 py-2 rounded-lg font-bold shadow hover:scale-105 transition focus:outline focus:ring-2 focus:ring-yellow-400" tabIndex={0}>Custom Quiz Builder</Link>
              <Link href="/admin" className="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-5 py-2 rounded-lg font-bold shadow hover:scale-105 transition focus:outline focus:ring-2 focus:ring-gray-700" tabIndex={0}>Admin Panel</Link>
              <span className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg font-bold shadow" tabIndex={0}>Accessibility & Mobile (improved)</span>
            </nav>
            {/* Daily Challenge Section */}
            {dailyChallenge && (
              <section aria-labelledby="daily-challenge-title" className="mb-8 p-6 bg-gradient-to-r from-yellow-100 via-pink-100 to-indigo-100 shadow-lg rounded-2xl border border-yellow-200">
                <h2 id="daily-challenge-title" className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span role="img" aria-label="lightbulb">💡</span> Daily Challenge
                </h2>
                <h3 className="text-lg font-semibold text-indigo-700 mb-1">{dailyChallenge.title}</h3>
                <p className="mb-4 text-gray-800">{dailyChallenge.description}</p>
                <div className="flex flex-wrap gap-3 mb-4">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded shadow text-sm font-semibold focus:outline focus:ring-2 focus:ring-blue-500"
                    aria-label="Share on X"
                    onClick={() => {
                      const text = encodeURIComponent(`Try today's Code Mentor AI Daily Challenge: ${dailyChallenge.title} - ${dailyChallenge.description}`);
                      const url = encodeURIComponent(window.location.href);
                      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
                    }}
                  >Share on X</button>
                  <button
                    className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-1 rounded shadow text-sm font-semibold focus:outline focus:ring-2 focus:ring-blue-700"
                    aria-label="Share on LinkedIn"
                    onClick={() => {
                      const text = encodeURIComponent(`Try today's Code Mentor AI Daily Challenge: ${dailyChallenge.title}`);
                      const url = encodeURIComponent(window.location.href);
                      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`,'_blank');
                    }}
                  >Share on LinkedIn</button>
                </div>
                <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-indigo-700 transition focus:outline focus:ring-2 focus:ring-indigo-500" onClick={() => alert('Challenge attempt coming soon!')} aria-label="Attempt Challenge">Attempt Challenge</button>
              </section>
            )}
            <div className="mb-8 p-6 bg-white shadow sm:rounded-lg">
              <label htmlFor="language-select" className="block text-lg font-medium text-gray-900 mb-2">
                Select Language/Framework:
              </label>
              <select
                id="language-select"
                name="language-select"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
                aria-label="Select Language or Framework"
              >
                <option value="JavaScript">JavaScript</option>
                <option value="Python">Python</option>
                <option value="React">React</option>
                <option value="Next.js">Next.js</option>
                <option value="Node.js">Node.js</option>
                <option value="TypeScript">TypeScript</option>
                {/* Add more languages/frameworks as needed */}
              </select>
              <p className="mt-2 text-sm text-gray-700">
                Selected: <span className="font-semibold">{selectedLanguage}</span>. Modes below will be tailored to this selection (future implementation).
              </p>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Choose Your Learning Mode (for {selectedLanguage})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Viva Mode Card */}
              <Link href="/viva" className="group">
                <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <h2 className="text-2xl font-bold text-indigo-600 mb-4">Viva Mode</h2>
                  <p className="text-gray-600 mb-4">
                    Practice technical interviews with our AI interviewer. Get real-time feedback and improve your interview skills.
                  </p>
                  <span className="text-indigo-500 group-hover:text-indigo-600 transition-colors">
                    Start Interview →
                  </span>
                </div>
              </Link>
              {/* Assessment Mode Card */}
              <div className="bg-white overflow-hidden shadow sm:rounded-lg hover:shadow-lg transition-shadow focus-within:ring-2 focus-within:ring-indigo-500" tabIndex={0} aria-label="Assessment Mode">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Assessment Mode</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-700">Take comprehensive skill assessments with coding challenges and quizzes.</p>
                  <div className="mt-5">
                    <Link href="/assessment" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" aria-label="Start Assessment">Start Assessment</Link>
                  </div>
                </div>
              </div>
              {/* Code Review Mode Card */}
              <div className="bg-white overflow-hidden shadow sm:rounded-lg hover:shadow-lg transition-shadow focus-within:ring-2 focus-within:ring-indigo-500" tabIndex={0} aria-label="Code Review Mode">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Code Review Mode</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-700">Get detailed feedback and suggestions on your code from AI reviewers.</p>
                  <div className="mt-5">
                    <Link href="/code-review" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" aria-label="Start Code Review">Start Code Review</Link>
                  </div>
                </div>
              </div>
              {/* Playground Mode Card */}
              <div className="bg-white overflow-hidden shadow sm:rounded-lg hover:shadow-lg transition-shadow focus-within:ring-2 focus-within:ring-indigo-500" tabIndex={0} aria-label="Playground Mode">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Playground Mode</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-700">Experiment with code in an interactive environment with real-time AI suggestions.</p>
                  <div className="mt-5">
                    <Link href="/playground" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" aria-label="Open Playground">Open Playground</Link>
                  </div>
                </div>
              </div>
              {/* MCQs Mode Card */}
              <div className="bg-white overflow-hidden shadow sm:rounded-lg hover:shadow-lg transition-shadow focus-within:ring-2 focus-within:ring-indigo-500" tabIndex={0} aria-label="MCQs Mode">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">MCQs Mode</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-700">Test your knowledge with AI-generated multiple choice questions.</p>
                  <div className="mt-5">
                    <Link href="/mcqs" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" aria-label="Start Quiz">Start Quiz</Link>
                  </div>
                </div>
              </div>
              {/* Project Mode Card */}
              <div className="bg-white overflow-hidden shadow sm:rounded-lg hover:shadow-lg transition-shadow focus-within:ring-2 focus-within:ring-indigo-500" tabIndex={0} aria-label="Project Mode">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Project Mode</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-700">Complete coding mini-projects and get AI feedback on your code.</p>
                  <div className="mt-5">
                    <Link href="/project" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" aria-label="Start Project">Start Project</Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Tracker Section */}
            <div className="mt-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Progress</h2>
              {isLoadingProgress ? (
                <p>Loading progress...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* MCQs Progress */}
                  <div className="bg-white shadow sm:rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">MCQ History</h3>
                    {mcqProgress.length > 0 ? (
                      <>
                        <ul className="space-y-2 text-sm text-gray-600">
                          {mcqProgress.map((mcq, index) => (
                            <li key={index} className="p-2 border-b border-gray-200">
                              <strong>{mcq.topic}:</strong> {mcq.score}/{mcq.totalQuestions} - <em>{mcq.date}</em>
                            </li>
                          ))}
                        </ul>
                        <MCQProgressChart data={mcqProgress} />
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">No MCQ history yet.</p>
                    )}
                  </div>

                  {/* Viva Progress */}
                  <div className="bg-white shadow sm:rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Viva History</h3>
                    {vivaProgress.length > 0 ? (
                      <ul className="space-y-2 text-sm text-gray-600">
                        {vivaProgress.map((viva, index) => (
                          <li key={index} className="p-2 border-b border-gray-200">
                            <strong>{viva.topic}:</strong> Score {viva.score}/10 - <em>{viva.date}</em>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">No viva history yet.</p>
                    )}
                  </div>

                  {/* Project Progress */}
                  <div className="bg-white shadow sm:rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Project Submissions</h3>
                    {projectProgress.length > 0 ? (
                      <ul className="space-y-2 text-sm text-gray-600">
                        {projectProgress.map((proj, index) => (
                          <li key={index} className="p-2 border-b border-gray-200">
                            <strong>{proj.title}:</strong> Score {proj.score}/10 ({proj.status}) - <em>{proj.date}</em>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">No project submissions yet.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Leaderboard Section */}
            <div className="mt-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Leaderboard</h2>
              <div className="bg-white shadow sm:rounded-lg p-6">
                {leaderboard.length === 0 ? (
                  <p className="text-gray-500">No leaderboard data yet.</p>
                ) : (
                  <ol className="list-decimal list-inside space-y-2">
                    {leaderboard.map((entry, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <span className={`font-bold text-lg ${idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-gray-500' : idx === 2 ? 'text-orange-700' : 'text-indigo-700'}`}>{entry.user}</span>
                        <span className="ml-auto text-indigo-600 font-semibold">{entry.score} pts</span>
                        {idx === 0 && <span title="Top 1" className="ml-2">🥇</span>}
                        {idx === 1 && <span title="Top 2" className="ml-2">🥈</span>}
                        {idx === 2 && <span title="Top 3" className="ml-2">🥉</span>}
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </div>
            {/* Achievements Section */}
            <div className="mt-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Achievements</h2>
              <div className="bg-white shadow sm:rounded-lg p-6 flex flex-wrap gap-4">
                {badges.length === 0 ? (
                  <span className="text-gray-500">Earn badges by completing quizzes, vivas, and projects!</span>
                ) : (
                  badges.map((badge, idx) => (
                    <span key={idx} className="inline-block bg-gradient-to-r from-indigo-100 via-fuchsia-100 to-pink-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold border border-indigo-200 shadow">🏅 {badge}</span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}