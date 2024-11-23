import { NextResponse } from 'next/server';
import { search } from '@/utils/search';
import { trackEmergencyContact } from '@/utils/analytics';
import { getCachedResults, cacheResults, generateCacheKey } from '@/utils/searchCache';
import { trackSearch } from '@/utils/searchAnalytics';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type') as 'service' | 'location' | 'article' | undefined;
    const location = searchParams.get('location') || undefined;
    const service = searchParams.get('service') || undefined;
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    // Track emergency-related searches
    if (query.toLowerCase().includes('emergency')) {
      trackEmergencyContact('form', 'search-api');
    }

    // Check cache first
    const cacheKey = generateCacheKey(query, { type, location, service, limit });
    const cachedResults = getCachedResults(cacheKey);
    
    if (cachedResults) {
      // Track cached search
      trackSearch(query, cachedResults.length, true);
      
      return NextResponse.json({
        query,
        results: cachedResults,
        timestamp: new Date().toISOString(),
        total: cachedResults.length,
        cached: true
      });
    }

    // Perform search if no cache hit
    const results = await search(query, {
      type,
      location,
      service,
      limit
    });

    // Track new search
    trackSearch(query, results.length, false);

    // Cache the results
    cacheResults(cacheKey, results);

    return NextResponse.json({
      query,
      results,
      timestamp: new Date().toISOString(),
      total: results.length,
      cached: false
    });
  } catch (error) {
    console.error('Search API error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function HEAD(request: Request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=30'
    }
  });
}

// Configure allowed HTTP methods
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every minute
