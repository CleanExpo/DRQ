import React from 'react'

export const LoadingFooter = () => {
  return (
    <footer className="bg-blue-900 text-white animate-pulse">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info Skeleton */}
          <div>
            <div className="h-6 bg-gray-200/20 rounded w-24 mb-4" />
            <div className="h-4 bg-gray-200/20 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200/20 rounded w-3/4" />
          </div>

          {/* Services Skeleton */}
          <div>
            <div className="h-6 bg-gray-200/20 rounded w-32 mb-4" />
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200/20 rounded w-3/4" />
              ))}
            </div>
          </div>

          {/* Service Areas Skeleton */}
          <div>
            <div className="h-6 bg-gray-200/20 rounded w-32 mb-4" />
            <div className="space-y-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200/20 rounded w-2/3" />
              ))}
            </div>
          </div>

          {/* Contact Skeleton */}
          <div>
            <div className="h-6 bg-gray-200/20 rounded w-28 mb-4" />
            <div className="space-y-4">
              <div>
                <div className="h-4 bg-gray-200/20 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200/20 rounded w-3/4" />
              </div>
              <div>
                <div className="h-4 bg-gray-200/20 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200/20 rounded w-3/4" />
              </div>
              <div className="h-10 bg-gray-200/20 rounded-lg w-40" />
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-blue-800 text-center">
          <div className="h-4 bg-gray-200/20 rounded w-64 mx-auto mb-4" />
          <div className="flex justify-center space-x-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200/20 rounded w-20" />
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
