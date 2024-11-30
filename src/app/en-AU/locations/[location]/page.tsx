import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getLocation } from '@/data/locations';
import type { Metadata } from 'next';

interface LocationPageProps {
  params: {
    location: string;
  };
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const location = getLocation(params.location);
  if (!location) return {};

  return {
    title: location.metaData.title,
    description: location.metaData.description,
    keywords: location.metaData.keywords,
  };
}

export default function LocationPage({ params }: LocationPageProps) {
  const location = getLocation(params.location);

  if (!location || location.status !== 'active') {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative h-[400px] w-full mb-8 rounded-lg overflow-hidden">
        <Image
          src={location.image}
          alt={`${location.name} service area`}
          fill
          className="object-cover"
          sizes="100vw"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h1 className="text-5xl font-bold text-white">{location.name} Service Area</h1>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Areas We Service</h2>
          <p className="text-gray-600 mb-4">
            We provide emergency restoration services throughout {location.name} and surrounding areas, including:
          </p>
          <div className="space-y-4">
            {location.serviceAreas.map((area) => (
              <div key={area.id} className="bg-white rounded-lg shadow p-4">
                <h3 className="font-semibold mb-2">{area.name}</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {area.suburbs.map((suburb) => (
                    <li key={suburb}>{suburb}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Services</h2>
          <div className="space-y-4">
            {location.services.map((service) => (
              <div key={service.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    quality={85}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-3">{service.description}</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    {service.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <p className="text-gray-600 mb-4">
          Need emergency restoration services in {location.name}? Contact us 24/7 for immediate assistance.
        </p>
        <a 
          href="/en-AU/contact" 
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Contact Now
        </a>
      </div>
    </div>
  );
}
