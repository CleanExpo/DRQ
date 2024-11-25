import { ServicePage, Location, ServiceDetails, DisasterEvent } from '../types/serviceTypes';
import { getServiceArea, ServiceArea } from '../config/serviceAreas';
import { siteMetadata } from '../config/project.config';

// Schema Types
export type SchemaContext = "https://schema.org";
export type SchemaType = "EmergencyService" | "Service" | "Organization" | "LocalBusiness" | "Event";

// Define possible area served types
export type AreaServed = {
  "@type": "State" | "City";
  name: string;
  geo?: {
    "@type": "GeoCoordinates";
    latitude: number;
    longitude: number;
  };
  containsPlace?: {
    "@type": "City";
    name: string;
  };
} | {
  "@type": string;
  name: string;
}[];

export interface PostalAddress {
  "@type": "PostalAddress";
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
}

export interface BaseSchema {
  "@context": SchemaContext;
  "@type": SchemaType;
  name: string;
  url: string;
  telephone: string;
  description?: string;
  sameAs?: string[];
  areaServed?: AreaServed;
  geo?: {
    "@type": "GeoCoordinates";
    latitude: number;
    longitude: number;
  };
  openingHoursSpecification?: {
    "@type": "OpeningHoursSpecification";
    dayOfWeek: string[];
    opens: string;
    closes: string;
  };
  priceRange?: string;
  paymentAccepted?: string[];
  availableLanguage?: string[];
  address?: PostalAddress;
}

export interface ServiceSchema extends BaseSchema {
  availabilityStarts: string;
  availabilityEnds: string;
  areaServed: {
    "@type": "State" | "City";
    name: string;
    geo?: {
      "@type": "GeoCoordinates";
      latitude: number;
      longitude: number;
    };
    containsPlace?: {
      "@type": "City";
      name: string;
    };
  };
  serviceType: string;
  provider?: {
    "@type": "Organization";
    name: string;
    url: string;
  };
  hasOfferCatalog?: {
    "@type": "OfferCatalog";
    name: string;
    itemListElement: {
      "@type": "Offer";
      itemOffered: {
        "@type": "Service";
        name: string;
        description: string;
      };
    }[];
  };
  potentialAction?: {
    "@type": "Action";
    name: string;
    description: string;
  }[];
}

export interface DisasterEventSchema extends BaseSchema {
  startDate: string;
  location: {
    "@type": "Place";
    name: string;
    address: {
      "@type": "PostalAddress";
      addressRegion: string;
      addressLocality: string;
      addressCountry: "AU";
    };
    geo: {
      "@type": "GeoCoordinates";
      latitude: number;
      longitude: number;
    };
  };
  severity: number;
}

const BASE_URL = siteMetadata.baseUrl;
const COMPANY_NAME = siteMetadata.company.name;
const EMERGENCY_PHONE = siteMetadata.company.phone;

const baseBusinessInfo: Pick<BaseSchema, 'priceRange' | 'paymentAccepted' | 'availableLanguage' | 'address'> = {
  priceRange: siteMetadata.business.priceRange,
  paymentAccepted: Array.from(siteMetadata.business.paymentAccepted),
  availableLanguage: Array.from(siteMetadata.business.customerService.availableLanguage),
  address: {
    "@type": "PostalAddress" as const,
    streetAddress: siteMetadata.company.address.street,
    addressLocality: siteMetadata.company.address.suburb,
    addressRegion: siteMetadata.company.address.state,
    postalCode: siteMetadata.company.address.postcode,
    addressCountry: siteMetadata.company.address.country
  }
};

export const generateOrganizationSchema = (): BaseSchema => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": COMPANY_NAME,
  "url": BASE_URL,
  "telephone": EMERGENCY_PHONE,
  "description": siteMetadata.description,
  "sameAs": [
    siteMetadata.social.facebook,
    `https://twitter.com/${siteMetadata.social.twitter}`,
    siteMetadata.social.linkedin,
    siteMetadata.social.instagram
  ],
  ...baseBusinessInfo
});

