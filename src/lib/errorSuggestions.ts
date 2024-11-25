import { locationStructure } from '@/config/locations'
import { serviceStructure } from '@/config/services'
import { siteNavigation } from '@/config/navigation'

interface ErrorSuggestion {
  path: string
  title: string
  relevance: number
  type: 'service' | 'location' | 'page'
}

export class ErrorSuggestionEngine {
  private static calculateLevenshteinDistance(a: string, b: string): number {
    if (a.length === 0) return b.length
    if (b.length === 0) return a.length

    const matrix = Array(b.length + 1).fill(null).map(() => 
      Array(a.length + 1).fill(null)
    )

    for (let i = 0; i <= a.length; i++) matrix[0][i] = i
    for (let j = 0; j <= b.length; j++) matrix[j][0] = j

    for (let j = 1; j <= b.length; j++) {
      for (let i = 1; i <= a.length; i++) {
        const substitute = matrix[j - 1][i - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
        matrix[j][i] = Math.min(
          matrix[j - 1][i] + 1,
          matrix[j][i - 1] + 1,
          substitute
        )
      }
    }

    return matrix[b.length][a.length]
  }

  static findSimilarRoutes(currentPath: string): ErrorSuggestion[] {
    const segments = currentPath.split('/').filter(Boolean)
    const lastSegment = segments[segments.length - 1]
    const suggestions: ErrorSuggestion[] = []

    // Check services
    Object.entries(serviceStructure).forEach(([id, service]) => {
      const distance = this.calculateLevenshteinDistance(lastSegment, id)
      if (distance <= 3) {
        suggestions.push({
          path: `/services/${id}`,
          title: service.title,
          relevance: 1 - (distance / Math.max(lastSegment.length, id.length)),
          type: 'service'
        })
      }
    })

    // Check locations
    Object.entries(locationStructure).forEach(([id, location]) => {
      const distance = this.calculateLevenshteinDistance(lastSegment, id)
      if (distance <= 3) {
        suggestions.push({
          path: `/locations/${id}`,
          title: location.name,
          relevance: 1 - (distance / Math.max(lastSegment.length, id.length)),
          type: 'location'
        })
      }
    })

    // Check main navigation items
    siteNavigation.mainNav.forEach(item => {
      if ('href' in item) {
        const pathSegment = item.href.split('/').pop() || ''
        const distance = this.calculateLevenshteinDistance(lastSegment, pathSegment)
        if (distance <= 3) {
          suggestions.push({
            path: item.href,
            title: item.title,
            relevance: 1 - (distance / Math.max(lastSegment.length, pathSegment.length)),
            type: 'page'
          })
        }
      }
    })

    // Sort by relevance and return top 5
    return suggestions
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 5)
  }

  static getErrorMessage(path: string): string {
    const segments = path.split('/').filter(Boolean)
    
    if (segments[0] === 'services') {
      return "We couldn't find the service you're looking for. Check out our available services below."
    }
    
    if (segments[0] === 'locations') {
      return "We couldn't find the location you're looking for. View our service areas below."
    }

    if (segments[0] === 'inspection') {
      return "The inspection page you're looking for is not available. Please start a new inspection request."
    }
    
    return "The page you're looking for couldn't be found. Here are some suggestions that might help."
  }

  static getSectionSuggestions(path: string): string[] {
    const segments = path.split('/').filter(Boolean)
    
    if (segments[0] === 'services') {
      return Object.keys(serviceStructure).map(id => `/services/${id}`)
    }
    
    if (segments[0] === 'locations') {
      return Object.keys(locationStructure).map(id => `/locations/${id}`)
    }
    
    return []
  }
}
