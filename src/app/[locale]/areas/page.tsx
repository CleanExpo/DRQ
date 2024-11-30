'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { MapPin, Clock, Phone, Search, AlertTriangle, CheckCircle } from 'lucide-react';
import { SERVICE_REGIONS, type ServiceRegion } from '../../../services/types/IServiceArea';
import { useEmergency } from '../../../hooks/useEmergency';

export const metadata: Metadata = {
  title: 'Service Areas | Disaster Recovery Queensland',
  description: 'Find emergency restoration services in your area. Covering Brisbane, Gold Coast, Sunshine Coast and surrounding regions. 24/7 emergency response available.',
  openGraph: {
    title: 'Service Areas | DRQ',
    description: 'Find emergency restoration services in your area. 24/7 response available.',
    url: 'https://drq.com.au/areas',
    siteName: 'Disaster Recovery Queensland',
    images: [
      {
        url: '/images/service-areas-og.jpg',
        width: 1200,
        height: 630,
        alt: 'DRQ Service Areas'
      }
    ],
    locale: 'en_AU',
    type: 'website',
  }
};

export default function AreasPage() {
  const { alerts } = useEmergency();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'suburb' | 'postcode'>('suburb');

  // Filter regions based on search query
  const filteredRegions = SERVICE_REGIONS.filter(region => {
    const searchLower = searchQuery.toLowerCase();
    
    if (searchType === 'postcode') {
      return region.postcodes?.includes(searchQuery);
    }

    return (
      region.name.toLowerCase().includes(searchLower) ||
      region.suburbs.some(suburb => 
        suburb.toLowerCase().includes(searchLower)
      )
    );
  });

  const getResponseTimeClass = (time: string) => {
    if (time.includes('30-60')) return 'text-green-600';
    if (time.includes('45-90')) return 'text-yellow-600';
    return 'text-blue-600';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Service Areas</h1>
        <p className="text-xl text-gray-600">
          Find emergency restoration services in your area
        </p>
      </div>

      {/* Search Section */}
      <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="max-w-2xl mx-auto">
          {/* Search Type Toggle */}
          <div className="flex mb-4 gap-4">
            <button
              onClick={() => setSearchType('suburb')}
              className={`flex-1 py-2 px-4 rounded-lg ${
                searchType === 'suburb'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              data-testid="suburb-search-toggle"
            >
              Search by Suburb
            </button>
            <button
              onClick={() => setSearchType('postcode')}
              className={`flex-1 py-2 px-4 rounded-lg ${
                searchType === 'postcode'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              data-testid="postcode-search-toggle"
            >
              Search by Postcode
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <input
              type={searchType === 'postcode' ? 'number' : 'text'}
              placeholder={searchType === 'postcode' ? 'Enter postcode...' : 'Search by suburb or region...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              data-testid="search-input"
            />
            <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Regions Grid */}
      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        data-testid="regions-grid"
      >
        {filteredRegions.map(region => {
          const regionAlerts = alerts.filter(alert =>
            alert.location?.toLowerCase().includes(region.name.toLowerCase())
          );

          return (
            <div
              key={region.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              data-testid={`region-card-${region.id}`}
            >
              <div className="p-6">
                {/* Region Header */}
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {region.name}
                  </h2>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className={getResponseTimeClass(region.responseTime)}>
                      {region.responseTime}
                    </span>
                  </div>
                </div>

                {/* Active Alerts */}
                {regionAlerts.length > 0 && (
                  <div 
                    className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
                    data-testid={`region-alerts-${region.id}`}
                  >
                    <div className="flex items-center">
                      <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                      <p className="text-red-700 font-medium">
                        {regionAlerts.length} Active Alert{regionAlerts.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                )}

                {/* Coverage Info */}
                {region.coverage && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-700">
                      Coverage: {region.coverage.radius}km radius
                    </p>
                  </div>
                )}

                {/* Suburbs */}
                <div className="mb-4">
                  <h3 className="font-medium text-gray-900 mb-2">Serviced Suburbs:</h3>
                  <div className="flex flex-wrap gap-2">
                    {region.suburbs.slice(0, 3).map(suburb => (
                      <span
                        key={suburb}
                        className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                      >
                        <MapPin className="w-3 h-3 mr-1" />
                        {suburb}
                      </span>
                    ))}
                    {region.suburbs.length > 3 && (
                      <span className="text-sm text-gray-500">
                        +{region.suburbs.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Services */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">Available Services:</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {region.services.map(service => (
                      <div
                        key={service.id}
                        className="text-sm text-gray-600 flex items-center"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        {service.name}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <Link
                    href={`/areas/${region.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                    data-testid={`region-details-link-${region.id}`}
                  >
                    View Details
                  </Link>
                  <a
                    href={`tel:${region.contactNumber}`}
                    className="inline-flex items-center text-red-600 hover:text-red-800"
                    data-testid={`region-contact-${region.id}`}
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    Call Now
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* No Results */}
      {filteredRegions.length === 0 && (
        <div 
          className="text-center py-12 bg-gray-50 rounded-lg"
          data-testid="no-results"
        >
          <p className="text-gray-600">
            No service areas found matching "{searchQuery}"
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Try searching for a different {searchType === 'postcode' ? 'postcode' : 'suburb'} or{' '}
            <button
              onClick={() => setSearchType(searchType === 'postcode' ? 'suburb' : 'postcode')}
              className="text-blue-600 hover:text-blue-800"
            >
              switch to {searchType === 'postcode' ? 'suburb' : 'postcode'} search
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
