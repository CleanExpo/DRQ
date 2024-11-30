export default function HomeLoading() {
  return (
    <main className="min-h-screen animate-pulse">
      {/* Hero Section Skeleton */}
      <div className="relative bg-gray-900 h-[600px]">
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <div className="h-12 w-3/4 bg-gray-700 rounded-lg mb-6" />
          <div className="h-6 w-2/3 bg-gray-700 rounded-lg mb-10" />
          <div className="flex space-x-4">
            <div className="h-12 w-48 bg-red-600 rounded-md" />
            <div className="h-12 w-36 bg-white rounded-md" />
          </div>
        </div>
      </div>

      {/* Services Section Skeleton */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="h-10 w-64 bg-gray-200 rounded-lg mx-auto mb-4" />
            <div className="h-6 w-96 bg-gray-200 rounded-lg mx-auto" />
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5].map((index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="h-8 w-3/4 bg-gray-200 rounded-lg mb-4" />
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-200 rounded" />
                    <div className="h-4 w-5/6 bg-gray-200 rounded" />
                  </div>
                  <div className="mt-4 flex items-center">
                    <div className="h-5 w-24 bg-gray-200 rounded" />
                    <div className="ml-2 h-5 w-5 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us Section Skeleton */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="h-10 w-48 bg-gray-200 rounded-lg mx-auto" />
          </div>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm"
              >
                <div className="h-6 w-6 bg-gray-200 rounded-full" />
                <div className="mt-4 h-6 w-40 bg-gray-200 rounded" />
                <div className="mt-2 h-16 w-full bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Service Areas Section Skeleton */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="h-10 w-48 bg-gray-200 rounded-lg mx-auto mb-4" />
            <div className="h-6 w-96 bg-gray-200 rounded-lg mx-auto" />
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {[1, 2, 3, 4, 5].map((index) => (
              <div
                key={index}
                className="h-8 w-24 bg-gray-200 rounded-full"
              />
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section Skeleton */}
      <div className="bg-red-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="h-10 w-64 bg-red-600 rounded-lg mx-auto mb-4" />
            <div className="h-6 w-96 bg-red-600 rounded-lg mx-auto mb-8" />
            <div className="h-12 w-48 bg-white rounded-md mx-auto" />
          </div>
        </div>
      </div>
    </main>
  );
}
