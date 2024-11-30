import Link from 'next/link';

export default function LocationNotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">Location Not Found</h1>
      <p className="text-gray-600 mb-8">
        Sorry, we couldn't find the location you're looking for. Please check our available service areas.
      </p>
      <div className="space-x-4">
        <Link 
          href="/en-AU/locations"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          View All Locations
        </Link>
        <Link 
          href="/en-AU"
          className="inline-block bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
