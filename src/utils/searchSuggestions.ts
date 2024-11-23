import { getPopularSearches } from './searchAnalytics';

const recentSearches = new Set<string>();
const MAX_RECENT_SEARCHES = 5;

export function addRecentSearch(term: string): void {
  // Remove if exists (to add it to the front)
  recentSearches.delete(term);
  
  // Add to recent searches
  recentSearches.add(term);
  
  // Keep only the most recent searches
  if (recentSearches.size > MAX_RECENT_SEARCHES) {
    const firstValue = recentSearches.values().next();
    if (firstValue.done === false) {
      recentSearches.delete(firstValue.value);
    }
  }
}

export function getSuggestions(query: string): string[] {
  if (!query.trim()) {
    return Array.from(recentSearches).reverse();
  }

  const suggestions: string[] = [];
  const queryLower = query.toLowerCase();
  
  // Add matching recent searches
  recentSearches.forEach(term => {
    if (term.toLowerCase().includes(queryLower)) {
      suggestions.push(term);
    }
  });

  // Add popular searches that match
  const popularSearches = getPopularSearches(5);
  popularSearches.forEach(({ term }) => {
    if (term.toLowerCase().includes(queryLower) && !suggestions.includes(term)) {
      suggestions.push(term);
    }
  });

  return suggestions.slice(0, 5);
}
