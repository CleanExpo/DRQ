export default function LocationLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-10 w-64 bg-gray-200 rounded animate-pulse mb-6"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>

        <div>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 bg-white rounded-lg shadow">
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="h-4 w-full max-w-lg bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="h-12 w-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
}
