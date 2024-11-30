import Link from 'next/link';
import Image from 'next/image';
import { locations } from '@/data/locations';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Service Locations | DRQ',
  description: 'Professional disaster recovery and restoration services across South East Queensland. Find your local DRQ service area.',
  keywords: ['Queensland', 'restoration services', 'disaster recovery', 'service areas']
};

export default function LocationsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Service Locations</h1>
      
      {/* Active Locations */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Available Service Areas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {locations
            .filter(location => location.status === 'active')
            .map((location) => (
              <LocationCard 
                key={location.id}
                name={location.name}
                description={location.description}
                href={`/en-AU/locations/${location.slug}`}
                image={location.image}
                priority={location.id === 'brisbane'} // Prioritize loading for first location
              />
            ))}
        </div>
      </div>

      {/* Coming Soon Locations */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {locations
            .filter(location => location.status === 'coming-soon')
            .map((location) => (
              <LocationCard 
                key={location.id}
                name={location.name}
                description={location.description}
                href={`/en-AU/locations/${location.slug}`}
                image={location.image}
                comingSoon
              />
            ))}
        </div>
      </div>
    </div>
  );
}

interface LocationCardProps {
  name: string;
  description: string;
  href: string;
  image: string;
  priority?: boolean;
  comingSoon?: boolean;
}

function LocationCard({ name, description, href, image, priority = false, comingSoon = false }: LocationCardProps) {
  const card = (
    <div className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={image}
          alt={`${name} location`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={priority}
          quality={90}
        />
      </div>
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
          {name}
          {comingSoon && (
            <span className="text-sm font-normal px-2 py-1 bg-blue-100 text-blue-800 rounded">
              Coming Soon
            </span>
          )}
        </h2>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );

  if (comingSoon) {
    return card;
  }

  return (
    <Link href={href}>
      {card}
    </Link>
  );
}
