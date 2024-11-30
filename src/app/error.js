'use client'

import React from 'react'
import { CONTACT } from '../constants/contact'

export default function ErrorPage({ error, reset }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Something went wrong!</h1>
      <p className="text-lg text-gray-600 mb-6">
        We apologize for the inconvenience. Please try again later or contact our support team.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Try again
        </button>
        <a
          href={`tel:${CONTACT.phone}`}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Contact Support
        </a>
      </div>
      <div className="mt-8 text-sm text-gray-500">
        Error Reference: {error.digest}
      </div>
    </div>
  )
}
