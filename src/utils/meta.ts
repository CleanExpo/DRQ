import { Metadata } from 'next';
import { CONTACT } from '../constants/contact';

interface MetaOptions {
  title: string;
  description: string;
  path?: string;
  imageUrl?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  keywords?: string[];
}

/**
 * Generates consistent metadata including Open Graph and Twitter card meta tags
 */
export function generateMeta({
  title,
  description,
  path = '',
  imageUrl = '/images/og-default.jpg',
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  keywords = []
}: MetaOptions): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITEMAP_URL;
  const url = `${baseUrl}${path}`;
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || CONTACT.BUSINESS_NAME;

  // Default keywords for all pages
  const defaultKeywords = [
    'disaster recovery',
    'emergency services',
    'property restoration',
    'water damage',
    'flood recovery',
    'Brisbane',
    'Queensland'
  ];

  return {
    title: {
      default: title,
      template: `%s | ${siteName}`
    },
    description,
    keywords: [...defaultKeywords, ...keywords],
    authors: author ? [{ name: author }] : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName,
      images: [
        {
          url: `${baseUrl}${imageUrl}`,
          width: 1200,
          height: 630,
          alt: title
        }
      ],
      locale: 'en-AU',
      type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime })
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}${imageUrl}`],
      site: '@DisasterRecQLD',
      creator: '@DisasterRecQLD'
    },
    alternates: {
      canonical: url
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    },
    other: {
      'facebook-domain-verification': process.env.NEXT_PUBLIC_FACEBOOK_DOMAIN_VERIFICATION
    }
  };
}

/**
 * Generates service page specific metadata
 */
export function generateServiceMeta({
  title,
  description,
  path,
  imageUrl,
  keywords = []
}: Omit<MetaOptions, 'type'>): Metadata {
  return generateMeta({
    title,
    description,
    path,
    imageUrl,
    type: 'website',
    keywords: [
      'restoration services',
      'emergency response',
      'professional service',
      'South East Queensland',
      ...keywords
    ]
  });
}

/**
 * Generates blog post specific metadata
 */
export function generateBlogMeta({
  title,
  description,
  path,
  imageUrl,
  publishedTime,
  modifiedTime,
  author,
  keywords = []
}: Omit<MetaOptions, 'type'>): Metadata {
  return generateMeta({
    title,
    description,
    path,
    imageUrl,
    type: 'article',
    publishedTime,
    modifiedTime,
    author,
    keywords: [
      'disaster recovery tips',
      'property maintenance',
      'emergency preparedness',
      ...keywords
    ]
  });
}
