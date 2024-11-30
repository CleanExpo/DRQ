import React from 'react'

export default function PrivacyPolicyLoadingPage() {
  return (
    <div className="flex flex-col gap-12 py-8 animate-pulse">
      {/* Hero Section Skeleton */}
      <section className="bg-blue-900/50 px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="h-12 bg-gray-200 rounded-lg w-1/3 mx-auto mb-6" />
          <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto" />
        </div>
      </section>

      {/* Policy Content Skeleton */}
      <section className="px-4 max-w-4xl mx-auto">
        <div className="space-y-8">
          {/* Introduction */}
          <div>
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
          </div>

          {/* Information Collection */}
          <div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-2" />
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-2/3" />
              ))}
            </div>
          </div>

          {/* Usage Information */}
          <div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-3/4" />
              ))}
            </div>
          </div>

          {/* Information Sharing */}
          <div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-2/3" />
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-1/2" />
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
          <div className="h-12 w-40 bg-gray-200 rounded-lg mx-auto" />
        </div>
      </section>
    </div>
  )
}
