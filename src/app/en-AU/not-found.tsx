import React from 'react'
import Link from 'next/link'

export const metadata = {
  title: 'Page Not Found | DRQ',
  description: 'Sorry, we couldn\'t find the page you\'re looking for.',
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for. Please check the URL or return to our homepage.
          </p>
          <div className="space-y-4">
            <Link
              href="/en-AU"
              className="inline-block bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors w-full"
            >
              Return Home
            </Link>
            <Link
              href="/en-AU/contact"
              className="inline-block bg-gray-100 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors w-full"
            >
              Contact Support
            </Link>
          </div>
        </div>
        <div className="text-9xl font-bold text-blue-900/10">
          404
        </div>
      </div>
    </div>
  )
}
