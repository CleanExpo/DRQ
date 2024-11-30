import React from 'react';
import { services } from '@/config/services';
import Link from 'next/link';
import { getServiceImages } from '@/utils/pexels';
import { ServiceImage } from '@/components/ServiceImage';

interface ServicesPageProps {
  params: {
    locale: string;
  };
}

export default async function ServicesPage({ params: { locale } }: ServicesPageProps) {
  // Fetch images for each service
  const serviceImagesPromises = services.map(async (service) => {
    const images = await getServiceImages(service.id, 1);
    return { serviceId: service.id, image: images[0] };
  });

  const serviceImages = await Promise.all(serviceImagesPromises);

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Our Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => {
          const serviceImage = serviceImages.find(img => img.serviceId === service.id);
          
          return (
            <Link
              key={service.id}
              href={`/${locale}/services/${service.id}`}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 group-hover:scale-105">
                {serviceImage?.image && (
                  <ServiceImage
                    photo={serviceImage.image}
                    alt={service.name}
                    priority={false}
                    className="h-48"
                    showAttribution={false}
                  />
                )}
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2">{service.name}</h2>
                  <p className="text-gray-600 mb-4">{service.shortDescription}</p>
                  {service.emergencyResponse.available && (
                    <div className="text-red-600 text-sm">
                      24/7 Emergency Response Available
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Our Services | Professional Restoration Services',
  description: 'Comprehensive restoration services including water damage, storm damage, mould remediation, and more. Available 24/7 for emergencies.',
};
