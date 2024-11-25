interface TrackingConfig {
  enabled: boolean;
  gaId: string;
  gtmId?: string;
}

interface TrackingEvent {
  category: string;
  action: string;
  label: string;
  value?: number | null;
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

class EnhancedTracking {
  private config: TrackingConfig;
  private initialized: boolean = false;
  private sessionStartTime: number;

  constructor(config: TrackingConfig) {
    this.config = config;
    this.sessionStartTime = Date.now();
  }

  init() {
    if (!this.config.enabled || this.initialized) return;

    if (typeof window !== 'undefined') {
      // Load Google Analytics
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.gaId}`;
      script.async = true;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      window.gtag = (...args: any[]) => {
        window.dataLayer?.push(args);
      };
      window.gtag('js', new Date());
      window.gtag('config', this.config.gaId);

      // Track session start
      this.trackEvent({
        category: 'Session',
        action: 'Start',
        label: window.location.pathname
      });

      // Track session duration on page unload
      window.addEventListener('beforeunload', () => {
        const duration = Math.round((Date.now() - this.sessionStartTime) / 1000);
        this.trackEvent({
          category: 'Session',
          action: 'End',
          label: window.location.pathname,
          value: duration
        });
      });
    }
    
    this.initialized = true;
  }

  // Location and Service Area Tracking
  trackServiceArea(area: string, available: boolean) {
    this.trackEvent({
      category: 'Service Area',
      action: available ? 'Area Available' : 'Area Not Available',
      label: area
    });
  }

  trackResponseTime(area: string, time: string) {
    this.trackEvent({
      category: 'Response Time',
      action: 'Time Displayed',
      label: `${area}: ${time}`
    });
  }

  // Emergency Contact Tracking
  trackEmergencyContact(method: 'phone' | 'form', location: string) {
    this.trackEvent({
      category: 'Emergency Contact',
      action: method === 'phone' ? 'Phone Call' : 'Form Submission',
      label: location
    });
  }

  // Form Tracking
  trackFormStart(formType: string) {
    this.trackEvent({
      category: 'Form',
      action: 'Start',
      label: formType
    });
  }

  trackFormCompletion(formType: string, timeToComplete: number) {
    this.trackEvent({
      category: 'Form',
      action: 'Complete',
      label: formType,
      value: timeToComplete
    });
  }

  trackFormError(formType: string, field: string) {
    this.trackEvent({
      category: 'Form',
      action: 'Error',
      label: `${formType}: ${field}`
    });
  }

  // Error Tracking
  trackErrorOccurrence(errorType: string, message: string) {
    this.trackEvent({
      category: 'Error',
      action: errorType,
      label: message,
      value: Date.now()
    });

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`[${errorType}]`, message);
    }
  }

  // Performance Tracking
  trackPageLoad(duration: number) {
    this.trackEvent({
      category: 'Performance',
      action: 'Page Load',
      label: window.location.pathname,
      value: duration
    });
  }

  trackApiCall(endpoint: string, duration: number, success: boolean) {
    this.trackEvent({
      category: 'API',
      action: success ? 'Success' : 'Error',
      label: endpoint,
      value: duration
    });
  }

  // User Interaction Tracking
  trackInteraction(type: string, detail: string) {
    this.trackEvent({
      category: 'Interaction',
      action: type,
      label: detail
    });
  }

  private trackEvent(event: TrackingEvent) {
    if (!this.initialized || !this.config.enabled) return;

    // Google Analytics
    window.gtag?.('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value
    });

    // Console log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Track:', event);
    }
  }
}

export const tracking = new EnhancedTracking({
  enabled: process.env.NODE_ENV === 'production',
  gaId: process.env.NEXT_PUBLIC_GA_ID!
});
