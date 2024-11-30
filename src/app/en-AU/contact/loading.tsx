import React from 'react'

export default function ContactLoadingPage() {
  return (
    <div className="flex flex-col gap-12 py-8 animate-pulse">
      {/* Hero Section Skeleton */}
      <section className="bg-blue-900/50 px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="h-12 bg-gray-200 rounded-lg w-1/3 mx-auto" />
          <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto" />
        </div>
      </section>

      {/* Contact Form Skeleton */}
      <section className="px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form Skeleton */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-6" />
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i}>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                  <div className="h-10 bg-gray-200 rounded w-full" />
                </div>
              ))}
              <div className="h-12 bg-gray-200 rounded w-full mt-4" />
            </div>
          </div>

          {/* Contact Details Skeleton */}
          <div className="space-y-8">
            <div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-6" />
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-6 bg-gray-200 rounded w-3/4" />
                ))}
              </div>
            </div>
            <div>
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
