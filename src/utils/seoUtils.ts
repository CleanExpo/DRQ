import { i18nConfig, Locale } from '../config/i18n.config';
import { ServicePage, Location } from '../types/serviceTypes';

interface MetadataProps {
  service?: ServicePage;
  location?: Location;
  language: Locale;
  path: string;
}

interface GeneratedMetadata {
  title: string;
  description: string;
  canonical: string;
  alternates: {
    languages: Record<string, string>;
  };
  openGraph: {
    title: string;
    description: string;
    url: string;
    siteName: string;
    locale: string;
    type: string;
  };
  twitter: {
    card: string;
    title: string;
    description: string;
  };
  other: {
    'geo.region': string;
    'geo.placename': string;
    'geo.position': string;
    'ICBM': string;
    'emergency.service': string;
    'emergency.available': string;
    'emergency.response': string;
  };
}

const BASE_URL = 'https://disasterrecoveryqld.au';

export const generateMetadata = ({ service, location, language, path }: MetadataProps): GeneratedMetadata => {
  // Generate base title and description
  let title = 'Disaster Recovery QLD';
  let description = '24/7 Emergency disaster recovery services across Queensland. Professional restoration services with rapid response.';

  // Customize for service pages
  if (service) {
    title = `${service.title} in ${location?.name || 'Queensland'} | Disaster Recovery QLD`;
    description = `24/7 Emergency ${service.title} in ${location?.name || 'Queensland'}. Professional restoration services with rapid response. Call 1300 309 361 now!`;
  }

  // Customize for location pages
  if (location && !service) {
    title = `Emergency Restoration Services in ${location.name} | Disaster Recovery QLD`;
    description = `Professional disaster recovery services in ${location.name}. Water damage, fire damage, and mould remediation. Fast response times.`;
  }

  // Generate alternate language URLs
  const alternateUrls = i18nConfig.locales.reduce((acc, locale) => ({
    ...acc,
    [locale]: `${BASE_URL}/${locale}${path}`
  }), {});

  // Generate coordinates string if location is available
  const coordinates = location ? 
    `${location.coordinates.lat};${location.coordinates.lng}` :
    '-27.4698;153.0251'; // Default to Brisbane coordinates

  return {
    title,
    description,
    canonical: `${BASE_URL}${path}`,
    alternates: {
      languages: alternateUrls
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}${path}`,
      siteName: 'Disaster Recovery QLD',
      locale: language,
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    },
    other: {
      'geo.region': 'AU-QLD',
      'geo.placename': location?.name || 'Queensland',
      'geo.position': coordinates,
      'ICBM': coordinates.replace(';', ', '),
      'emergency.service': 'true',
      'emergency.available': '24/7',
      'emergency.response': location?.name ? '30-60 minutes' : 'varies by location'
    }
  };
};

export const generateServiceSchema = (service: ServicePage, location: Location) => ({
  '@context': 'https://schema.org',
  '@type': 'EmergencyService',
  'name': `${service.title} - Disaster Recovery QLD`,
  'url': `${BASE_URL}/services/${service.slug}`,
  'telephone': '1300 309 361',
  'availabilityStarts': '00:00',
  'availabilityEnds': '23:59',
  'areaServed': {
    '@type': 'State',
    'name': 'Queensland',
    'containsPlace': {
      '@type': 'City',
      'name': location.name,
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': location.coordinates.lat,
        'longitude': location.coordinates.lng
      }
    }
  },
  'serviceType': service.title,
  'provider': {
    '@type': 'Organization',
    'name': 'Disaster Recovery QLD',
    'address': {
      '@type': 'PostalAddress',
      'addressRegion': 'Queensland',
      'addressCountry': 'AU'
    }
  }
});

export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': items.map((item, index) => ({
    '@type': 'ListItem',
    'position': index + 1,
    'name': item.name,
    'item': `${BASE_URL}${item.url}`
  }))
});

export const generateLocalBusinessSchema = (location: Location) => ({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  'name': `Disaster Recovery QLD - ${location.name}`,
  'image': `${BASE_URL}/images/logo.png`,
  'telephone': '1300 309 361',
  'url': `${BASE_URL}/service-areas/${location.slug}`,
  'address': {
    '@type': 'PostalAddress',
    'addressLocality': location.name,
    'addressRegion': 'Queensland',
    'addressCountry': 'AU'
  },
  'geo': {
    '@type': 'GeoCoordinates',
    'latitude': location.coordinates.lat,
    'longitude': location.coordinates.lng
  },
  'areaServed': location.serviceArea.map(suburb => ({
    '@type': 'City',
    'name': suburb
  }))
});
