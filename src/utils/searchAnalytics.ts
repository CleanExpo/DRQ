interface SearchMetric {
  term: string;
  timestamp: number;
  resultCount: number;
  cached: boolean;
}

const metrics: SearchMetric[] = [];
const MAX_METRICS = 1000; // Limit stored metrics

export function trackSearch(term: string, resultCount: number, cached: boolean): void {
  metrics.unshift({
    term,
    timestamp: Date.now(),
    resultCount,
    cached
  });

  // Keep only recent metrics
  if (metrics.length > MAX_METRICS) {
    metrics.length = MAX_METRICS;
  }
}

export function getPopularSearches(limit: number = 10): { term: string; count: number }[] {
  const last24Hours = Date.now() - 24 * 60 * 60 * 1000;
  const recentSearches = metrics.filter(m => m.timestamp >= last24Hours);
  
  const termCounts = new Map<string, number>();
  recentSearches.forEach(metric => {
    const count = termCounts.get(metric.term) || 0;
    termCounts.set(metric.term, count + 1);
  });

  return Array.from(termCounts.entries())
    .map(([term, count]) => ({ term, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function getCacheHitRate(): number {
  if (metrics.length === 0) return 0;
  const cacheHits = metrics.filter(m => m.cached).length;
  return (cacheHits / metrics.length) * 100;
}
