import { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import { generateEmergencyServiceSchema } from '@/lib/schemas'

export const metadata: Metadata = {
  ...generateSEO({
    title: 'Professional Sewage Cleanup Services Brisbane & Gold Coast | 24/7 Emergency',
    description: 'Expert sewage cleanup and sanitization services. Professional cleanup with full sanitization. Available 24/7 across Brisbane & Gold Coast.',
    path: '/services/sewage-cleanup',
    type: 'website'
  }),
  alternates: {
    canonical: 'https://disasterrecoveryqld.au/services/sewage-cleanup'
  },
  openGraph: {
    title: 'Professional Sewage Cleanup Services Brisbane & Gold Coast | 24/7 Emergency',
    description: 'Expert sewage cleanup and sanitization services. Professional cleanup with full sanitization. Available 24/7 across Brisbane & Gold Coast.',
    url: 'https://disasterrecoveryqld.au/services/sewage-cleanup',
    type: 'website',
    images: [
      {
        url: 'https://disasterrecoveryqld.au/images/services/sewage-cleanup.jpg',
        width: 1200,
        height: 630,
        alt: 'Professional Sewage Cleanup Services'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Professional Sewage Cleanup Services Brisbane & Gold Coast',
    description: 'Expert sewage cleanup and sanitization services. Available 24/7 for emergencies.',
    images: ['https://disasterrecoveryqld.au/images/services/sewage-cleanup.jpg']
  }
}

// Generate schema for the page
export const schema = generateEmergencyServiceSchema({
  name: 'Sewage Cleanup Services',
  description: 'Professional sewage cleanup and sanitization services available 24/7. Expert cleanup with full sanitization across Brisbane & Gold Coast.',
  provider: 'Disaster Recovery QLD',
  areaServed: ['Brisbane', 'Gold Coast'],
  price: '$$'
})

// Additional metadata for specific regions
export const regions = [
  {
    name: 'Brisbane',
    title: 'Sewage Cleanup Brisbane | 24/7 Emergency Service',
    description: 'Professional sewage cleanup services in Brisbane. Expert sanitization, fast response times. Available 24/7 for immediate assistance.'
  },
  {
    name: 'Gold Coast',
    title: 'Sewage Cleanup Gold Coast | 24/7 Emergency Service',
    description: 'Professional sewage cleanup services in Gold Coast. Expert sanitization, fast response times. Available 24/7 for immediate assistance.'
  },
  {
    name: 'Ipswich',
    title: 'Sewage Cleanup Ipswich | 24/7 Emergency Service',
    description: 'Professional sewage cleanup services in Ipswich. Expert sanitization, fast response times. Available 24/7 for immediate assistance.'
  }
]
