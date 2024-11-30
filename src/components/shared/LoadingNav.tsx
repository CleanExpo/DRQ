import React from 'react'

export const LoadingNav = () => {
  return (
    <nav className="bg-white shadow-lg animate-pulse">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex items-center">
              <div className="h-8 w-20 bg-gray-200 rounded" />
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="h-8 w-24 bg-gray-200 rounded" />
            <div className="h-8 w-20 bg-gray-200 rounded" />
            <div className="h-8 w-32 bg-gray-200 rounded" />
            <div className="h-10 w-40 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>
    </nav>
  )
}
