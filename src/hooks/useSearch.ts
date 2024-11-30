import { useState, useEffect, useCallback, useRef } from 'react';
import { searchService } from '@/services/SearchService';
import { logger } from '@/utils/logger';

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

interface UseSearchOptions {
  defaultFilters?: SearchFilters;
  defaultSort?: {
    field: string;
    order: 'asc' | 'desc';
  };
  pageSize?: number;
  debounceMs?: number;
  onSearch?: (query: string, results: SearchResult[]) => void;
  onError?: (error: Error) => void;
}

export function useSearch(options: UseSearchOptions = {}) {
  const {
    defaultFilters,
    defaultSort = { field: 'metadata.score', order: 'desc' },
    pageSize = 10,
    debounceMs = 300,
    onSearch,
    onError
  } = options;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters || {});
  const [sort, setSort] = useState(defaultSort);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState<SearchMetrics>(searchService.getMetrics());

  const debounceTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const unsubscribe = searchService.onSearchEvent((type, data) => {
      setMetrics(searchService.getMetrics());
    });

    return unsubscribe;
  }, []);

  const performSearch = useCallback(async (
    searchQuery: string,
    searchOptions: SearchOptions = {}
  ) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setTotal(0);
      return;
    }

    try {
      setIsLoading(true);
      const { results: searchResults, total: totalResults } = await searchService.search(
        searchQuery,
        {
          filters,
          sort,
          page,
          limit: pageSize,
          ...searchOptions
        }
      );

      setResults(searchResults);
      setTotal(totalResults);
      onSearch?.(searchQuery, searchResults);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Search failed');
      onError?.(err);
      logger.error('Search failed', { query: searchQuery, error });
    } finally {
      setIsLoading(false);
    }
  }, [filters, sort, page, pageSize, onSearch, onError]);

  const updateQuery = useCallback((newQuery: string) => {
    setQuery(newQuery);

    // Clear previous timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Set new timeout
    debounceTimeout.current = setTimeout(() => {
      performSearch(newQuery);
      updateSuggestions(newQuery);
    }, debounceMs);
  }, [performSearch, debounceMs]);

  const updateSuggestions = useCallback(async (searchQuery: string) => {
    try {
      const newSuggestions = await searchService.getSuggestions(searchQuery);
      setSuggestions(newSuggestions);
    } catch (error) {
      logger.error('Failed to get suggestions', { query: searchQuery, error });
    }
  }, []);

  const updateFilters = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset page when filters change
    performSearch(query, { filters: newFilters, page: 1 });
  }, [query, performSearch]);

  const updateSort = useCallback((newSort: { field: string; order: 'asc' | 'desc' }) => {
    setSort(newSort);
    performSearch(query, { sort: newSort });
  }, [query, performSearch]);

  const nextPage = useCallback(() => {
    const nextPageNum = page + 1;
    setPage(nextPageNum);
    performSearch(query, { page: nextPageNum });
  }, [query, page, performSearch]);

  const previousPage = useCallback(() => {
    const prevPageNum = Math.max(1, page - 1);
    setPage(prevPageNum);
    performSearch(query, { page: prevPageNum });
  }, [query, page, performSearch]);

  const goToPage = useCallback((pageNum: number) => {
    setPage(pageNum);
    performSearch(query, { page: pageNum });
  }, [query, performSearch]);

  const reset = useCallback(() => {
    setQuery('');
    setResults([]);
    setSuggestions([]);
    setFilters(defaultFilters || {});
    setSort(defaultSort);
    setPage(1);
    setTotal(0);
  }, [defaultFilters, defaultSort]);

  const generateReport = useCallback(async () => {
    try {
      return await searchService.generateReport();
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Report generation failed');
      onError?.(err);
      logger.error('Report generation failed', { error });
      throw err;
    }
  }, [onError]);

  return {
    query,
    results,
    suggestions,
    filters,
    sort,
    page,
    total,
    isLoading,
    metrics,
    updateQuery,
    updateFilters,
    updateSort,
    nextPage,
    previousPage,
    goToPage,
    reset,
    generateReport,
    hasNextPage: total > page * pageSize,
    hasPreviousPage: page > 1,
    totalPages: Math.ceil(total / pageSize)
  };
}

// Example usage:
/*
function SearchComponent() {
  const {
    query,
    results,
    suggestions,
    isLoading,
    updateQuery,
    updateFilters,
    metrics
  } = useSearch({
    defaultFilters: {
      type: ['page', 'post'],
      locale: 'en-AU'
    },
    onSearch: (query, results) => {
      console.log(`Found ${results.length} results for "${query}"`);
    }
  });

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => updateQuery(e.target.value)}
        placeholder="Search..."
      />
      
      {suggestions.length > 0 && (
        <ul>
          {suggestions.map(suggestion => (
            <li key={suggestion} onClick={() => updateQuery(suggestion)}>
              {suggestion}
            </li>
          ))}
        </ul>
      )}

      {isLoading ? (
        <div>Searching...</div>
      ) : (
        <div>
          {results.map(result => (
            <div key={result.id}>
              <h3>{result.title}</h3>
              <p>{result.description}</p>
            </div>
          ))}
        </div>
      )}

      <div>
        Total searches: {metrics.totalSearches}
        Average results: {metrics.averageResults.toFixed(2)}
      </div>
    </div>
  );
}
*/
