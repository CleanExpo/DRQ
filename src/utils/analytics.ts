type TrackingCategory = 'form' | 'navigation' | 'error' | 'interaction';
type TrackingAction = 'error-boundary-triggered' | 'error-page-call' | string;

interface PerformanceReport {
  metrics: {
    ttfb: number;
    fcp: number;
    lcp: number;
    fid: number;
    cls: number;
  };
  path: string;
}

export const trackEmergencyContact = (category: TrackingCategory, action: TrackingAction): void => {
  if (process.env.NODE_ENV === 'production') {
    // TODO: Implement actual analytics tracking
    console.log('Analytics event:', { category, action });
  } else {
    console.log('Development analytics event:', { category, action });
  }
};

export const trackPerformance = (report: PerformanceReport): void => {
  if (process.env.NODE_ENV === 'production') {
    // TODO: Implement actual analytics tracking
    console.log('Performance metrics:', report);
  } else {
    console.log('Development performance metrics:', report);
  }
};
