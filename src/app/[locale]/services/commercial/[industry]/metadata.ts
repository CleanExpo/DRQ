import { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import { generateProfessionalServiceSchema } from '@/lib/schemas'
import { commercialStructure, type CommercialId } from '@/config/services'

interface IndustryMetadataProps {
  params: {
    industry: string
  }
}

function getIndustryData(industryId: string) {
  return commercialStructure[industryId as CommercialId] || null;
}

export async function generateMetadata(
  { params }: IndustryMetadataProps
): Promise<Metadata> {
  const industry = getIndustryData(params.industry);
  if (!industry) {
    return {
      title: 'Industry Not Found',
      description: 'The requested industry could not be found.'
    };
  }

  return {
    ...generateSEO({
      title: `${industry.title} Restoration Services | Commercial Services`,
      description: `${industry.description} Professional restoration services with industry-specific solutions.`,
      path: `/services/commercial/${params.industry}`,
      type: 'website'
    }),
    alternates: {
      canonical: `https://disasterrecoveryqld.au/services/commercial/${params.industry}`
    },
    openGraph: {
      title: `${industry.title} Restoration Services | Commercial Services`,
      description: industry.description,
      url: `https://disasterrecoveryqld.au/services/commercial/${params.industry}`,
      type: 'website',
      images: [
        {
          url: `https://disasterrecoveryqld.au/images/commercial/${params.industry}.jpg`,
          width: 1200,
          height: 630,
          alt: `${industry.title} Services`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: industry.title,
      description: industry.description,
      images: [`https://disasterrecoveryqld.au/images/commercial/${params.industry}.jpg`]
    }
  };
}

// Generate schema for the page
export function generateSchema(industryId: string) {
  const industry = getIndustryData(industryId);
  if (!industry) return null;

  return generateProfessionalServiceSchema({
    name: industry.title,
    description: industry.description,
    provider: 'Disaster Recovery QLD',
    areaServed: ['Brisbane', 'Gold Coast'],
    price: '$$'
  });
}

// FAQ Schema
export function generateFAQSchema(industryId: string) {
  const industry = getIndustryData(industryId);
  if (!industry) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What services do you provide for ${industry.title.toLowerCase()}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `We provide comprehensive restoration services for ${industry.title.toLowerCase()}, including ${industry.features.slice(0, -1).join(', ')}, and ${industry.features.slice(-1)}. Our services are tailored to meet the specific needs of your industry.`
        }
      },
      {
        '@type': 'Question',
        name: 'Do you provide emergency services?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, we provide 24/7 emergency services for all commercial clients with priority response times. Our teams are equipped to handle emergencies of any scale.'
        }
      },
      {
        '@type': 'Question',
        name: 'What areas do you service?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We provide commercial restoration services across Brisbane, Gold Coast, and surrounding areas. Our strategically located teams ensure rapid response times for all commercial clients.'
        }
      }
    ]
  };
}

// Additional metadata for regions
export const regions = [
  {
    name: 'Brisbane',
    title: (industry: string) => `${industry} Restoration Brisbane | Commercial Services`,
    description: (industry: string) => `Professional restoration services for ${industry.toLowerCase()} in Brisbane. Fast response times, industry-specific solutions.`
  },
  {
    name: 'Gold Coast',
    title: (industry: string) => `${industry} Restoration Gold Coast | Commercial Services`,
    description: (industry: string) => `Professional restoration services for ${industry.toLowerCase()} in Gold Coast. Fast response times, industry-specific solutions.`
  }
];
