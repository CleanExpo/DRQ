import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LocationPage from '../../../../components/templates/LocationPage';
import { SERVICE_AREAS } from '../../../../constants/areas';

interface LocationPageProps {
  params: {
    location: string;
  };
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const locationName = decodeURIComponent(params.location);
  const location = SERVICE_AREAS.find(area => 
    area.toLowerCase() === locationName.toLowerCase()
  );
  
  if (!location) return {};

  return {
    title: `Emergency Restoration Services in ${location} | DRQ`,
    description: `Professional disaster recovery and restoration services available 24/7 in ${location}. Expert water damage, fire damage, and mould remediation services.`,
    openGraph: {
      title: `Emergency Restoration Services in ${location}`,
      description: `24/7 emergency restoration services in ${location}. Professional disaster recovery solutions for residential and commercial properties.`,
      type: 'website'
    }
  };
}

export default function Location({ params }: LocationPageProps) {
  const locationName = decodeURIComponent(params.location);
  const location = SERVICE_AREAS.find(area => 
    area.toLowerCase() === locationName.toLowerCase()
  );
  
  if (!location) {
    notFound();
  }

  return (
    <LocationPage 
      location={{
        name: location,
        description: `Professional disaster recovery and restoration services available 24/7 in ${location}. We provide expert water damage, fire damage, and mould remediation services for both residential and commercial properties.`
      }} 
    />
  );
}
