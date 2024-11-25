'use client';

import React from 'react';
import { Metadata } from 'next';
import { generateAllSchemas } from '../../utils/schemaGenerator';
import { ServicePage, Location } from '../../types/serviceTypes';
import { siteMetadata } from '../../config/project.config';
import { Locale, getLanguageDirection } from '../../config/i18n.config';

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
  locale: Locale;
}

export const PageSEO: React.FC<PageSEOProps> = ({
  title,
  description,
  canonical,
  servicePage,
  location,
  noindex = false,
  alternateLanguages,
  pageType = 'home',
  locale
}) => {
  const isRTL = getLanguageDirection(locale) === 'rtl';

  // Generate all applicable schemas based on page type and available data
  const schemas = generateAllSchemas(servicePage!, location);

  // Add language annotations to schemas
  const localizedSchemas = schemas.map(schema => ({
    ...schema,
    inLanguage: locale,
    ...(alternateLanguages && {
      translation: Object.entries(alternateLanguages).map(([lang, url]) => ({
        '@type': 'WebPage',
        inLanguage: lang,
        url: `${siteMetadata.baseUrl}${url}`
      }))
    })
  }));

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

  // Convert locale to OpenGraph format (e.g., 'en-AU' -> 'en_AU')
  const ogLocale = locale.replace('-', '_');

  // Get alternate locales for OpenGraph
  const ogAlternateLocales = alternateLanguages ? 
    Object.keys(alternateLanguages).map(lang => lang.replace('-', '_')) : 
    [];

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
      locale: ogLocale,
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
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages ? {
        ...Object.fromEntries(
          Object.entries(alternateLanguages).map(([lang, url]) => [
            lang,
            `${siteMetadata.baseUrl}${url}`
          ])
        ),
        [locale]: canonicalUrl
      } : { [locale]: canonicalUrl }
    },
    other: {
      ...geoData,
      'emergency.service': 'true',
      'emergency.available': '24/7',
      'emergency.response': 'immediate',
      'business.type': 'EmergencyService',
      'service.area': 'Queensland',
      'contact.phone': siteMetadata.company.phone,
      'contact.hours': '24/7',
      'rating.aggregate': '4.9',
      'rating.count': '150+',
      'content-language': locale,
      'og:locale:alternate': ogAlternateLocales.length > 0 ? ogAlternateLocales.join(',') : locale,
      'dir': isRTL ? 'rtl' : 'ltr'
    }
  };

  return (
    <>
      {/* Language alternates */}
      <link rel="canonical" href={canonicalUrl} />
      {alternateLanguages && Object.entries(alternateLanguages).map(([lang, url]) => (
        <link 
          key={lang}
          rel="alternate"
          hrefLang={lang}
          href={`${siteMetadata.baseUrl}${url}`}
        />
      ))}
      <link 
        rel="alternate" 
        hrefLang={locale} 
        href={canonicalUrl}
      />
      <link 
        rel="alternate" 
        hrefLang="x-default" 
        href={`${siteMetadata.baseUrl}/en-AU${canonical || ''}`}
      />

      {/* Schema.org JSON-LD */}
      {localizedSchemas.map((schema, index) => (
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
