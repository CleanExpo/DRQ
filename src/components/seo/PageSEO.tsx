'use client';

import React from 'react';
import { Metadata } from 'next';
import { 
  generateServiceSchema, 
  generateOrganizationSchema,
  generateLocalBusinessSchema,
  generateServicePageSchema
} from '../../utils/schemaGenerator';
import { ServicePage, Location } from '../../types/serviceTypes';
import { siteMetadata } from '../../config/project.config';

interface PageSEOProps {
  title: string;
  description: string;
  canonical?: string;
  servicePage?: ServicePage;
  location?: Location;
  noindex?: boolean;
  alternateLanguages?: {
    [key: string]: string;
  };
  pageType?: 'service' | 'location' | 'home' | 'contact';
}

export const PageSEO: React.FC<PageSEOProps> = ({
  title,
  description,
  canonical,
  servicePage,
  location,
  noindex = false,
  alternateLanguages,
  pageType = 'home'
}) => {
  // Generate all applicable schemas based on page type and available data
  const generateSchemas = () => {
    const schemas = [generateOrganizationSchema()];

    if (servicePage && location) {
      schemas.push(generateServiceSchema(servicePage, location));
    } else if (servicePage) {
      schemas.push(generateServicePageSchema(servicePage));
    }

    if (location) {
      schemas.push(generateLocalBusinessSchema(location));
    }

    return schemas;
  };

  const schemas = generateSchemas();

  // Construct full title with site name
  const fullTitle = `${title} | ${siteMetadata.title}`;

  // Construct canonical URL
  const canonicalUrl = canonical 
    ? `${siteMetadata.baseUrl}${canonical}`
    : siteMetadata.baseUrl;

  // Construct geo data based on location or default to Brisbane HQ
  const geoData = location ? {
    'geo.region': 'AU-QLD',
    'geo.position': `${location.coordinates.lat};${location.coordinates.lng}`,
    'ICBM': `${location.coordinates.lat}, ${location.coordinates.lng}`,
    'geo.placename': location.name
  } : {
    'geo.region': 'AU-QLD',
    'geo.position': '-27.4698;153.0251',
    'ICBM': '-27.4698, 153.0251',
    'geo.placename': 'Queensland'
  };

  const metadata: Metadata = {
    title: fullTitle,
    description: description,
    robots: noindex ? 'noindex, nofollow' : 'index, follow',
    openGraph: {
      title: fullTitle,
      description: description,
      url: canonicalUrl,
      siteName: siteMetadata.title,
      type: pageType === 'home' ? 'website' : 'article',
      locale: 'en_AU',
      images: [
        {
          url: `${siteMetadata.baseUrl}/images/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: description,
      site: '@DisasterRecQLD',
      creator: '@DisasterRecQLD'
    },
    alternates: alternateLanguages ? {
      languages: Object.fromEntries(
        Object.entries(alternateLanguages).map(([lang, url]) => [
          lang,
          `${siteMetadata.baseUrl}${url}`
        ])
      )
    } : undefined,
    other: {
      ...geoData,
      'emergency.service': 'true',
      'emergency.available': '24/7',
      'emergency.response': 'immediate',
      'business.type': 'EmergencyService',
      'service.area': 'Queensland',
      'contact.phone': '1300 309 361',
      'contact.hours': '24/7',
      'rating.aggregate': '4.9',
      'rating.count': '150+'
    }
  };

  return (
    <>
      {schemas.map((schema, index) => (
        <script 
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
};

export default PageSEO;
