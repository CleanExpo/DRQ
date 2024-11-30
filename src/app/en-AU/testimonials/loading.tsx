import React from 'react'

export default function TestimonialsLoadingPage() {
  return (
    <div className="flex flex-col gap-12 py-8 animate-pulse">
      {/* Hero Section Skeleton */}
      <section className="bg-blue-900/50 px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="h-12 bg-gray-200 rounded-lg w-1/3 mx-auto mb-6" />
          <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto" />
        </div>
      </section>

      {/* Rating Summary Skeleton */}
      <section className="px-4 max-w-4xl mx-auto text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4" />
          <div className="flex justify-center items-center gap-4 mb-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-6 w-6 bg-gray-200 rounded" />
              ))}
            </div>
            <div className="h-8 w-12 bg-gray-200 rounded" />
          </div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
        </div>
      </section>

      {/* Testimonials Content Skeleton */}
      <section className="px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Skeleton */}
          <div className="md:col-span-1">
            {/* Filter by Service Skeleton */}
            <div className="mb-8">
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-4" />
              <div className="space-y-2">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="h-6 bg-gray-200 rounded w-3/4" />
                ))}
              </div>
            </div>

            {/* Filter by Rating Skeleton */}
            <div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-4" />
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-6 bg-gray-200 rounded w-2/3" />
                ))}
              </div>
            </div>
          </div>

          {/* Reviews Skeleton */}
          <div className="md:col-span-3">
            <div className="space-y-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="h-6 bg-gray-200 rounded w-1/3 mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, j) => (
                        <div key={j} className="h-6 w-6 bg-gray-200 rounded" />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                    <div className="h-4 bg-gray-200 rounded w-4/5" />
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
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
