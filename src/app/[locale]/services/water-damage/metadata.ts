import { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import { generateEmergencyServiceSchema } from '@/lib/schemas'

export const metadata: Metadata = {
  ...generateSEO({
    title: 'Water Damage Restoration Brisbane & Gold Coast | 24/7 Emergency Service',
    description: 'Professional water damage restoration services. Fast response, expert restoration, available 24/7 across Brisbane & Gold Coast. Call now for immediate assistance.',
    path: '/services/water-damage',
    type: 'website'
  }),
  alternates: {
    canonical: 'https://disasterrecoveryqld.au/services/water-damage'
  },
  openGraph: {
    title: 'Water Damage Restoration Brisbane & Gold Coast | 24/7 Emergency Service',
    description: 'Professional water damage restoration services. Fast response, expert restoration, available 24/7 across Brisbane & Gold Coast. Call now for immediate assistance.',
    url: 'https://disasterrecoveryqld.au/services/water-damage',
    type: 'website',
    images: [
      {
        url: 'https://disasterrecoveryqld.au/images/services/water-damage.jpg',
        width: 1200,
        height: 630,
        alt: 'Water Damage Restoration Services'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Water Damage Restoration Brisbane & Gold Coast',
    description: 'Professional water damage restoration services. Fast response, expert restoration, available 24/7.',
    images: ['https://disasterrecoveryqld.au/images/services/water-damage.jpg']
  }
}

// Generate schema for the page
export const schema = generateEmergencyServiceSchema({
  name: 'Water Damage Restoration',
  description: 'Professional water damage restoration services available 24/7. Fast response times across Brisbane & Gold Coast.',
  provider: 'Disaster Recovery QLD',
  areaServed: ['Brisbane', 'Gold Coast'],
  price: '$$'
})

// Additional metadata for specific regions
export const regions = [
  {
    name: 'Brisbane',
    title: 'Water Damage Restoration Brisbane | 24/7 Emergency Service',
    description: 'Emergency water damage restoration in Brisbane. Fast response times, professional service. Available 24/7 for immediate assistance.'
  },
  {
    name: 'Gold Coast',
    title: 'Water Damage Restoration Gold Coast | 24/7 Emergency Service',
    description: 'Emergency water damage restoration in Gold Coast. Fast response times, professional service. Available 24/7 for immediate assistance.'
  }
]
