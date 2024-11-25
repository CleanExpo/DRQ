interface ServiceSchema {
  name: string;
  description: string;
  provider: string;
  areaServed: string[];
  price?: string;
}

interface ReviewData {
  ratingValue: number;
  reviewCount: number;
  bestRating: number;
}

interface ServiceHours {
  days: string[];
  opens: string;
  closes: string;
}

export function generateLocalBusinessSchema(location: string, hours?: ServiceHours) {
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
    openingHoursSpecification: hours ? {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: hours.days,
      opens: hours.opens,
      closes: hours.closes
    } : {
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
    }
  };
}

export function generateEmergencyServiceSchema(service: ServiceSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'EmergencyService',
    name: service.name,
    description: service.description,
    availabilityStarts: '00:00',
    availabilityEnds: '23:59',
    areaServed: service.areaServed.map(area => ({
      '@type': 'City',
      name: area
    })),
    provider: {
      '@type': 'Organization',
      name: service.provider,
      url: 'https://disasterrecoveryqld.au',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '1300309361',
        contactType: 'emergency',
        areaServed: 'AU',
        availabilityHours: '24/7'
      }
    }
  };
}

export function generateProfessionalServiceSchema(service: ServiceSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: service.name,
    description: service.description,
    priceRange: service.price || '$$',
    areaServed: service.areaServed.map(area => ({
      '@type': 'City',
      name: area
    })),
    provider: {
      '@type': 'Organization',
      name: service.provider,
      url: 'https://disasterrecoveryqld.au'
    }
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

export function generateAggregateRatingSchema(data: ReviewData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    ratingValue: data.ratingValue,
    reviewCount: data.reviewCount,
    bestRating: data.bestRating
  };
}

// Pre-defined service schemas
export const serviceSchemas = {
  waterDamage: generateEmergencyServiceSchema({
    name: 'Water Damage Restoration',
    description: 'Emergency water damage restoration services available 24/7',
    provider: 'Disaster Recovery QLD',
    areaServed: ['Brisbane', 'Gold Coast'],
    price: '$$'
  }),

  sewageCleanup: generateEmergencyServiceSchema({
    name: 'Sewage Cleanup Services',
    description: 'Professional sewage cleanup and sanitization services',
    provider: 'Disaster Recovery QLD',
    areaServed: ['Brisbane', 'Gold Coast'],
    price: '$$'
  }),

  mouldRemediation: generateProfessionalServiceSchema({
    name: 'Mould Remediation Services',
    description: 'Expert mould inspection and remediation services',
    provider: 'Disaster Recovery QLD',
    areaServed: ['Brisbane', 'Gold Coast'],
    price: '$$'
  })
};
