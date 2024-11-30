'use client'

import React from 'react'
import Link from 'next/link'

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorBoundary({ error, reset }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Something went wrong!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            We apologize for the inconvenience. Please try again or contact our support team if the problem persists.
          </p>
          <div className="space-y-4">
            <button
              onClick={reset}
              className="bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors w-full"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="inline-block bg-gray-100 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors w-full"
            >
              Return Home
            </Link>
          </div>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-red-50 rounded-lg">
            <p className="text-red-900 font-mono text-sm break-words">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-red-700 font-mono text-xs mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
