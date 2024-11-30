import { CONTACT } from '../constants/contact';
import { Service } from '../constants/services';

const baseUrl = process.env.NEXT_PUBLIC_SITEMAP_URL;

interface SchemaContext {
  '@context': 'https://schema.org';
  '@type': string;
  [key: string]: any;
}

export const generateOrganizationSchema = (): SchemaContext => ({
  '@context': 'https://schema.org',
  '@type': 'EmergencyService',
  name: CONTACT.BUSINESS_NAME,
  url: baseUrl,
  logo: `${baseUrl}/images/logo.png`,
  image: `${baseUrl}/images/building.jpg`,
  telephone: CONTACT.PHONE,
  email: CONTACT.EMAIL,
  address: {
    '@type': 'PostalAddress',
    streetAddress: CONTACT.ADDRESS.STREET,
    addressLocality: CONTACT.ADDRESS.SUBURB,
    addressRegion: CONTACT.ADDRESS.STATE,
    postalCode: CONTACT.ADDRESS.POSTCODE,
    addressCountry: 'AU'
  },
  areaServed: {
    '@type': 'State',
    name: 'Queensland',
    containsPlace: {
      '@type': 'City',
      name: 'Brisbane'
    }
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
  availableService: 'Emergency Restoration Services'
});

export const generateServiceSchema = (service: Service): SchemaContext => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: service.name,
  url: `${baseUrl}${service.href}`,
  description: service.description,
  provider: {
    '@type': 'EmergencyService',
    name: CONTACT.BUSINESS_NAME,
    url: baseUrl
  },
  areaServed: {
    '@type': 'State',
    name: 'Queensland'
  },
  availableChannel: {
    '@type': 'ServiceChannel',
    serviceUrl: `${baseUrl}${service.href}`,
    servicePhone: CONTACT.PHONE,
    availableLanguage: {
      '@type': 'Language',
      name: 'English'
    }
  }
});

export const generateLocalBusinessSchema = (): SchemaContext => ({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: CONTACT.BUSINESS_NAME,
  image: `${baseUrl}/images/building.jpg`,
  '@id': baseUrl,
  url: baseUrl,
  telephone: CONTACT.PHONE,
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: CONTACT.ADDRESS.STREET,
    addressLocality: CONTACT.ADDRESS.SUBURB,
    addressRegion: CONTACT.ADDRESS.STATE,
    postalCode: CONTACT.ADDRESS.POSTCODE,
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
  sameAs: [
    CONTACT.SOCIAL.FACEBOOK,
    CONTACT.SOCIAL.INSTAGRAM,
    CONTACT.SOCIAL.LINKEDIN
  ]
});

export const generateBreadcrumbSchema = (items: { name: string; url: string }[]): SchemaContext => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `${baseUrl}${item.url}`
  }))
});

export const generateFAQSchema = (faqs: { question: string; answer: string }[]): SchemaContext => ({
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
});
