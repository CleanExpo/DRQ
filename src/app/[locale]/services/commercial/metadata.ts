import { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import { generateProfessionalServiceSchema } from '@/lib/schemas'

export const metadata: Metadata = {
  ...generateSEO({
    title: 'Commercial Restoration Services | Disaster Recovery QLD',
    description: 'Professional restoration services for commercial properties. Specialized solutions for offices, healthcare, retail, education, and industrial facilities.',
    path: '/services/commercial',
    type: 'website'
  }),
  alternates: {
    canonical: 'https://disasterrecoveryqld.au/services/commercial'
  },
  openGraph: {
    title: 'Commercial Restoration Services | Disaster Recovery QLD',
    description: 'Professional restoration services for commercial properties. Specialized solutions for offices, healthcare, retail, education, and industrial facilities.',
    url: 'https://disasterrecoveryqld.au/services/commercial',
    type: 'website',
    images: [
      {
        url: 'https://disasterrecoveryqld.au/images/services/commercial.jpg',
        width: 1200,
        height: 630,
        alt: 'Commercial Restoration Services'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Commercial Restoration Services',
    description: 'Professional restoration services for commercial properties. Available 24/7.',
    images: ['https://disasterrecoveryqld.au/images/services/commercial.jpg']
  }
}

// Generate schema for the page
export const schema = generateProfessionalServiceSchema({
  name: 'Commercial Restoration Services',
  description: 'Professional restoration services for commercial properties. Specialized solutions for offices, healthcare, retail, education, and industrial facilities.',
  provider: 'Disaster Recovery QLD',
  areaServed: ['Brisbane', 'Gold Coast'],
  price: '$$'
})

// Industry-specific metadata
export const industries = [
  {
    id: 'office-buildings',
    title: 'Office Building Restoration Services | Commercial Services',
    description: 'Professional restoration services for office buildings. Minimizing business disruption with 24/7 emergency response.'
  },
  {
    id: 'retail-spaces',
    title: 'Retail Space Restoration Services | Commercial Services',
    description: 'Specialized restoration services for retail spaces. After-hours service and rapid reopening solutions.'
  },
  {
    id: 'healthcare',
    title: 'Healthcare Facility Restoration | Commercial Services',
    description: 'Expert restoration services for healthcare facilities. Maintaining sterile environments and code compliance.'
  },
  {
    id: 'education',
    title: 'Educational Institution Restoration | Commercial Services',
    description: 'Professional restoration services for schools and educational facilities. Holiday period work and safety protocols.'
  },
  {
    id: 'industrial',
    title: 'Industrial Facility Restoration | Commercial Services',
    description: 'Specialized restoration services for industrial facilities. Equipment protection and environmental compliance.'
  },
  {
    id: 'strata',
    title: 'Strata Property Restoration | Commercial Services',
    description: 'Expert restoration services for strata properties. Common area management and body corporate liaison.'
  }
]

// FAQ Schema
export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Do you provide 24/7 commercial emergency services?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, we provide 24/7 emergency response services for all commercial properties. Our dedicated commercial response team is available around the clock to minimize business disruption.'
      }
    },
    {
      '@type': 'Question',
      name: 'What types of commercial properties do you service?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We service all types of commercial properties including office buildings, retail spaces, healthcare facilities, educational institutions, industrial facilities, and strata properties.'
      }
    },
    {
      '@type': 'Question',
      name: 'How do you minimize business disruption during restoration?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We employ strategies such as after-hours work, sectional restoration, and rapid response teams to minimize disruption to your business operations. Our goal is to maintain business continuity while completing necessary restoration work.'
      }
    }
  ]
}
