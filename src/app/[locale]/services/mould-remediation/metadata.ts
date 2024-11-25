import { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import { generateProfessionalServiceSchema } from '@/lib/schemas'

export const metadata: Metadata = {
  ...generateSEO({
    title: 'Professional Mould Remediation Brisbane & Gold Coast | Expert Service',
    description: 'Expert mould detection and removal services. Professional remediation and prevention. Servicing Brisbane & Gold Coast areas.',
    path: '/services/mould-remediation',
    type: 'website'
  }),
  alternates: {
    canonical: 'https://disasterrecoveryqld.au/services/mould-remediation'
  },
  openGraph: {
    title: 'Professional Mould Remediation Brisbane & Gold Coast | Expert Service',
    description: 'Expert mould detection and removal services. Professional remediation and prevention. Servicing Brisbane & Gold Coast areas.',
    url: 'https://disasterrecoveryqld.au/services/mould-remediation',
    type: 'website',
    images: [
      {
        url: 'https://disasterrecoveryqld.au/images/services/mould-remediation.jpg',
        width: 1200,
        height: 630,
        alt: 'Professional Mould Remediation Services'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Professional Mould Remediation Brisbane & Gold Coast',
    description: 'Expert mould detection and removal services. Professional remediation and prevention.',
    images: ['https://disasterrecoveryqld.au/images/services/mould-remediation.jpg']
  }
}

// Generate schema for the page
export const schema = generateProfessionalServiceSchema({
  name: 'Mould Remediation Services',
  description: 'Professional mould inspection, removal, and prevention services. Expert remediation for residential and commercial properties.',
  provider: 'Disaster Recovery QLD',
  areaServed: ['Brisbane', 'Gold Coast'],
  price: '$$'
})

// Additional metadata for specific regions
export const regions = [
  {
    name: 'Brisbane',
    title: 'Mould Remediation Brisbane | Professional Mould Removal',
    description: 'Expert mould remediation services in Brisbane. Professional inspection, removal, and prevention. Book an assessment today.'
  },
  {
    name: 'Gold Coast',
    title: 'Mould Remediation Gold Coast | Professional Mould Removal',
    description: 'Expert mould remediation services in Gold Coast. Professional inspection, removal, and prevention. Book an assessment today.'
  },
  {
    name: 'Ipswich',
    title: 'Mould Remediation Ipswich | Professional Mould Removal',
    description: 'Expert mould remediation services in Ipswich. Professional inspection, removal, and prevention. Book an assessment today.'
  }
]

// FAQ Schema
export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How long does mould remediation take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The duration of mould remediation depends on the extent of the problem. Small areas might take 1-2 days, while larger infestations could take several days to a week. Our thorough process ensures complete removal and prevention.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is professional mould removal necessary?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Professional mould removal is recommended as it ensures proper identification of the mould type, safe removal procedures, and addresses the underlying cause to prevent recurrence. DIY methods often don\'t fully address the problem.'
      }
    },
    {
      '@type': 'Question',
      name: 'How do you prevent mould from returning?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We prevent mould recurrence through moisture control, improved ventilation, proper drainage solutions, and preventive treatments. We also provide recommendations for ongoing maintenance and monitoring.'
      }
    }
  ]
}
