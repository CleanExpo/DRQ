import React from 'react'

export default function ServiceLoadingPage() {
  return (
    <div className="flex flex-col gap-12 py-8 animate-pulse">
      {/* Hero Section Skeleton */}
      <section className="bg-blue-900/50 px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="h-12 bg-gray-200 rounded-lg w-1/2 mx-auto mb-6" />
          <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto" />
        </div>
      </section>

      {/* Service Description Skeleton */}
      <section className="px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-6" />
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-4 bg-gray-200 rounded w-4/5" />
            </div>
          </div>
          <div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-6" />
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Skeleton */}
      <section className="bg-gray-50 px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps Skeleton */}
      <section className="px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4" />
                <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-2" />
                <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Skeleton */}
      <section className="bg-blue-900/50 px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-4" />
          <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto mb-8" />
          <div className="flex justify-center gap-4">
            <div className="h-12 w-40 bg-gray-200 rounded-lg" />
            <div className="h-12 w-40 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </section>
    </div>
  )
}
