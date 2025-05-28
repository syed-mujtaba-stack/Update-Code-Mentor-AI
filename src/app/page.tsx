'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useUser, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'

export default function Home() {
  const { isSignedIn, user, isLoaded } = useUser()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <header className="absolute top-8 right-8">
        {isLoaded && (
          <UserButton afterSignOutUrl="/" />
        )}
      </header>
      <main className="flex flex-col gap-8 items-center bg-white p-10 rounded-lg shadow-xl max-w-md w-full">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-indigo-600 mb-2">CodeMentor AI</h1>
          <p className="text-gray-600 text-lg">
            Your AI-Based Interactive Tutor for Programming.
          </p>
        </div>

        {!isLoaded && (
          <p className="text-gray-500">Loading user session...</p>
        )}

        {isLoaded && isSignedIn && user && (
          <div className="text-center flex flex-col items-center gap-4">
            <p className="text-xl text-gray-700">
              Welcome back, <span className="font-semibold">{user.firstName || user.username || user.primaryEmailAddress?.emailAddress}!</span>
            </p>
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors text-lg"
            >
              Go to Dashboard
            </Link>
            {/* UserButton handles sign out */}
          </div>
        )}

        {isLoaded && !isSignedIn && (
          <div className="text-center flex flex-col items-center gap-4">
            <p className="text-lg text-gray-700">
              Please sign in or sign up to access your learning dashboard.
            </p>
            <div className="flex gap-4">
              <SignInButton mode="modal">
                <button
                  className="px-6 py-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition-colors text-lg"
                >
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button
                  className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors text-lg"
                >
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-12 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} CodeMentor AI. All rights reserved.</p>
        <div className="mt-2">
          <a
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-2 hover:text-indigo-600"
          >
            Powered by Next.js
          </a>
          <p className="mx-2 hover:text-indigo-600">Developed By Syed Mujtaba Abbas</p>
          <Image
            src="/next.svg"
            alt="Next.js Logo"
            width={70}
            height={16}
            className="inline-block dark:invert ml-1"
          />
        </div>
      </footer>
    </div>
  )
}
