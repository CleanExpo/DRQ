interface TrackingEvent {
  event: string
  category: string
  action: string
  label?: string
  value?: number
  nonInteraction?: boolean
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    dataLayer?: any[]
  }
}

class Analytics {
  private static instance: Analytics
  private initialized: boolean = false

  private constructor() {}

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics()
    }
    return Analytics.instance
  }

  init() {
    if (this.initialized) return
    
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_GA_ID) {
      // Load Google Analytics
      const script = document.createElement('script')
      script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`
      script.async = true
      document.head.appendChild(script)

      // Initialize dataLayer
      window.dataLayer = window.dataLayer || []
      window.gtag = (...args: any[]) => {
        window.dataLayer?.push(args)
      }
      window.gtag('js', new Date())
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID)
    }
    
    this.initialized = true
  }

  trackPageView(path: string) {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_GA_ID) {
      window.gtag?.('config', process.env.NEXT_PUBLIC_GA_ID, {
        page_path: path
      })
    }
  }

  trackEvent({
    event,
    category,
    action,
    label,
    value,
    nonInteraction = false
  }: TrackingEvent) {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_GA_ID) {
      window.gtag?.('event', event, {
        event_category: category,
        event_action: action,
        event_label: label,
        value,
        non_interaction: nonInteraction
      })
    }
  }

  // Critical event tracking
  trackEmergencyContact(method: 'phone' | 'form', location?: string) {
    this.trackEvent({
      event: 'emergency_contact',
      category: 'Emergency',
      action: method,
      label: location || 'unknown'
    })
  }

  trackServiceArea(area: string, found: boolean) {
    this.trackEvent({
      event: 'service_area_check',
      category: 'Service Areas',
      action: found ? 'area_found' : 'area_not_found',
      label: area
    })
  }

  trackFormSubmission(formType: string, success: boolean) {
    this.trackEvent({
      event: 'form_submission',
      category: 'Forms',
      action: success ? 'success' : 'failure',
      label: formType
    })
  }

  trackErrorOccurrence(errorType: string, message: string) {
    this.trackEvent({
      event: 'error_occurrence',
      category: 'Errors',
      action: errorType,
      label: message,
      nonInteraction: true
    })
  }

  trackServiceInteraction(service: string, action: string) {
    this.trackEvent({
      event: 'service_interaction',
      category: 'Services',
      action: action,
      label: service
    })
  }

  // Track critical paths
  trackCriticalPath(path: string, successful: boolean) {
    this.trackEvent({
      event: 'critical_path',
      category: 'User Flow',
      action: successful ? 'completed' : 'abandoned',
      label: path
    })
  }

  // Track response times
  trackResponseTime(action: string, timeInMs: number) {
    this.trackEvent({
      event: 'response_time',
      category: 'Performance',
      action: action,
      value: timeInMs
    })
  }

  // Track user engagement
  trackEngagement(action: string, duration?: number) {
    this.trackEvent({
      event: 'user_engagement',
      category: 'Engagement',
      action: action,
      value: duration
    })
  }
}

export const analytics = Analytics.getInstance()

// Initialize analytics on the client side
if (typeof window !== 'undefined') {
  analytics.init()
}
