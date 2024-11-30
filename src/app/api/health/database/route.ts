import { NextResponse } from 'next/server';
import { getConnectionStatus } from '../../../../config/database';
import mongoose from 'mongoose';

export async function GET() {
  try {
    const status = getConnectionStatus();
    
    // If using fallback, return degraded status
    if (status.isUsingFallback) {
      return NextResponse.json({
        status: 'degraded',
        mode: 'fallback',
        message: 'Using in-memory fallback store'
      }, { status: 200 });
    }

    // Check if we can perform a database operation
    if (status.isConnected) {
      try {
        // Perform a ping to verify connection
        await mongoose.connection.db.admin().ping();
        
        // Get database stats
        const stats = await mongoose.connection.db.stats();
        
        return NextResponse.json({
          status: 'healthy',
          mode: 'mongodb',
          details: {
            collections: stats.collections,
            documents: stats.objects,
            indexes: stats.indexes,
            connectionPool: {
              active: mongoose.connection.activeConnections.size,
              available: mongoose.connection.availableConnections.size,
              poolSize: status.poolSize
            },
            retryCount: status.retryCount
          }
        }, { status: 200 });
      } catch (error) {
        return NextResponse.json({
          status: 'unhealthy',
          mode: 'mongodb',
          error: 'Database operation failed',
          details: process.env.NODE_ENV === 'development' ? error : undefined
        }, { status: 503 });
      }
    }

    return NextResponse.json({
      status: 'unhealthy',
      mode: 'disconnected',
      message: 'Not connected to database'
    }, { status: 503 });

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: 'Health check failed',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 });
  }
}
