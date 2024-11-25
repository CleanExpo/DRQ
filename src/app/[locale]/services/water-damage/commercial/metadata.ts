import { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import { generateEmergencyServiceSchema } from '@/lib/schemas'
import { serviceStructure, commercialServices } from '@/config/services'

export const metadata: Metadata = {
  ...generateSEO({
    title: 'Commercial Water Damage Restoration | Professional Services',
    description: 'Professional water damage restoration services for commercial properties. Fast response, expert restoration, available 24/7 across Brisbane & Gold Coast.',
    path: '/services/water-damage/commercial',
    type: 'website'
  }),
  alternates: {
    canonical: 'https://disasterrecoveryqld.au/services/water-damage/commercial'
  },
  openGraph: {
    title: 'Commercial Water Damage Restoration | Professional Services',
    description: commercialServices.waterDamage.description,
    url: 'https://disasterrecoveryqld.au/services/water-damage/commercial',
    type: 'website',
    images: [
      {
        url: 'https://disasterrecoveryqld.au/images/services/water-damage-commercial.jpg',
        width: 1200,
        height: 630,
        alt: 'Commercial Water Damage Restoration Services'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: commercialServices.waterDamage.title,
    description: commercialServices.waterDamage.description,
    images: ['https://disasterrecoveryqld.au/images/services/water-damage-commercial.jpg']
  }
}

// Generate schema for the page
export const schema = generateEmergencyServiceSchema({
  name: commercialServices.waterDamage.title,
  description: commercialServices.waterDamage.description,
  provider: 'Disaster Recovery QLD',
  areaServed: ['Brisbane', 'Gold Coast'],
  price: '$$$'
})

// FAQ Schema
export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What commercial water damage services do you provide?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Our commercial water damage services include ${commercialServices.waterDamage.features.join(', ')}. We provide comprehensive solutions tailored to commercial properties.`
      }
    },
    {
      '@type': 'Question',
      name: 'What is your response time for commercial water damage?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `We provide priority response for all commercial clients with an average response time of ${serviceStructure.waterDamage.responseTime}. Our teams are available 24/7 for emergency situations.`
      }
    },
    {
      '@type': 'Question',
      name: 'Do you handle large-scale commercial water damage?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, we have the expertise and equipment to handle water damage restoration for properties of any size. Our teams are experienced in managing large-scale commercial projects while minimizing business disruption.'
      }
    }
  ]
}

// Additional metadata for regions
export const regions = [
  {
    name: 'Brisbane',
    title: 'Commercial Water Damage Restoration Brisbane | 24/7 Service',
    description: 'Professional water damage restoration for commercial properties in Brisbane. Fast response times, expert service. Available 24/7 for emergencies.'
  },
  {
    name: 'Gold Coast',
    title: 'Commercial Water Damage Restoration Gold Coast | 24/7 Service',
    description: 'Professional water damage restoration for commercial properties in Gold Coast. Fast response times, expert service. Available 24/7 for emergencies.'
  }
];
