import { Metadata } from 'next'
import { siteConfig } from '@/config/site'

interface CreateMetadataProps {
  title: string
  description: string
  path: string
  locale: string
}

export function createMetadata({
  title,
  description,
  path,
  locale
}: CreateMetadataProps): Metadata {
  const url = `https://disasterrecoveryqld.au${path}`

  return {
    title: {
      default: title,
      template: `%s | ${siteConfig.name}`
    },
    description,
    keywords: [
      'disaster recovery',
      'water damage',
      'fire damage',
      'mould remediation',
      'emergency services',
      'Brisbane',
      'Gold Coast'
    ],
    authors: [
      {
        name: siteConfig.name,
        url: 'https://disasterrecoveryqld.au',
      },
    ],
    openGraph: {
      type: 'website',
      locale,
      url,
      title,
      description,
      siteName: siteConfig.name,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: url,
      languages: {
        'en-AU': `https://disasterrecoveryqld.au/en-AU${path}`,
      },
    },
  }
}
