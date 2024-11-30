import { Metadata } from 'next'
import { siteMetadata, serviceMetadata } from '../config/metadata'

type ServiceType = keyof typeof serviceMetadata

export function generateServiceMetadata(service: ServiceType): Metadata {
  const metadata = serviceMetadata[service]

  return {
    title: metadata.title,
    description: metadata.description,
    openGraph: {
      ...siteMetadata.openGraph,
      title: metadata.title,
      description: metadata.description,
      url: `${siteMetadata.siteUrl}/services/${service}`,
    },
    twitter: {
      ...siteMetadata.twitter,
      title: metadata.title,
      description: metadata.description,
    },
    alternates: {
      canonical: `${siteMetadata.siteUrl}/services/${service}`,
    },
  }
}

export function generatePageMetadata({
  title,
  description,
  path,
}: {
  title: string
  description: string
  path: string
}): Metadata {
  return {
    title,
    description,
    openGraph: {
      ...siteMetadata.openGraph,
      title,
      description,
      url: `${siteMetadata.siteUrl}${path}`,
    },
    twitter: {
      ...siteMetadata.twitter,
      title,
      description,
    },
    alternates: {
      canonical: `${siteMetadata.siteUrl}${path}`,
    },
  }
}

export function absoluteUrl(path: string): string {
  return `${siteMetadata.siteUrl}${path}`
}
