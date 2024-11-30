import { NextResponse } from 'next/server'
import type { ContactForm } from '../../../types/api'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create contact form submission
    const contactForm: ContactForm = {
      name: body.name,
      email: body.email,
      phone: body.phone || '',
      message: body.message,
      postcode: body.postcode || '',
      serviceType: body.serviceType || '',
      isEmergency: body.isEmergency || false
    }

    // In production, this would send an email and save to a database
    console.log('Contact Form Submission:', contactForm)

    // Send success response
    return NextResponse.json({
      message: 'Contact form submitted successfully',
      data: contactForm
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store'
      }
    })
  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  }, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store'
    }
  })
}
