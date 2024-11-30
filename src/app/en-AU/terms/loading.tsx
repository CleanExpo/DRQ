import React from 'react'

export default function TermsLoadingPage() {
  return (
    <div className="flex flex-col gap-12 py-8 animate-pulse">
      {/* Hero Section Skeleton */}
      <section className="bg-blue-900/50 px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="h-12 bg-gray-200 rounded-lg w-1/3 mx-auto mb-6" />
          <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto" />
        </div>
      </section>

      {/* Terms Content Skeleton */}
      <section className="px-4 max-w-4xl mx-auto">
        <div className="space-y-8">
          {/* Agreement Section */}
          <div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
          </div>

          {/* Services Section */}
          <div>
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-2/3" />
              ))}
            </div>
          </div>

          {/* Pricing Section */}
          <div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-3/4" />
              ))}
            </div>
          </div>

          {/* Emergency Services Section */}
          <div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-2/3" />
              ))}
            </div>
          </div>

          {/* Contact Section */}
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
          <div className="flex justify-center space-x-4">
            <div className="h-12 w-40 bg-gray-200 rounded-lg" />
            <div className="h-12 w-40 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </section>
    </div>
  )
}