const generateDisasterEventSchema = (event: DisasterEvent, location: Location): DisasterEventSchema => ({
  "@context": "https://schema.org",
  "@type": "Event",
  "name": `${event.type} in ${location.name}`,
  "description": event.description,
  "url": `${BASE_URL}/service-areas/${location.slug}/events/${event.type.toLowerCase()}`,
  "telephone": EMERGENCY_PHONE,
  "startDate": event.date,
  "location": {
    "@type": "Place",
    "name": location.name,
    "address": {
      "@type": "PostalAddress",
      "addressRegion": "QLD",
      "addressLocality": location.name,
      "addressCountry": "AU"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": location.coordinates.lat,
      "longitude": location.coordinates.lng
    }
  },
  "severity": event.severity
});

export const generateServiceSchema = (service: ServicePage, location: Location): ServiceSchema => {
  const serviceArea = getServiceArea(location.slug);
  const responseTime = serviceArea?.serviceAvailability.responseTime.emergency || '30-45 minutes';

  return {
    "@context": "https://schema.org",
    "@type": "EmergencyService",
    "name": COMPANY_NAME,
    "url": `${BASE_URL}/${service.slug}/${location.slug}`,
    "telephone": EMERGENCY_PHONE,
    "description": service.metaDescription,
    "availabilityStarts": "00:00",
    "availabilityEnds": "23:59",
    "areaServed": {
      "@type": "State",
      "name": "Queensland",
      "containsPlace": {
        "@type": "City",
        "name": location.name
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": location.coordinates.lat,
        "longitude": location.coordinates.lng
      }
    },
    "serviceType": service.title,
    "provider": {
      "@type": "Organization",
      "name": COMPANY_NAME,
      "url": BASE_URL
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": `${service.title} Services`,
      "itemListElement": service.serviceDetails.features.map(feature => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": feature,
          "description": `Professional ${feature} services in ${location.name} with ${responseTime} emergency response time`
        }
      }))
    },
    "potentialAction": [
      {
        "@type": "Action",
        "name": "Emergency Response",
        "description": `${responseTime} emergency response time available 24/7`
      },
      {
        "@type": "Action",
        "name": "Free Inspection",
        "description": "Book a free inspection and assessment"
      }
    ],
    ...baseBusinessInfo
  };
};

export const generateLocalBusinessSchema = (location: Location): BaseSchema => {
  const serviceArea = getServiceArea(location.slug);
  const responseTime = serviceArea?.serviceAvailability.responseTime.emergency || '30-45 minutes';
  const radius = serviceArea?.serviceRadius || 15;

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `${COMPANY_NAME} - ${location.name}`,
    "url": `${BASE_URL}/service-areas/${location.slug}`,
    "telephone": EMERGENCY_PHONE,
    "description": `Emergency disaster recovery services in ${location.name} and surrounding areas within ${radius}km. ${responseTime} response time available 24/7 for water damage, fire damage, and mould remediation.`,
    "areaServed": location.serviceArea.map(area => ({
      "@type": "City",
      "name": area
    })),
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": location.coordinates.lat,
      "longitude": location.coordinates.lng
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", "Thursday",
        "Friday", "Saturday", "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    },
    ...baseBusinessInfo
  };
};

export const generateServicePageSchema = (service: ServicePage): ServiceSchema => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": `${service.title} | ${COMPANY_NAME}`,
  "url": `${BASE_URL}/services/${service.slug}`,
  "telephone": EMERGENCY_PHONE,
  "description": service.metaDescription,
  "availabilityStarts": "00:00",
  "availabilityEnds": "23:59",
  "areaServed": {
    "@type": "State",
    "name": "Queensland"
  },
  "serviceType": service.title,
  "provider": {
    "@type": "Organization",
    "name": COMPANY_NAME,
    "url": BASE_URL
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": `${service.title} Services`,
    "itemListElement": service.serviceDetails.features.map(feature => ({
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": feature,
        "description": `Professional ${feature} services across Queensland`
      }
    }))
  },
  ...baseBusinessInfo
});

// Helper function to generate all schemas for a service page
export const generateAllSchemas = (service: ServicePage, location?: Location) => {
  const schemas: (BaseSchema | ServiceSchema | DisasterEventSchema)[] = [generateOrganizationSchema()];

  if (service && location) {
    schemas.push(generateServiceSchema(service, location));
    schemas.push(generateLocalBusinessSchema(location));
    
    // Add historical event schemas if available
    if (location.historicalEvents) {
      location.historicalEvents.forEach(event => {
        schemas.push(generateDisasterEventSchema(event, location));
      });
    }
  } else if (service) {
    schemas.push(generateServicePageSchema(service));
  }

  return schemas;
};
