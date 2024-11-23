import { ServicePage, Location, ServiceDetails } from '../types/serviceTypes';

// Schema Types
type SchemaContext = "https://schema.org";
type SchemaType = "EmergencyService" | "Service" | "Organization" | "LocalBusiness";

interface BaseSchema {
  "@context": SchemaContext;
  "@type": SchemaType;
  name: string;
  url: string;
  telephone: string;
  description?: string;
}

interface ServiceSchema extends BaseSchema {
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
}

const BASE_URL = "https://disasterrecoveryqld.au";
const COMPANY_NAME = "Disaster Recovery QLD";
const EMERGENCY_PHONE = "1300 309 361";

export const generateOrganizationSchema = (): BaseSchema => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": COMPANY_NAME,
  "url": BASE_URL,
  "telephone": EMERGENCY_PHONE,
  "description": "24/7 Emergency disaster recovery services across Queensland. Specializing in water damage restoration, fire damage repair, and mould remediation."
});

export const generateServiceSchema = (service: ServicePage, location: Location): ServiceSchema => ({
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
  }
});

export const generateLocalBusinessSchema = (location: Location): BaseSchema => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": `${COMPANY_NAME} - ${location.name}`,
  "url": `${BASE_URL}/service-areas/${location.slug}`,
  "telephone": EMERGENCY_PHONE,
  "description": `Emergency disaster recovery services in ${location.name} and surrounding areas. Available 24/7 for water damage, fire damage, and mould remediation.`
});

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
  }
});
