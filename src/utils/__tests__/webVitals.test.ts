/**
 * @jest-environment jsdom
 */

import { reportWebVitals, getPerformanceScore, formatMetric } from '../webVitals';
import { trackPerformance } from '../analytics';
import type { CLSMetric, FCPMetric, LCPMetric } from 'web-vitals';

// Mock analytics tracking
jest.mock('../analytics', () => ({
  trackPerformance: jest.fn()
}));

describe('Web Vitals', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/test-page'
      },
      writable: true
    });
  });

  describe('reportWebVitals', () => {
    it('should track CLS metric', () => {
      const metric = {
        name: 'CLS',
        value: 0.1,
        delta: 0.1,
        id: 'cls-1',
        entries: [{
          hadRecentInput: false,
          value: 0.1,
          sources: [],
          startTime: 0,
          duration: 0,
          entryType: 'layout-shift',
          name: 'layout-shift',
          toJSON: () => ({})
        }],
        navigationType: 'navigate',
        rating: 'good'
      };

      reportWebVitals(metric as unknown as CLSMetric);

      expect(trackPerformance).toHaveBeenCalledWith({
        metrics: {
          ttfb: 0,
          fcp: 0,
          lcp: 0,
          fid: 0,
          cls: 0.1 // CLS as decimal
        },
        path: '/test-page'
      });
    });

    it('should track FCP metric', () => {
      const metric = {
        name: 'FCP',
        value: 1500,
        delta: 1500,
        id: 'fcp-1',
        entries: [{
          name: 'first-contentful-paint',
          entryType: 'paint',
          startTime: 1500,
          duration: 0,
          toJSON: () => ({})
        }],
        navigationType: 'navigate',
        rating: 'good'
      };

      reportWebVitals(metric as unknown as FCPMetric);

      expect(trackPerformance).toHaveBeenCalledWith({
        metrics: {
          ttfb: 0,
          fcp: 1500,
          lcp: 0,
          fid: 0,
          cls: 0
        },
        path: '/test-page'
      });
    });

    it('should track LCP metric', () => {
      const metric = {
        name: 'LCP',
        value: 2000,
        delta: 2000,
        id: 'lcp-1',
        entries: [{
          element: document.createElement('div'),
          entryType: 'largest-contentful-paint',
          id: '',
          loadTime: 2000,
          renderTime: 2000,
          size: 100,
          startTime: 2000,
          duration: 0,
          url: '',
          name: 'largest-contentful-paint',
          toJSON: () => ({})
        }],
        navigationType: 'navigate',
        rating: 'good'
      };

      reportWebVitals(metric as unknown as LCPMetric);

      expect(trackPerformance).toHaveBeenCalledWith({
        metrics: {
          ttfb: 0,
          fcp: 0,
          lcp: 2000,
          fid: 0,
          cls: 0
        },
        path: '/test-page'
      });
    });
  });

  describe('getPerformanceScore', () => {
    it('should calculate perfect score when all metrics are within thresholds', () => {
      const metrics = {
        cls: 0.05,  // Well within threshold of 0.1
        fcp: 1000,  // Well within threshold of 1800
        fid: 50,    // Well within threshold of 100
        lcp: 1500,  // Well within threshold of 2500
        ttfb: 300   // Well within threshold of 600
      };

      const score = getPerformanceScore(metrics);
      expect(score).toBe(100);
    });

    it('should calculate reduced score when metrics exceed thresholds', () => {
      const metrics = {
        cls: 0.2,   // Exceeds threshold of 0.1
        fcp: 2500,  // Exceeds threshold of 1800
        fid: 150,   // Exceeds threshold of 100
        lcp: 3500,  // Exceeds threshold of 2500
        ttfb: 800   // Exceeds threshold of 600
      };

      const score = getPerformanceScore(metrics);
      expect(score).toBeLessThan(100);
      expect(score).toBeGreaterThan(0);
    });

    it('should handle partial metrics', () => {
      const metrics = {
        cls: 0.05,  // Well within threshold
        fcp: 1000   // Well within threshold
      };

      const score = getPerformanceScore(metrics);
      expect(score).toBe(100);
    });

    it('should handle empty metrics', () => {
      const metrics = {};
      const score = getPerformanceScore(metrics);
      expect(score).toBe(100);
    });
  });

  describe('formatMetric', () => {
    it('should format CLS with 3 decimal places', () => {
      expect(formatMetric('CLS', 0.123456)).toBe('0.123');
    });

    it('should format timing metrics with ms suffix', () => {
      expect(formatMetric('FCP', 1234.5678)).toBe('1235ms');
      expect(formatMetric('FID', 1234.5678)).toBe('1235ms');
      expect(formatMetric('LCP', 1234.5678)).toBe('1235ms');
      expect(formatMetric('TTFB', 1234.5678)).toBe('1235ms');
    });

    it('should handle unknown metrics', () => {
      expect(formatMetric('UNKNOWN', 123)).toBe('123');
    });
  });
});
