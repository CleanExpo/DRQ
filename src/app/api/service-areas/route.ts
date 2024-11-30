import { NextResponse } from 'next/server';
import { getCachedData, generateCacheKey } from '@/utils/cache';
import { ServiceArea, ApiResponse } from '@/types';
import { CacheError } from '@/lib/mongodb';

// Mock service areas data - in production this would come from your database
const SERVICE_AREAS: ServiceArea[] = [
  { id: 1, name: 'Brisbane', postcode: '4000', state: 'QLD' },
  { id: 2, name: 'Gold Coast', postcode: '4217', state: 'QLD' },
  { id: 3, name: 'Sunshine Coast', postcode: '4557', state: 'QLD' },
];

export async function GET(): Promise<NextResponse<ApiResponse<ServiceArea[]>>> {
  try {
    // Generate a cache key
    const cacheKey = generateCacheKey(['service-areas', 'all']);

    // Fetch data with caching
    const data = await getCachedData<ServiceArea[]>(
      cacheKey,
      async () => {
        // This is where you would normally fetch from your database
        // For now, we'll return the mock data
        return SERVICE_AREAS;
      },
      {
        type: 'service-area',
        ttl: 24 * 60 * 60 * 1000, // 24 hours
        useMemoryCache: true,
      }
    );

    return NextResponse.json({
      data,
      statusCode: 200,
      message: 'Service areas retrieved successfully'
    });
  } catch (error) {
    console.error('Service areas fetch failed:', error);
    
    if (error instanceof CacheError) {
      return NextResponse.json(
        {
          error: 'Cache operation failed',
          statusCode: 503,
          message: 'Service temporarily unavailable'
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch service areas',
        statusCode: 500,
        message: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

interface PostcodeRequest {
  postcode: string;
}

export async function POST(
  request: Request
): Promise<NextResponse<ApiResponse<ServiceArea[]>>> {
  try {
    const body = await request.json() as PostcodeRequest;
    const { postcode } = body;

    if (!postcode) {
      return NextResponse.json(
        {
          error: 'Postcode is required',
          statusCode: 400,
          message: 'Bad request'
        },
        { status: 400 }
      );
    }

    // Validate postcode format (Australian postcodes are 4 digits)
    if (!/^\d{4}$/.test(postcode)) {
      return NextResponse.json(
        {
          error: 'Invalid postcode format',
          statusCode: 400,
          message: 'Postcode must be 4 digits'
        },
        { status: 400 }
      );
    }

    // Generate a cache key including the postcode
    const cacheKey = generateCacheKey(['service-areas', 'postcode', postcode]);

    const data = await getCachedData<ServiceArea[]>(
      cacheKey,
      async () => {
        // This is where you would normally query your database
        // For now, we'll filter the mock data
        return SERVICE_AREAS.filter(area => area.postcode === postcode);
      },
      {
        type: 'service-area',
        ttl: 12 * 60 * 60 * 1000, // 12 hours
        useMemoryCache: true,
      }
    );

    if (!data || data.length === 0) {
      return NextResponse.json(
        {
          data: [],
          statusCode: 404,
          message: 'No service areas found for this postcode'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data,
      statusCode: 200,
      message: 'Service areas retrieved successfully'
    });
  } catch (error) {
    console.error('Service area lookup failed:', error);
    
    if (error instanceof CacheError) {
      return NextResponse.json(
        {
          error: 'Cache operation failed',
          statusCode: 503,
          message: 'Service temporarily unavailable'
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to lookup service area',
        statusCode: 500,
        message: 'Internal server error'
      },
      { status: 500 }
    );
  }
}
