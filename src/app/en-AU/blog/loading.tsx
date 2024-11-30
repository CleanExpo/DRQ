import React from 'react'

export default function BlogLoadingPage() {
  return (
    <div className="flex flex-col gap-12 py-8 animate-pulse">
      {/* Hero Section Skeleton */}
      <section className="bg-blue-900/50 px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="h-12 bg-gray-200 rounded-lg w-1/3 mx-auto mb-6" />
          <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto" />
        </div>
      </section>

      {/* Blog Content Skeleton */}
      <section className="px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Skeleton */}
          <div className="md:col-span-1">
            {/* Search Skeleton */}
            <div className="mb-8">
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-4" />
              <div className="h-10 bg-gray-200 rounded w-full" />
            </div>

            {/* Categories Skeleton */}
            <div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-4" />
              <div className="space-y-2">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="h-6 bg-gray-200 rounded w-3/4" />
                ))}
              </div>
            </div>
          </div>

          {/* Blog Posts Skeleton */}
          <div className="md:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-md overflow-hidden p-6"
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Skeleton */}
      <section className="bg-gray-50 px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8" />
          <div className="flex justify-center space-x-4">
            <div className="h-12 w-40 bg-gray-200 rounded-lg" />
            <div className="h-12 w-40 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </section>
    </div>
  )
}
