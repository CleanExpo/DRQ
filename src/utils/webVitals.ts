import { Metric, ReportCallback } from 'web-vitals';
import { trackPerformance as analyticsTrackPerformance } from './analytics';

interface PerformanceMetrics {
  ttfb: number;
  fcp: number;
  lcp: number;
  fid: number;
  cls: number;
}

interface PerformanceReport {
  metrics: PerformanceMetrics;
  path: string;
}

export const reportWebVitals: ReportCallback = (metric: Metric): void => {
  const path = window.location.pathname;

  // Initialize empty metrics
  const metrics: PerformanceMetrics = {
    ttfb: 0,
    fcp: 0,
    lcp: 0,
    fid: 0,
    cls: 0
  };

  // Update the specific metric based on its name
  switch (metric.name) {
    case 'TTFB':
      metrics.ttfb = metric.value;
      break;
    case 'FCP':
      metrics.fcp = metric.value;
      break;
    case 'LCP':
      metrics.lcp = metric.value;
      break;
    case 'FID':
      metrics.fid = metric.value;
      break;
    case 'CLS':
      metrics.cls = metric.value;
      break;
  }

  // Track the performance metrics
  analyticsTrackPerformance({ metrics, path });
};

export const getPerformanceScore = (metrics: Partial<PerformanceMetrics>): number => {
  // Thresholds based on Core Web Vitals
  const thresholds = {
    good: {
      lcp: 2500,   // ms
      fid: 100,    // ms
      cls: 0.1,    // decimal
      ttfb: 600,   // ms
      fcp: 1800    // ms
    },
    poor: {
      lcp: 4000,   // ms
      fid: 300,    // ms
      cls: 0.25,   // decimal
      ttfb: 1000,  // ms
      fcp: 3000    // ms
    }
  };

  // Weights for each metric (total = 100)
  const weights = {
    lcp: 25,
    fid: 25,
    cls: 25,
    ttfb: 15,
    fcp: 10
  };

  let totalScore = 0;
  let totalWeight = 0;

  // Calculate score for each present metric
  if (metrics.lcp !== undefined) {
    totalWeight += weights.lcp;
    if (metrics.lcp <= thresholds.good.lcp) {
      totalScore += weights.lcp;
    } else if (metrics.lcp >= thresholds.poor.lcp) {
      totalScore += 0;
    } else {
      const ratio = (thresholds.poor.lcp - metrics.lcp) / (thresholds.poor.lcp - thresholds.good.lcp);
      totalScore += weights.lcp * ratio;
    }
  }

  if (metrics.fid !== undefined) {
    totalWeight += weights.fid;
    if (metrics.fid <= thresholds.good.fid) {
      totalScore += weights.fid;
    } else if (metrics.fid >= thresholds.poor.fid) {
      totalScore += 0;
    } else {
      const ratio = (thresholds.poor.fid - metrics.fid) / (thresholds.poor.fid - thresholds.good.fid);
      totalScore += weights.fid * ratio;
    }
  }

  if (metrics.cls !== undefined) {
    totalWeight += weights.cls;
    if (metrics.cls <= thresholds.good.cls) {
      totalScore += weights.cls;
    } else if (metrics.cls >= thresholds.poor.cls) {
      totalScore += 0;
    } else {
      const ratio = (thresholds.poor.cls - metrics.cls) / (thresholds.poor.cls - thresholds.good.cls);
      totalScore += weights.cls * ratio;
    }
  }

  if (metrics.ttfb !== undefined) {
    totalWeight += weights.ttfb;
    if (metrics.ttfb <= thresholds.good.ttfb) {
      totalScore += weights.ttfb;
    } else if (metrics.ttfb >= thresholds.poor.ttfb) {
      totalScore += 0;
    } else {
      const ratio = (thresholds.poor.ttfb - metrics.ttfb) / (thresholds.poor.ttfb - thresholds.good.ttfb);
      totalScore += weights.ttfb * ratio;
    }
  }

  if (metrics.fcp !== undefined) {
    totalWeight += weights.fcp;
    if (metrics.fcp <= thresholds.good.fcp) {
      totalScore += weights.fcp;
    } else if (metrics.fcp >= thresholds.poor.fcp) {
      totalScore += 0;
    } else {
      const ratio = (thresholds.poor.fcp - metrics.fcp) / (thresholds.poor.fcp - thresholds.good.fcp);
      totalScore += weights.fcp * ratio;
    }
  }

  // If no metrics are present, return perfect score
  if (totalWeight === 0) {
    return 100;
  }

  // Scale the score to 100
  return Math.round((totalScore / totalWeight) * 100);
};

export const formatMetric = (name: string, value: number): string => {
  if (name === 'CLS') {
    return value.toFixed(3);
  }
  
  // Round to nearest integer for timing metrics
  const roundedValue = Math.round(value);
  
  if (['FCP', 'LCP', 'FID', 'TTFB'].includes(name)) {
    return `${roundedValue}ms`;
  }
  
  return roundedValue.toString();
};
