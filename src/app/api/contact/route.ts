import { NextResponse } from 'next/server'
import { generateEmailTemplate } from '@/lib/email-templates'
import { analytics } from '@/lib/analytics'
import { ContactFormData } from '@/types/forms'
import { z } from 'zod'

// Validate request data
const requestSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().regex(/^(\+?61|0)[2-478](?:[ -]?[0-9]){8}$/),
  message: z.string().min(10).max(1000),
  urgency: z.enum(["high", "medium", "low"]),
  serviceType: z.enum(["water", "fire", "mould"]).optional(),
})

export async function POST(request: Request) {
  try {
    // Parse and validate request data
    const body = await request.json()
    const validatedData = requestSchema.parse(body) as ContactFormData
    
    // Generate email content
    const emailHtml = generateEmailTemplate(validatedData)
    
    // Send email (implement your email service here)
    // await sendEmail({
    //   to: process.env.CONTACT_EMAIL,
    //   subject: `New Contact Form Submission - ${validatedData.urgency.toUpperCase()} Priority`,
    //   html: emailHtml
    // })
    
    // Track form submission
    if (process.env.NODE_ENV === 'production') {
      await analytics.trackFormSubmission({
        formType: 'contact',
        urgency: validatedData.urgency,
        serviceType: validatedData.serviceType
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Form submitted successfully' 
    })
  } catch (error) {
    console.error('Contact form error:', error)
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid form data',
          errors: error.errors
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to process form submission' 
      },
      { status: 500 }
    )
  }
}
