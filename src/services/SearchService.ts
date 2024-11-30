import { logger } from '@/utils/logger';
import { cacheService } from './CacheService';

interface SearchResult {
  id: string;
  type: 'page' | 'post' | 'service' | 'product' | 'media';
  title: string;
  description?: string;
  url: string;
  excerpt?: string;
  thumbnail?: string;
  metadata: {
    score: number;
    matches: string[];
    category?: string;
    tags?: string[];
    locale: string;
    lastUpdated: string;
  };
}

interface SearchFilters {
  type?: string[];
  category?: string[];
  tags?: string[];
  locale?: string;
  dateRange?: {
    start?: string;
    end?: string;
  };
}

interface SearchOptions {
  filters?: SearchFilters;
  sort?: {
    field: string;
    order: 'asc' | 'desc';
  };
  page?: number;
  limit?: number;
}

interface SearchMetrics {
  totalSearches: number;
  averageResults: number;
  popularQueries: Array<{
    query: string;
    count: number;
  }>;
  resultsByType: Record<string, number>;
  performance: {
    averageTime: number;
    cacheHitRate: number;
  };
  lastUpdate: number;
}

class SearchService {
  private static instance: SearchService;
  private searchIndex: Map<string, SearchResult[]> = new Map();
  private metrics: SearchMetrics;
  private observers: ((type: string, data: any) => void)[] = [];

  private constructor() {
    this.metrics = this.initializeMetrics();
  }

  public static getInstance(): SearchService {
    if (!SearchService.instance) {
      SearchService.instance = new SearchService();
    }
    return SearchService.instance;
  }

  private initializeMetrics(): SearchMetrics {
    return {
      totalSearches: 0,
      averageResults: 0,
      popularQueries: [],
      resultsByType: {},
      performance: {
        averageTime: 0,
        cacheHitRate: 0
      },
      lastUpdate: Date.now()
    };
  }

  public async search(
    query: string,
    options: SearchOptions = {}
  ): Promise<{ results: SearchResult[]; total: number }> {
    try {
      const startTime = performance.now();
      const cacheKey = `search:${query}:${JSON.stringify(options)}`;

      // Check cache
      const cached = await cacheService.get<{ results: SearchResult[]; total: number }>(cacheKey);
      if (cached) {
        this.updateMetrics('cache_hit', { query, results: cached.results });
        logger.debug('Search results loaded from cache', { query });
        return cached;
      }

      // Perform search
      const searchResults = await this.performSearch(query, options);

      // Cache results
      await cacheService.set(cacheKey, searchResults, {
        ttl: 3600000, // 1 hour
        type: 'search'
      });

      const endTime = performance.now();
      this.updateMetrics('search', {
        query,
        results: searchResults.results,
        time: endTime - startTime
      });

      return searchResults;
    } catch (error) {
      logger.error('Search failed', { query, options, error });
      throw error;
    }
  }

  private async performSearch(
    query: string,
    options: SearchOptions
  ): Promise<{ results: SearchResult[]; total: number }> {
    const {
      filters,
      sort = { field: 'metadata.score', order: 'desc' },
      page = 1,
      limit = 10
    } = options;

    let results = await this.searchInIndex(query);

    // Apply filters
    if (filters) {
      results = this.applyFilters(results, filters);
    }

    // Sort results
    results = this.sortResults(results, sort);

    // Calculate pagination
    const total = results.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    results = results.slice(start, end);

    return { results, total };
  }

  private async searchInIndex(query: string): Promise<SearchResult[]> {
    // In production, this would use a proper search engine like Elasticsearch
    const searchTerms = query.toLowerCase().split(' ');
    const results: SearchResult[] = [];

    for (const [, items] of this.searchIndex) {
      for (const item of items) {
        const score = this.calculateScore(item, searchTerms);
        if (score > 0) {
          results.push({
            ...item,
            metadata: {
              ...item.metadata,
              score
            }
          });
        }
      }
    }

    return results;
  }

  private calculateScore(item: SearchResult, terms: string[]): number {
    let score = 0;
    const content = [
      item.title,
      item.description,
      item.excerpt,
      ...(item.metadata.tags || [])
    ].join(' ').toLowerCase();

    for (const term of terms) {
      if (item.title.toLowerCase().includes(term)) {
        score += 3; // Title matches are weighted higher
      }
      if (content.includes(term)) {
        score += 1;
      }
    }

    return score;
  }

