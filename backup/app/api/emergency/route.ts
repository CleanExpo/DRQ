import { NextResponse } from 'next/server'
import type { EmergencyContact } from '@/types/api'

const emergencyContact: EmergencyContact = {
  phone: '1300309361',
  available24x7: true,
  responseTime: '1 hour'
}

// Store callback requests (in a real app, this would be in a database)
const callbackRequests: Array<{
  id: string
  phone: string
  name: string
  issue: string
  timestamp: string
  status: 'pending' | 'processed'
}> = []

export async function GET() {
  return NextResponse.json(emergencyContact, {
    status: 200,
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
    }
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.phone || !body.name || !body.issue) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create new callback request
    const callbackRequest = {
      id: Math.random().toString(36).substring(7),
      phone: body.phone,
      name: body.name,
      issue: body.issue,
      timestamp: new Date().toISOString(),
      status: 'pending' as const
    }

    callbackRequests.push(callbackRequest)

    // In a real app, you would:
    // 1. Save to database
    // 2. Send notification to staff
    // 3. Send confirmation SMS/email to customer
    // 4. Queue follow-up tasks

    return NextResponse.json(
      { 
        requestId: callbackRequest.id,
        message: 'Callback request received',
        estimatedResponse: '15 minutes'
      }, 
      { status: 201 }
    )
  } catch (error) {
    console.error('Error processing callback request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to format phone number
export function formatPhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '')
  
  // Format as Australian phone number
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')
  }
  
  return phone
}

// Helper function to validate phone number
export function isValidPhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '')
  return /^(?:61|0)?[2-478]\d{8}$/.test(cleaned)
}
