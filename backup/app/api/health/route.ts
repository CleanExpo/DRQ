import { NextResponse } from 'next/server'

export async function GET() {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version,
    services: {
      api: {
        status: 'operational',
        endpoints: [
          '/api/services',
          '/api/areas',
          '/api/emergency'
        ]
      },
      database: {
        status: 'simulated',
        type: 'in-memory'
      }
    },
    deployment: {
      platform: 'vercel',
      region: process.env.VERCEL_REGION || 'syd1',
      environment: process.env.VERCEL_ENV || 'development'
    }
  }

  return NextResponse.json(healthCheck, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, must-revalidate',
      'Content-Type': 'application/json'
    }
  })
}

export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, must-revalidate'
    }
  })
}

// Utility function to check if all services are operational
function areServicesOperational(): boolean {
  try {
    // Add actual service checks here
    // For now, return true as we're using in-memory data
    return true
  } catch (error) {
    console.error('Service check failed:', error)
    return false
  }
}
