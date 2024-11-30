import React from 'react'

export default function FAQLoadingPage() {
  return (
    <div className="flex flex-col gap-12 py-8 animate-pulse">
      {/* Hero Section Skeleton */}
      <section className="bg-blue-900/50 px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="h-12 bg-gray-200 rounded-lg w-1/2 mx-auto mb-6" />
          <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto" />
        </div>
      </section>

      {/* FAQ Content Skeleton */}
      <section className="px-4 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Categories Sidebar Skeleton */}
          <div className="md:col-span-1">
            <div className="h-8 bg-gray-200 rounded w-2/3 mb-4" />
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-6 bg-gray-200 rounded w-3/4" />
              ))}
            </div>
          </div>

          {/* FAQ List Skeleton */}
          <div className="md:col-span-3">
            {[...Array(3)].map((_, categoryIndex) => (
              <div key={categoryIndex} className="mb-12">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-6" />
                <div className="space-y-6">
                  {[...Array(3)].map((_, faqIndex) => (
                    <div
                      key={faqIndex}
                      className="bg-white p-6 rounded-lg shadow-md"
                    >
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-full" />
                        <div className="h-4 bg-gray-200 rounded w-5/6" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
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
