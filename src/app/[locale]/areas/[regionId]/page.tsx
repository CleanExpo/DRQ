'use client';

import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { 
  Clock, 
  Phone, 
  MapPin, 
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Mail,
  Info
} from 'lucide-react';
import { SERVICE_REGIONS, type ServiceRegion } from '../../../../services/types/IServiceArea';
import { useEmergency } from '../../../../hooks/useEmergency';

// Dynamically import the map component to avoid SSR issues
const RegionMap = dynamic(() => import('../../../../components/maps/RegionMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] bg-gray-100 animate-pulse rounded-lg" />
  )
});

interface AreaPageProps {
  params: {
    regionId: string;
  };
}

export async function generateMetadata({ params }: AreaPageProps): Promise<Metadata> {
  const region = SERVICE_REGIONS.find(r => r.id === params.regionId);
  if (!region) return {};

  return {
    title: `${region.name} Service Area | Disaster Recovery Queensland`,
    description: `Professional disaster recovery services in ${region.name}. ${region.description}`,
    openGraph: {
      title: `${region.name} Service Area | DRQ`,
      description: region.description || `Professional disaster recovery services in ${region.name}`,
      url: `https://drq.com.au/areas/${region.id}`,
      siteName: 'Disaster Recovery Queensland',
      images: [
        {
          url: `/images/areas/${region.id}.jpg`,
          width: 1200,
          height: 630,
          alt: `${region.name} Service Area`
        }
      ],
      locale: 'en_AU',
      type: 'website',
    }
  };
}

export default function AreaPage({ params }: AreaPageProps) {
  const region = SERVICE_REGIONS.find(r => r.id === params.regionId);
  const { alerts } = useEmergency();

  if (!region) {
    notFound();
  }

  const regionAlerts = alerts.filter(alert =>
    alert.location?.toLowerCase().includes(region.name.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      {/* Region Map */}
      <div className="h-[400px] relative">
        <RegionMap
          center={region.coordinates}
          radius={region.coverage?.radius || 30}
          markers={[
            {
              position: region.coordinates,
              title: region.name,
              type: 'office'
            }
          ]}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-6">
          <div className="container mx-auto">
            <Link
              href="/areas"
              className="inline-flex items-center text-white/80 hover:text-white mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Service Areas
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              {region.name}
            </h1>
            {region.description && (
              <p className="text-xl text-white/90 max-w-2xl">
                {region.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Active Alerts */}
        {regionAlerts.length > 0 && (
          <div className="mb-8" data-testid="region-alerts">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center text-red-800 mb-4">
                <AlertTriangle className="w-6 h-6 mr-2" />
                <h2 className="text-xl font-bold">Active Alerts for {region.name}</h2>
              </div>
              <ul className="space-y-2">
                {regionAlerts.map(alert => (
                  <li 
                    key={alert.id}
                    className="flex items-start text-red-700"
                  >
                    <Info className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{alert.message}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Contact and Response Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium">Emergency Response</p>
                  <a 
                    href={`tel:${region.emergencyInfo?.primaryContact}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {region.emergencyInfo?.primaryContact}
                  </a>
                </div>
              </div>
              {region.emergencyInfo?.secondaryContact && (
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium">Alternative Contact</p>
                    <a 
                      href={`tel:${region.emergencyInfo.secondaryContact}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {region.emergencyInfo.secondaryContact}
                    </a>
                  </div>
                </div>
              )}
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium">Email</p>
                  <a 
                    href="mailto:admin@disasterrecoveryqld.au"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    admin@disasterrecoveryqld.au
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Response Information</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium">Average Response Time</p>
                  <p>{region.responseTime}</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium">Coverage Radius</p>
                  <p>{region.coverage?.radius}km from city center</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service Areas */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Serviced Areas</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {region.coverage?.boundaries && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Coverage Boundaries:</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {region.coverage.boundaries.map((boundary, index) => (
                    <li 
                      key={index}
                      className="flex items-center text-gray-600"
                    >
                      <MapPin className="w-4 h-4 text-blue-600 mr-2" />
                      {boundary}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <h3 className="font-medium text-gray-900 mb-2">Serviced Suburbs:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {region.suburbs.map(suburb => (
                <div
                  key={suburb}
                  className="flex items-center text-gray-600"
                >
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  {suburb}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Available Services */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {region.services.map(service => (
              <div
                key={service.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {service.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {service.shortDescription}
                </p>
                <Link
                  href={`/services/${service.slug}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Learn More
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-900 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Emergency Assistance?</h2>
          <p className="text-xl mb-6">
            Our team is ready to respond in {region.name} 24/7.
          </p>
          <a
            href={`tel:${region.contactNumber}`}
            className="inline-flex items-center bg-white text-blue-900 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-bold"
          >
            <Phone className="w-5 h-5 mr-2" />
            Call Now: {region.contactNumber}
          </a>
        </div>
      </div>
    </div>
  );
}
