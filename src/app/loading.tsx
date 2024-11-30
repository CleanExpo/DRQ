import React from 'react'

export default function RootLoadingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-pulse space-y-4">
        <div className="h-12 w-32 bg-blue-900/20 rounded-lg mx-auto" />
        <div className="h-4 w-48 bg-gray-200 rounded mx-auto" />
      </div>
    </div>
  )
}
