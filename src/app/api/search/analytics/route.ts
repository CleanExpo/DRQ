import { NextResponse } from 'next/server';
import { getPopularSearches, getCacheHitRate } from '@/utils/searchAnalytics';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const analytics = {
      popularSearches: getPopularSearches(limit),
      cacheHitRate: getCacheHitRate(),
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
