import { SERVICES } from '../constants/services'
import { SERVICE_AREAS } from '../constants/areas'

interface RouteCheck {
  path: string
  type: 'page' | 'api'
  status: 'ok' | 'error'
  error?: string
}

export const REQUIRED_ROUTES = {
  pages: [
    '/',
    '/en-AU',
    '/en-AU/contact',
    '/en-AU/emergency',
    ...SERVICES.map(service => service.href),
  ],
  api: [
    '/api/services',
    '/api/areas',
    '/api/emergency',
    '/api/areas/check',
  ]
}

export async function checkRoutes(): Promise<RouteCheck[]> {
  const results: RouteCheck[] = []

  // Check page routes
  for (const path of REQUIRED_ROUTES.pages) {
    try {
      const response = await fetch(path)
      results.push({
        path,
        type: 'page',
        status: response.ok ? 'ok' : 'error',
        error: response.ok ? undefined : `HTTP ${response.status}`
      })
    } catch (error) {
      results.push({
        path,
        type: 'page',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // Check API routes
  for (const path of REQUIRED_ROUTES.api) {
    try {
      const response = await fetch(path)
      results.push({
        path,
        type: 'api',
        status: response.ok ? 'ok' : 'error',
        error: response.ok ? undefined : `HTTP ${response.status}`
      })
    } catch (error) {
      results.push({
        path,
        type: 'api',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  return results
}

export function validateServiceLinks(): string[] {
  const errors: string[] = []

  // Check if all service pages exist
  const servicePages = SERVICES.map(service => service.href)
  const uniqueServicePages = new Set(servicePages)
  if (uniqueServicePages.size !== servicePages.length) {
    errors.push('Duplicate service page routes found')
  }

  // Check if all services have valid slugs
  SERVICES.forEach(service => {
    const slug = service.href.split('/').pop()
    if (!slug || slug.includes('.') || slug.includes(' ')) {
      errors.push(`Invalid service slug: ${service.href}`)
    }
  })

  // Check if all areas are unique
  const uniqueAreas = new Set(SERVICE_AREAS)
  if (uniqueAreas.size !== SERVICE_AREAS.length) {
    errors.push('Duplicate service areas found')
  }

  return errors
}

export async function validateApiEndpoints(): Promise<string[]> {
  const errors: string[] = []

  try {
    // Check services API
    const servicesResponse = await fetch('/api/services')
    if (!servicesResponse.ok) {
      errors.push(`Services API error: HTTP ${servicesResponse.status}`)
    }

    // Check areas API
    const areasResponse = await fetch('/api/areas')
    if (!areasResponse.ok) {
      errors.push(`Areas API error: HTTP ${areasResponse.status}`)
    }

    // Check emergency API health
    const emergencyResponse = await fetch('/api/emergency')
    if (!emergencyResponse.ok) {
      errors.push(`Emergency API error: HTTP ${emergencyResponse.status}`)
    }
  } catch (error) {
    errors.push(`API validation error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }

  return errors
}