  private applyFilters(results: SearchResult[], filters: SearchFilters): SearchResult[] {
    return results.filter(result => {
      if (filters.type && !filters.type.includes(result.type)) {
        return false;
      }
      if (filters.category && !filters.category.includes(result.metadata.category || '')) {
        return false;
      }
      if (filters.tags && result.metadata.tags) {
        if (!filters.tags.some(tag => result.metadata.tags?.includes(tag))) {
          return false;
        }
      }
      if (filters.locale && result.metadata.locale !== filters.locale) {
        return false;
      }
      if (filters.dateRange) {
        const date = new Date(result.metadata.lastUpdated);
        if (filters.dateRange.start && date < new Date(filters.dateRange.start)) {
          return false;
        }
        if (filters.dateRange.end && date > new Date(filters.dateRange.end)) {
          return false;
        }
      }
      return true;
    });
  }

  private sortResults(
    results: SearchResult[],
    sort: { field: string; order: 'asc' | 'desc' }
  ): SearchResult[] {
    return results.sort((a, b) => {
      const aValue = this.getNestedValue(a, sort.field);
      const bValue = this.getNestedValue(b, sort.field);
      
      if (sort.order === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
  }

  public async indexContent(type: string, content: SearchResult[]): Promise<void> {
    try {
      this.searchIndex.set(type, content);
      this.updateMetrics('index', { type, count: content.length });
      logger.debug('Content indexed', { type, count: content.length });
    } catch (error) {
      logger.error('Failed to index content', { type, error });
      throw error;
    }
  }

  public async getSuggestions(query: string): Promise<string[]> {
    try {
      if (query.length < 2) return [];

      const cacheKey = `suggestions:${query}`;
      const cached = await cacheService.get<string[]>(cacheKey);
      if (cached) return cached;

      // Generate suggestions based on popular queries and indexed content
      const suggestions = this.generateSuggestions(query);

      await cacheService.set(cacheKey, suggestions, {
        ttl: 3600000, // 1 hour
        type: 'suggestions'
      });

      return suggestions;
    } catch (error) {
      logger.error('Failed to get suggestions', { query, error });
      return [];
    }
  }

  private generateSuggestions(query: string): string[] {
    const suggestions = new Set<string>();
    const queryLower = query.toLowerCase();

    // Add matching popular queries
    this.metrics.popularQueries
      .filter(({ query }) => query.toLowerCase().includes(queryLower))
      .forEach(({ query }) => suggestions.add(query));

    // Add matching titles from indexed content
    for (const [, items] of this.searchIndex) {
      items
        .filter(item => item.title.toLowerCase().includes(queryLower))
        .forEach(item => suggestions.add(item.title));
    }

    return Array.from(suggestions).slice(0, 5);
  }

  private updateMetrics(type: string, data: any): void {
    const now = Date.now();

    switch (type) {
      case 'search':
        this.metrics.totalSearches++;
        this.metrics.averageResults = (
          (this.metrics.averageResults * (this.metrics.totalSearches - 1) +
            data.results.length) /
          this.metrics.totalSearches
        );
        this.updatePopularQueries(data.query);
        this.updateResultsByType(data.results);
        this.metrics.performance.averageTime = (
          (this.metrics.performance.averageTime * (this.metrics.totalSearches - 1) +
            data.time) /
          this.metrics.totalSearches
        );
        break;

      case 'cache_hit':
        this.metrics.performance.cacheHitRate = (
          (this.metrics.performance.cacheHitRate * (this.metrics.totalSearches - 1) + 1) /
          this.metrics.totalSearches
        );
        break;
    }

    this.metrics.lastUpdate = now;
    this.notifyObservers(type, data);
  }

  private updatePopularQueries(query: string): void {
    const existing = this.metrics.popularQueries.find(q => q.query === query);
    if (existing) {
      existing.count++;
      this.metrics.popularQueries.sort((a, b) => b.count - a.count);
    } else {
      this.metrics.popularQueries.push({ query, count: 1 });
    }
    this.metrics.popularQueries = this.metrics.popularQueries.slice(0, 10);
  }

  private updateResultsByType(results: SearchResult[]): void {
    results.forEach(result => {
      this.metrics.resultsByType[result.type] =
        (this.metrics.resultsByType[result.type] || 0) + 1;
    });
  }

  public onSearchEvent(callback: (type: string, data: any) => void): () => void {
    this.observers.push(callback);
    return () => {
      this.observers = this.observers.filter(cb => cb !== callback);
    };
  }

  private notifyObservers(type: string, data: any): void {
    this.observers.forEach(callback => {
      try {
        callback(type, data);
      } catch (error) {
        logger.error('Search event callback failed', { error });
      }
    });
  }

  public getMetrics(): SearchMetrics {
    return { ...this.metrics };
  }

  public async generateReport(): Promise<string> {
    const report = {
      metrics: this.metrics,
      indexedContent: Array.from(this.searchIndex.entries()).map(([type, items]) => ({
        type,
        count: items.length
      })),
      timestamp: new Date().toISOString()
    };

    return JSON.stringify(report, null, 2);
  }
}

export const searchService = SearchService.getInstance();
export default SearchService;
