import { Metadata } from 'next';
import { SearchBar } from '@/components/search/SearchBar';

export const metadata: Metadata = {
  title: 'Search Emergency Services | Disaster Recovery QLD',
  description: 'Search for emergency water damage, fire damage, and mould remediation services across Southeast Queensland.',
};

interface SearchPageProps {
  searchParams: { q?: string };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Search Emergency Services
      </h1>

      <div className="mb-12">
        <SearchBar />
      </div>

      <div className="mt-8">
        <div className="bg-blue-50 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">
            Need Immediate Assistance?
          </h2>
          <p className="text-blue-800 mb-4">
            Our emergency response team is available 24/7 across Southeast Queensland.
          </p>
          <a
            href="tel:1300309361"
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-full
                     hover:bg-red-700 transition-colors duration-300 font-semibold"
          >
            <svg 
              className="w-5 h-5 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
              />
            </svg>
            Call 1300 309 361
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Water Damage
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>Emergency Water Extraction</li>
              <li>Flood Damage Restoration</li>
              <li>Structural Drying</li>
              <li>Moisture Detection</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Fire Damage
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>Fire Damage Restoration</li>
              <li>Smoke Damage Cleanup</li>
              <li>Odor Removal</li>
              <li>Structural Repairs</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Mould Remediation
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>Mould Inspection</li>
              <li>Safe Mould Removal</li>
              <li>Prevention Treatment</li>
              <li>Air Quality Testing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
