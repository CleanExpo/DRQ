/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render } from '@testing-library/react';
import { PageSEO } from '../PageSEO';
import { ServicePage, Location, DisasterEvent } from '../../../types/serviceTypes';
import { BaseSchema, SchemaContext, SchemaType } from '../../../utils/schemaGenerator';

// Define mock schema types
interface MockSchema extends BaseSchema {
  "@context": SchemaContext;
  "@type": SchemaType;
  serviceType?: string;
  hasOfferCatalog?: {
    "@type": string;
    name: string;
    itemListElement: Array<{
      "@type": string;
      itemOffered: {
        "@type": string;
        name: string;
        description: string;
      };
    }>;
  };
  startDate?: string;
  severity?: number;
  translation?: Array<{
    "@type": string;
    inLanguage: string;
    url: string;
  }>;
  inLanguage?: string;
}

// Mock schema generator functions
jest.mock('../../../utils/schemaGenerator', () => ({
  generateAllSchemas: jest.fn().mockImplementation((service?: ServicePage, location?: Location): MockSchema[] => {
    const baseSchema: MockSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Disaster Recovery QLD",
      "url": "https://disasterrecoveryqld.au",
      "telephone": "1300 309 361",
      "sameAs": [
        "https://facebook.com/DisasterRecoveryQLD",
        "https://twitter.com/DisasterRecQLD",
        "https://linkedin.com/company/disaster-recovery-qld"
      ]
    };

    const schemas: MockSchema[] = [baseSchema];

    if (service && location) {
      const serviceSchema: MockSchema = {
        "@context": "https://schema.org",
        "@type": "EmergencyService",
        "name": "Disaster Recovery QLD",
        "url": "https://disasterrecoveryqld.au",
        "telephone": "1300 309 361",
        "serviceType": service.title,
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": `${service.title} Services`,
          "itemListElement": service.serviceDetails.features.map((feature: string) => ({
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": feature,
              "description": `Professional ${feature} services in ${location.name}`
            }
          }))
        }
      };

      const localBusinessSchema: MockSchema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": `Disaster Recovery QLD - ${location.name}`,
        "url": "https://disasterrecoveryqld.au",
        "telephone": "1300 309 361",
        "areaServed": location.serviceArea.map((area: string) => ({
          "@type": "City",
          "name": area
        }))
      };

      schemas.push(serviceSchema, localBusinessSchema);

      if (location.historicalEvents) {
        location.historicalEvents.forEach((event: DisasterEvent) => {
          const eventSchema: MockSchema = {
            "@context": "https://schema.org",
            "@type": "Event",
            "name": `${event.type} in ${location.name}`,
            "url": `https://disasterrecoveryqld.au/events/${event.type}`,
            "telephone": "1300 309 361",
            "startDate": event.date,
            "description": event.description,
            "severity": event.severity
          };
          schemas.push(eventSchema);
        });
      }
    } else if (service) {
      const servicePageSchema: MockSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": `${service.title} | Disaster Recovery QLD`,
        "url": "https://disasterrecoveryqld.au",
        "telephone": "1300 309 361",
        "serviceType": service.title
      };
      schemas.push(servicePageSchema);
    }

    return schemas;
  })
}));

// Mock project config
jest.mock('../../../config/project.config', () => ({
  siteMetadata: {
    title: 'Disaster Recovery QLD',
    baseUrl: 'https://disasterrecoveryqld.au',
    social: {
      facebook: 'https://facebook.com/DisasterRecoveryQLD',
      twitter: '@DisasterRecQLD',
      linkedin: 'https://linkedin.com/company/disaster-recovery-qld'
    }
  }
}));

