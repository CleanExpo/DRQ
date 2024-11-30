import React from 'react'

export const LoadingHome = () => {
  return (
    <div className="flex flex-col gap-12 py-8 animate-pulse">
      {/* Hero Section Skeleton */}
      <div className="bg-blue-900/50 px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="h-12 bg-gray-200 rounded-lg w-3/4 mx-auto" />
          <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto" />
          <div className="flex justify-center gap-4 mt-8">
            <div className="h-12 w-40 bg-gray-200 rounded-lg" />
            <div className="h-12 w-40 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Services Grid Skeleton */}
      <div className="px-4 max-w-7xl mx-auto">
        <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-lg">
              <div className="h-12 w-12 bg-gray-200 rounded-full mb-4" />
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section Skeleton */}
      <div className="bg-gray-100 px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-4" />
          <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto mb-8" />
          <div className="h-12 w-48 bg-gray-200 rounded-lg mx-auto" />
        </div>
      </div>

      {/* Service Areas Skeleton */}
      <div className="px-4 max-w-7xl mx-auto">
        <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}
