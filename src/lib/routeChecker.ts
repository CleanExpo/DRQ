import { locationStructure } from '@/config/locations'
import { serviceStructure, commercialStructure } from '@/config/services'

type RouteSegment = {
  segment: string
  isValid: boolean
  params?: Record<string, string>
}

export class RouteChecker {
  static validateRoute(pathname: string): RouteSegment[] {
    const segments = pathname.split('/').filter(Boolean)
    const validatedSegments: RouteSegment[] = []

    let currentPath = ''
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i]
      currentPath += `/${segment}`
      
      let isValid = false
      let params: Record<string, string> = {}

      switch (segment) {
        case 'services':
          isValid = true
          break
        case 'locations':
          isValid = true
          break
        case 'about':
        case 'contact':
        case 'inspection':
        case 'emergency':
          isValid = true
          break
        default:
          // Check if it's a valid service
          if (segments[i-1] === 'services') {
            isValid = segment in serviceStructure || 
                     (segment === 'commercial') ||
                     commercialStructure.industries.some(ind => ind.id === segment)
          }
          // Check if it's a valid location
          else if (segments[i-1] === 'locations') {
            isValid = segment in locationStructure
          }
          // Check for valid sub-routes
          else if (['residential', 'commercial'].includes(segment)) {
            isValid = true
          }
          // Check for locale
          else if (i === 0) {
            // Add your supported locales here
            isValid = ['en-AU', 'en', 'es', 'zh'].includes(segment)
          }
      }

      validatedSegments.push({
        segment,
        isValid,
        params: Object.keys(params).length ? params : undefined
      })
    }

    return validatedSegments
  }

  static isValidRoute(pathname: string): boolean {
    const segments = this.validateRoute(pathname)
    return segments.every(segment => segment.isValid)
  }

  static getSuggestions(pathname: string): string[] {
    const segments = pathname.split('/').filter(Boolean)
    const lastSegment = segments[segments.length - 1]
    const parentSegment = segments[segments.length - 2]

    let suggestions: string[] = []

    // If we're in the services section
    if (parentSegment === 'services') {
      suggestions = [
        ...Object.keys(serviceStructure),
        'commercial',
        ...commercialStructure.industries.map(ind => ind.id)
      ].filter(s => s.toLowerCase().includes(lastSegment.toLowerCase()))
    }
    // If we're in the locations section
    else if (parentSegment === 'locations') {
      suggestions = Object.keys(locationStructure)
        .filter(s => s.toLowerCase().includes(lastSegment.toLowerCase()))
    }
    // Root level suggestions
    else {
      suggestions = [
        'services',
        'locations',
        'about',
        'contact',
        'inspection',
        'emergency'
      ].filter(s => s.toLowerCase().includes(lastSegment.toLowerCase()))
    }

    return suggestions
  }
}
