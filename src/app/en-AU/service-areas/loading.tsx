import React from 'react'

export default function ServiceAreasLoadingPage() {
  return (
    <div className="flex flex-col gap-12 py-8 animate-pulse">
      {/* Hero Section Skeleton */}
      <section className="bg-blue-900/50 px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="h-12 bg-gray-200 rounded-lg w-1/3 mx-auto" />
          <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto" />
        </div>
      </section>

      {/* Areas List Skeleton */}
      <section className="px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Areas */}
          <div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 bg-gray-200 rounded-lg"
                />
              ))}
            </div>
          </div>

          {/* Postcode Checker Skeleton */}
          <div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8" />
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="space-y-4">
                <div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                  <div className="h-10 bg-gray-200 rounded w-full" />
                </div>
                <div className="h-12 bg-gray-200 rounded w-full" />
              </div>
              <div className="mt-6">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Map Skeleton */}
      <section className="px-4 py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-8" />
          <div className="w-full h-[400px] bg-gray-200 rounded-lg" />
        </div>
      </section>

      {/* CTA Skeleton */}
      <section className="bg-blue-900/50 px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-6" />
          <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto mb-8" />
          <div className="flex justify-center space-x-4">
            <div className="h-12 w-40 bg-gray-200 rounded-lg" />
            <div className="h-12 w-40 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </section>
    </div>
  )
}
