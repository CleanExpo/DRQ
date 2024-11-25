import { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import { generateEmergencyServiceSchema, generateProfessionalServiceSchema } from '@/lib/schemas'
import { serviceStructure, type ServiceId } from '@/config/services'

interface ServiceMetadataProps {
  params: {
    service: string
  }
}

function getServiceData(serviceId: string) {
  return serviceStructure[serviceId as ServiceId] || null;
}

export async function generateMetadata(
  { params }: ServiceMetadataProps
): Promise<Metadata> {
  const service = getServiceData(params.service);
  if (!service) {
    return {
      title: 'Service Not Found',
      description: 'The requested service could not be found.'
    };
  }

  return {
    ...generateSEO({
      title: `${service.title} Brisbane & Gold Coast | Professional Service`,
      description: service.longDescription,
      path: `/services/${params.service}`,
      type: 'website'
    }),
    alternates: {
      canonical: `https://disasterrecoveryqld.au/services/${params.service}`
    },
    openGraph: {
      title: `${service.title} Brisbane & Gold Coast | Professional Service`,
      description: service.longDescription,
      url: `https://disasterrecoveryqld.au/services/${params.service}`,
      type: 'website',
      images: [
        {
          url: `https://disasterrecoveryqld.au/images/services/${params.service}.jpg`,
          width: 1200,
          height: 630,
          alt: `${service.title} Services`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: service.title,
      description: service.shortDescription,
      images: [`https://disasterrecoveryqld.au/images/services/${params.service}.jpg`]
    }
  };
}

// Generate schema for the page
export function generateSchema(serviceId: string) {
  const service = getServiceData(serviceId);
  if (!service) return null;

  const schemaData = {
    name: service.title,
    description: service.longDescription,
    provider: 'Disaster Recovery QLD',
    areaServed: ['Brisbane', 'Gold Coast'],
    price: '$$'
  };

  return service.emergency
    ? generateEmergencyServiceSchema(schemaData)
    : generateProfessionalServiceSchema(schemaData);
}

// FAQ Schema
export function generateFAQSchema(serviceId: string) {
  const service = getServiceData(serviceId);
  if (!service) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What areas do you service for ${service.title.toLowerCase()}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We provide professional services across Brisbane, Gold Coast, and surrounding areas with local teams available for rapid response.'
        }
      },
      {
        '@type': 'Question',
        name: `What is your response time for ${service.title.toLowerCase()}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Our response time for ${service.title.toLowerCase()} is ${service.responseTime}. We prioritize emergency situations and have teams available 24/7.`
        }
      },
      {
        '@type': 'Question',
        name: 'Do you provide emergency services?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: service.emergency
            ? 'Yes, we provide 24/7 emergency services with rapid response teams available around the clock.'
            : 'While this service is not typically emergency-based, we do offer priority scheduling when needed. For emergencies, please contact our 24/7 hotline.'
        }
      }
    ]
  };
}

// Additional metadata for regions
export const regions = [
  {
    name: 'Brisbane',
    title: (service: string) => `${service} Brisbane | Professional Service`,
    description: (service: string) => `Professional ${service.toLowerCase()} services in Brisbane. Fast response times, expert service. Available 24/7 for emergencies.`
  },
  {
    name: 'Gold Coast',
    title: (service: string) => `${service} Gold Coast | Professional Service`,
    description: (service: string) => `Professional ${service.toLowerCase()} services in Gold Coast. Fast response times, expert service. Available 24/7 for emergencies.`
  },
  {
    name: 'Ipswich',
    title: (service: string) => `${service} Ipswich | Professional Service`,
    description: (service: string) => `Professional ${service.toLowerCase()} services in Ipswich. Fast response times, expert service. Available 24/7 for emergencies.`
  }
];
