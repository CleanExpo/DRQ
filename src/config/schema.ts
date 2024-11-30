export interface ServiceType {
  id: string;
  name: string;
  title: string;
  description: string;
  shortDescription: string;
  seoMeta: {
    title: string;
    description: string;
    keywords: string[];
  };
  features: {
    title: string;
    description: string;
  }[];
  emergencyResponse: {
    available: boolean;
    responseTime: string;
    phone: string;
  };
  coverage: {
    areas: string[];
    radius: string;
  };
  customerTypes: ('residential' | 'commercial' | 'self-insured' | 'insurance')[];
}

export interface LocationType {
  slug: string;
  name: string;
  region: string;
  serviceArea: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface ServiceLocationProps {
  params: {
    locale: string;
    serviceId: string;
    location: string;
  };
}

export interface ServiceLocationMetadata {
  title: string;
  description: string;
  canonical: string;
  alternates: {
    [key: string]: string;
  };
}

export interface ServicePageData {
  service: ServiceType;
  location: LocationType;
  metadata: ServiceLocationMetadata;
}

export interface SitemapEntry {
  url: string;
  lastModified?: string;
  changeFreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export interface ServiceRegion {
  id: string;
  name: string;
  areas: string[];
}

export interface SiteConfig {
  name: string;
  url: string;
  sitemap: string;
  logo: string;
  phone: string;
  email: string;
  social: {
    instagram: string;
  };
  mainAddress: {
    street: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
  satelliteOffices: string[];
  serviceAreas: string[];
  mainServices: string[];
  clientTypes: string[];
  hours: {
    regular: string;
    emergency: string;
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Disaster Recovery QLD",
    "url": "https://disasterrecoveryqld.au",
    "logo": "https://disasterrecoveryqld.au/icon.svg",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Unit 1/22 Flinders Parade",
      "addressLocality": "North Lakes",
      "addressRegion": "QLD",
      "postalCode": "4509",
      "addressCountry": "AU"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+61-1300-309-361",
      "contactType": "customer service",
      "areaServed": "AU",
      "availableLanguage": "en"
    },
    "sameAs": [
      "https://www.instagram.com/disasterrecoveryqld"
    ]
  };
}

export function generateServiceAreaSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Disaster Recovery QLD Service Area",
    "provider": {
      "@type": "Organization",
      "name": "Disaster Recovery QLD"
    },
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": -27.2359,
        "longitude": 153.0116
      },
      "geoRadius": "100000"
    },
    "serviceType": "Emergency Water Damage Restoration"
  };
}

export function generateServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Water Damage Restoration",
    "provider": {
      "@type": "Organization",
      "name": "Disaster Recovery QLD"
    },
    "description": "Professional water damage restoration services across South East Queensland",
    "areaServed": "South East Queensland",
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": "https://disasterrecoveryqld.au",
      "servicePhone": "+61-1300-309-361",
      "availableLanguage": "en"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Water Damage Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Emergency Water Damage Response"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Flood Damage Restoration"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Storm Damage Recovery"
          }
        }
      ]
    }
  };
}
