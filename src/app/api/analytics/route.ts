import { NextResponse } from 'next/server'
import { z } from 'zod'

// Validate analytics event data
const analyticsEventSchema = z.object({
  event: z.string(),
  data: z.object({
    timestamp: z.string(),
    path: z.string(),
    userAgent: z.string(),
    formType: z.string().optional(),
    urgency: z.string().optional(),
    serviceType: z.string().optional(),
    error: z.string().optional(),
    type: z.string().optional(),
  }).passthrough(), // Allow additional properties
})

// In-memory store for development
const analyticsStore: any[] = [];

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = analyticsEventSchema.parse(body)
    
    if (process.env.NODE_ENV === 'development') {
      // Store in memory for development
      analyticsStore.push({
        ...validatedData,
        timestamp: new Date().toISOString()
      });
      
      console.log('Analytics event:', {
        event: validatedData.event,
        data: validatedData.data
      });
    } else {
      // In production, you would want to use a proper database or analytics service
      // Example with Vercel KV:
      // await kv.lpush('analytics', JSON.stringify({
      //   ...validatedData,
      //   timestamp: new Date().toISOString()
      // }))
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics error:', error)
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid analytics data',
          errors: error.errors
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false },
      { status: 500 }
    )
  }
}

// For development: Get analytics data
export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { success: false, message: 'Not available in production' },
      { status: 403 }
    )
  }
  
  return NextResponse.json({
    success: true,
    data: analyticsStore
  })
}
