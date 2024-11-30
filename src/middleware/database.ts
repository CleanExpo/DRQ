import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { connectToDatabase } from '../config/database';
import { logger } from '../utils/logger';

let isConnecting = false;
let isConnected = false;

export async function withDatabase(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    // Skip database connection for non-API routes
    if (!request.nextUrl.pathname.startsWith('/api/')) {
      return handler(request);
    }

    // Prevent multiple simultaneous connection attempts
    if (!isConnected && !isConnecting) {
      isConnecting = true;
      await connectToDatabase();
      isConnected = true;
      isConnecting = false;
    }

    return handler(request);
  } catch (error) {
    logger.error('Database middleware error:', error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: 'Internal Server Error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