describe('PageSEO', () => {
  const mockHistoricalEvent: DisasterEvent = {
    date: '2022-02-28',
    type: 'Flood',
    description: 'Major flooding event',
    severity: 5
  };

  const defaultProps = {
    title: 'Test Page',
    description: 'Test description',
    canonical: '/test',
    locale: 'en-AU' as const,
    servicePage: {
      slug: 'water-damage',
      title: 'Water Damage Restoration',
      metaDescription: 'Professional water damage restoration services',
      heroContent: {
        title: 'Water Damage',
        subtitle: 'Fast Response',
        backgroundImage: '/images/water-damage.jpg'
      },
      serviceDetails: {
        description: 'Professional water damage restoration',
        features: ['24/7 Response', 'Expert Team'],
        emergencyResponse: true
      },
      locations: []
    } as ServicePage,
    location: {
      name: 'Brisbane',
      slug: 'brisbane',
      coordinates: {
        lat: -27.4698,
        lng: 153.0251
      },
      serviceArea: ['Brisbane CBD', 'South Brisbane'],
      historicalEvents: [mockHistoricalEvent]
    } as Location,
    alternateLanguages: {
      'en-AU': '/test',
      'zh': '/zh/test'
    },
    pageType: 'service' as const
  };

  it('should render all schema types for a full service page with location', () => {
    const { container } = render(<PageSEO {...defaultProps} />);
    
    const schemas = container.querySelectorAll('script[type="application/ld+json"]');
    expect(schemas).toHaveLength(4); // Organization + Service + LocalBusiness + Event

    const schemaContents = Array.from(schemas).map(script => 
      JSON.parse(script.innerHTML)
    );

    expect(schemaContents).toEqual(expect.arrayContaining([
      expect.objectContaining({ "@type": "Organization" }),
      expect.objectContaining({ "@type": "EmergencyService" }),
      expect.objectContaining({ "@type": "LocalBusiness" }),
      expect.objectContaining({ "@type": "Event" })
    ]));
  });

  it('should include service features in the schema', () => {
    const { container } = render(<PageSEO {...defaultProps} />);
    
    const schemas = container.querySelectorAll('script[type="application/ld+json"]');
    const serviceSchema = Array.from(schemas)
      .map(script => JSON.parse(script.innerHTML))
      .find(schema => schema["@type"] === "EmergencyService") as MockSchema;

    expect(serviceSchema?.hasOfferCatalog?.itemListElement).toHaveLength(
      defaultProps.servicePage.serviceDetails.features.length
    );
  });

  it('should include historical events in the schema', () => {
    const { container } = render(<PageSEO {...defaultProps} />);
    
    const schemas = container.querySelectorAll('script[type="application/ld+json"]');
    const eventSchema = Array.from(schemas)
      .map(script => JSON.parse(script.innerHTML))
      .find(schema => schema["@type"] === "Event") as MockSchema;

    expect(eventSchema).toEqual(expect.objectContaining({
      "@type": "Event",
      "name": expect.stringContaining("Flood"),
      "startDate": mockHistoricalEvent.date,
      "severity": mockHistoricalEvent.severity
    }));
  });

  it('should handle RTL languages correctly', () => {
    const rtlProps = {
      ...defaultProps,
      locale: 'ar' as const
    };

    const { container } = render(<PageSEO {...rtlProps} />);
    
    const schemas = container.querySelectorAll('script[type="application/ld+json"]');
    const schemaContents = Array.from(schemas).map(script => 
      JSON.parse(script.innerHTML)
    );

    schemaContents.forEach(schema => {
      expect(schema.inLanguage).toBe('ar');
    });
  });

  it('should include service area information in LocalBusiness schema', () => {
    const { container } = render(<PageSEO {...defaultProps} />);
    
    const schemas = container.querySelectorAll('script[type="application/ld+json"]');
    const localBusinessSchema = Array.from(schemas)
      .map(script => JSON.parse(script.innerHTML))
      .find(schema => schema["@type"] === "LocalBusiness") as MockSchema;

    expect(localBusinessSchema?.areaServed).toEqual(
      expect.arrayContaining(
        defaultProps.location.serviceArea.map(area => ({
          "@type": "City",
          "name": area
        }))
      )
    );
  });

  it('should handle home page with minimal props', () => {
    const minimalProps = {
      title: 'Home',
      description: 'Welcome to Disaster Recovery QLD',
      pageType: 'home' as const,
      locale: 'en-AU' as const
    };

    const { container } = render(<PageSEO {...minimalProps} />);
    
    const schemas = container.querySelectorAll('script[type="application/ld+json"]');
    expect(schemas).toHaveLength(1); // Organization only

    const schemaContent = JSON.parse(schemas[0].innerHTML);
    expect(schemaContent).toEqual(expect.objectContaining({
      "@type": "Organization",
      "name": "Disaster Recovery QLD",
      "sameAs": expect.arrayContaining([
        expect.stringContaining("facebook.com"),
        expect.stringContaining("twitter.com"),
        expect.stringContaining("linkedin.com")
      ])
    }));
  });

  it('should include language translations in schemas', () => {
    const { container } = render(<PageSEO {...defaultProps} />);
    
    const schemas = container.querySelectorAll('script[type="application/ld+json"]');
    const schemaContents = Array.from(schemas).map(script => 
      JSON.parse(script.innerHTML)
    );

    schemaContents.forEach(schema => {
      expect(schema.inLanguage).toBe('en-AU');
      expect(schema.translation).toEqual(expect.arrayContaining([
        expect.objectContaining({
          "@type": "WebPage",
          "inLanguage": "zh"
        })
      ]));
    });
  });
});
