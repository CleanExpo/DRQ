/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render } from '@testing-library/react';
import { PageSEO } from '../PageSEO';
import { ServicePage, Location } from '../../../types/serviceTypes';

// Mock schema generator functions
jest.mock('../../../utils/schemaGenerator', () => ({
  generateServiceSchema: jest.fn().mockReturnValue({
    "@context": "https://schema.org",
    "@type": "EmergencyService",
    "name": "Test Service",
    "serviceType": "Water Damage",
    "areaServed": {
      "@type": "State",
      "name": "Queensland"
    }
  }),
  generateOrganizationSchema: jest.fn().mockReturnValue({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Disaster Recovery QLD",
    "url": "https://disasterrecoveryqld.au"
  }),
  generateLocalBusinessSchema: jest.fn().mockReturnValue({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Disaster Recovery QLD - Brisbane",
    "areaServed": "Brisbane"
  }),
  generateServicePageSchema: jest.fn().mockReturnValue({
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Water Damage Services",
    "serviceType": "Water Damage Restoration"
  })
}));

// Mock project config
jest.mock('../../../config/project.config', () => ({
  siteMetadata: {
    title: 'Disaster Recovery QLD',
    baseUrl: 'https://disasterrecoveryqld.au'
  }
}));

describe('PageSEO', () => {
  const defaultProps = {
    title: 'Test Page',
    description: 'Test description',
    canonical: '/test',
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
      serviceArea: ['Brisbane CBD', 'South Brisbane']
    } as Location,
    alternateLanguages: {
      'en-AU': '/test',
      'zh': '/zh/test'
    },
    pageType: 'service' as const
  };

  it('should render multiple schema scripts for service pages', () => {
    const { container } = render(<PageSEO {...defaultProps} />);
    
    const schemas = container.querySelectorAll('script[type="application/ld+json"]');
    expect(schemas).toHaveLength(3); // Organization + Service + LocalBusiness

    const schemaContents = Array.from(schemas).map(script => 
      JSON.parse(script.innerHTML)
    );

    expect(schemaContents).toEqual(expect.arrayContaining([
      expect.objectContaining({ "@type": "Organization" }),
      expect.objectContaining({ "@type": "EmergencyService" }),
      expect.objectContaining({ "@type": "LocalBusiness" })
    ]));
  });

  it('should handle location-only pages', () => {
    const locationProps = {
      ...defaultProps,
      servicePage: undefined,
      pageType: 'location' as const
    };

    const { container } = render(<PageSEO {...locationProps} />);
    
    const schemas = container.querySelectorAll('script[type="application/ld+json"]');
    expect(schemas).toHaveLength(2); // Organization + LocalBusiness

    const schemaContents = Array.from(schemas).map(script => 
      JSON.parse(script.innerHTML)
    );

    expect(schemaContents).toEqual(expect.arrayContaining([
      expect.objectContaining({ "@type": "Organization" }),
      expect.objectContaining({ "@type": "LocalBusiness" })
    ]));
  });

  it('should handle service-only pages', () => {
    const serviceProps = {
      ...defaultProps,
      location: undefined,
      pageType: 'service' as const
    };

    const { container } = render(<PageSEO {...serviceProps} />);
    
    const schemas = container.querySelectorAll('script[type="application/ld+json"]');
    expect(schemas).toHaveLength(2); // Organization + Service

    const schemaContents = Array.from(schemas).map(script => 
      JSON.parse(script.innerHTML)
    );

    expect(schemaContents).toEqual(expect.arrayContaining([
      expect.objectContaining({ "@type": "Organization" }),
      expect.objectContaining({ "@type": "Service" })
    ]));
  });

  it('should handle home page with minimal props', () => {
    const minimalProps = {
      title: 'Home',
      description: 'Welcome to Disaster Recovery QLD',
      pageType: 'home' as const
    };

    const { container } = render(<PageSEO {...minimalProps} />);
    
    const schemas = container.querySelectorAll('script[type="application/ld+json"]');
    expect(schemas).toHaveLength(1); // Organization only

    const schemaContent = JSON.parse(schemas[0].innerHTML);
    expect(schemaContent).toEqual(expect.objectContaining({
      "@type": "Organization",
      "name": "Disaster Recovery QLD"
    }));
  });

  it('should include geo data when location is provided', () => {
    const { container } = render(<PageSEO {...defaultProps} />);
    
    const schemas = container.querySelectorAll('script[type="application/ld+json"]');
    const serviceSchema = Array.from(schemas)
      .map(script => JSON.parse(script.innerHTML))
      .find(schema => schema["@type"] === "EmergencyService");

    expect(serviceSchema?.areaServed).toEqual(expect.objectContaining({
      "@type": "State",
      "name": "Queensland"
    }));
  });

  it('should handle noindex pages correctly', () => {
    const noindexProps = {
      ...defaultProps,
      noindex: true
    };

    const { container } = render(<PageSEO {...noindexProps} />);
    
    // Still includes schema despite noindex
    const schemas = container.querySelectorAll('script[type="application/ld+json"]');
    expect(schemas.length).toBeGreaterThan(0);
  });
});
