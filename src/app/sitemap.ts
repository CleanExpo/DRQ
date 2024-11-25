import { MetadataRoute } from 'next'
import { locationStructure } from '@/config/locations'
import { serviceStructure, commercialStructure } from '@/config/services'

const baseUrl = 'https://disasterrecoveryqld.au'

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date()
  
  // Main pages
  const mainPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8
    }
  ]

  // Service pages
  const servicePages = Object.entries(serviceStructure).map(([id, service]) => [
    // Main service page
    {
      url: `${baseUrl}/services/${id}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9
    },
    // Residential page
    {
      url: `${baseUrl}/services/${id}/residential`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8
    },
    // Commercial page
    {
      url: `${baseUrl}/services/${id}/commercial`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8
    }
  ]).flat()

  // Commercial industry pages
  const commercialPages = commercialStructure.industries.map(industry => ({
    url: `${baseUrl}/services/commercial/${industry.id}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8
  }))

  // Location pages
  const locationPages = Object.entries(locationStructure).map(([id, location]) => ({
    url: `${baseUrl}/locations/${id}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.9
  }))

  return [
    ...mainPages,
    ...servicePages,
    ...commercialPages,
    ...locationPages,
  ]
}
