'use client';

import { useState, useEffect } from 'react';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { 
  Phone, 
  AlertTriangle, 
  Clock, 
  MapPin,
  CheckCircle,
  XCircle,
  Info,
  ArrowRight
} from 'lucide-react';
import { SERVICE_REGIONS } from '../../../services/types/IServiceArea';
import { useEmergency } from '../../../hooks/useEmergency';

// Dynamically import the map component
const RegionMap = dynamic(() => import('../../../components/maps/RegionMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] bg-gray-100 animate-pulse rounded-lg" />
  )
});

export const metadata: Metadata = {
  title: 'Emergency Services | Disaster Recovery Queensland',
  description: '24/7 emergency disaster recovery services across Queensland. Immediate response for water damage, fire damage, and flood recovery.',
  openGraph: {
    title: 'Emergency Services | DRQ',
    description: '24/7 emergency disaster recovery services. Call 1300 309 361 for immediate response.',
    url: 'https://drq.com.au/emergency',
    siteName: 'Disaster Recovery Queensland',
    images: [
      {
        url: '/images/emergency-og.jpg',
        width: 1200,
        height: 630,
        alt: 'DRQ Emergency Services'
      }
    ],
    locale: 'en_AU',
    type: 'website',
  }
};

const EMERGENCY_PROCEDURES = [
  {
    title: 'Water Damage',
    steps: [
      'Turn off water supply if possible',
      'Remove valuable items from affected areas',
      'Document damage with photos',
      'Contact us immediately'
    ]
  },
  {
    title: 'Fire Damage',
    steps: [
      'Ensure everyone is safely evacuated',
      'Wait for fire services clearance',
      'Do not enter the property',
      'Contact us for immediate response'
    ]
  },
  {
    title: 'Storm Damage',
    steps: [
      'Stay away from damaged structures',
      'Document all visible damage',
      'Secure loose items if safe',
      'Contact us for assessment'
    ]
  }
];

export default function EmergencyPage() {
  const { alerts } = useEmergency();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Get service status based on time and alerts
  const getServiceStatus = (region: typeof SERVICE_REGIONS[0]) => {
    const hasActiveAlerts = alerts.some(alert => 
      alert.location?.toLowerCase().includes(region.name.toLowerCase())
    );

    return {
      status: hasActiveAlerts ? 'limited' : 'active',
      message: hasActiveAlerts 
        ? 'Limited availability due to active emergencies'
        : 'Full service available'
    };
  };

  return (
    <div className="min-h-screen">
      {/* Emergency Banner */}
      <div className="bg-red-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Emergency Response
            </h1>
            <p className="text-xl">
              Available 24/7 for immediate assistance
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:1300309361"
              className="inline-flex items-center bg-white text-red-600 px-8 py-4 rounded-lg hover:bg-red-50 transition-colors font-bold text-lg"
            >
              <Phone className="w-6 h-6 mr-2" />
              Call 1300 309 361
            </a>
            <div className="text-white/90">
              Current Time: {currentTime.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <div className="bg-yellow-50 border-t border-b border-yellow-100 py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center text-yellow-800 mb-4">
              <AlertTriangle className="w-6 h-6 mr-2" />
              <h2 className="text-2xl font-bold">Active Emergency Alerts</h2>
            </div>
            <div className="space-y-4">
              {alerts.map(alert => (
                <div 
                  key={alert.id}
                  className="bg-white rounded-lg p-4 border border-yellow-200"
                >
                  <div className="flex items-start">
                    <Info className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-900">{alert.message}</p>
                      <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                        {alert.location && (
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {alert.location}
                          </span>
                        )}
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {new Date(alert.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Service Status */}
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Current Service Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICE_REGIONS.map(region => {
              const status = getServiceStatus(region);
              return (
                <div 
                  key={region.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      {region.name}
                    </h3>
                    <span 
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        status.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {status.status === 'active' ? (
                        <CheckCircle className="w-4 h-4 mr-1" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 mr-1" />
                      )}
                      {status.message}
                    </span>
                  </div>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Response Time: {region.responseTime}
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      {region.contactNumber}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Emergency Procedures */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Emergency Procedures
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {EMERGENCY_PROCEDURES.map((procedure, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {procedure.title}
                </h3>
                <ol className="space-y-3">
                  {procedure.steps.map((step, stepIndex) => (
                    <li 
                      key={stepIndex}
                      className="flex items-start"
                    >
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                        {stepIndex + 1}
                      </span>
                      <span className="text-gray-600">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Emergency Response Coverage
          </h2>
          <div className="h-[400px] rounded-lg overflow-hidden">
            <RegionMap
              center={{ lat: -27.4698, lng: 153.0251 }}
              radius={100}
              markers={SERVICE_REGIONS.map(region => ({
                position: region.coordinates,
                title: region.name,
                type: alerts.some(alert => 
                  alert.location?.toLowerCase().includes(region.name.toLowerCase())
                ) ? 'emergency' : 'office'
              }))}
              zoom={8}
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-red-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Don't Wait - Get Help Now
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Our emergency response team is ready to assist you 24/7.
            The sooner you call, the more damage we can prevent.
          </p>
          <a
            href="tel:1300309361"
            className="inline-flex items-center bg-white text-red-600 px-8 py-4 rounded-lg hover:bg-red-50 transition-colors font-bold text-lg"
          >
            <Phone className="w-6 h-6 mr-2" />
            Call 1300 309 361
          </a>
        </div>
      </div>
    </div>
  );
}
