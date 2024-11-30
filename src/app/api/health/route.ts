import { NextResponse } from 'next/server';
import { databaseService } from '@/services/database';
import { getRedisClient } from '@/lib/redis';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const healthStatus = {
    status: 'checking',
    timestamp: new Date().toISOString(),
    services: {
      mongodb: 'checking',
      redis: 'checking',
    },
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
  };

  try {
    // Check MongoDB connection
    const mongoHealth = await databaseService.healthCheck();
    healthStatus.services.mongodb = mongoHealth ? 'connected' : 'disconnected';

    // Check Redis connection
    try {
      const redis = await getRedisClient();
      await redis.ping();
      healthStatus.services.redis = 'connected';
    } catch (error) {
      console.error('Redis health check failed:', error);
      healthStatus.services.redis = 'disconnected';
    }

    // Determine overall status
    healthStatus.status = Object.values(healthStatus.services).every(
      status => status === 'connected'
    ) ? 'healthy' : 'degraded';

    return NextResponse.json(healthStatus, {
      status: healthStatus.status === 'healthy' ? 200 : 503,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        mongodb: 'error',
        redis: 'error',
      },
      environment: process.env.NODE_ENV,
      error: 'Health check failed',
    }, {
      status: 503,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  }
}
