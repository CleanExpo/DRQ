import { Metadata } from 'next'

interface SEOProps {
  title: string
  description: string
  path: string
  type?: 'website' | 'article'
  imageUrl?: string
}

export function generateSEO({
  title,
  description,
  path,
  type = 'website',
  imageUrl = '/images/og-image.jpg'
}: SEOProps): Metadata {
  const baseUrl = 'https://disasterrecoveryqld.au'
  const url = `${baseUrl}${path}`

  return {
    title: {
      default: title,
      template: `%s | Disaster Recovery QLD`
    },
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'Disaster Recovery QLD',
      type,
      locale: 'en-AU',
      images: [
        {
          url: `${baseUrl}${imageUrl}`,
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}${imageUrl}`]
    },
    alternates: {
      canonical: url
    }
  }
}

// Local Business Schema
export function generateLocalBusinessSchema(location: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Disaster Recovery QLD',
    image: '/images/logo.png',
    '@id': 'https://disasterrecoveryqld.au',
    url: 'https://disasterrecoveryqld.au',
    telephone: '1300309361',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Example Street',
      addressLocality: location,
      addressRegion: 'QLD',
      postalCode: '4000',
      addressCountry: 'AU'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -27.4698,
      longitude: 153.0251
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ],
      opens: '00:00',
      closes: '23:59'
    },
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: -27.4698,
        longitude: 153.0251
      },
      geoRadius: '50000'
    },
    sameAs: [
      'https://facebook.com/disasterrecoveryqld',
      'https://instagram.com/disasterrecoveryqld'
    ]
  }
}
