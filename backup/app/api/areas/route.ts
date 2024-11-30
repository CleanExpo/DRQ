import { NextResponse } from 'next/server'
import { serviceAreas } from '@/lib/areas'
import type { ServiceArea } from '@/types/api'

export async function GET() {
  return NextResponse.json(serviceAreas, {
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
    if (!body.name || !body.postcode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if postcode already exists
    const existingArea = serviceAreas.find(area => area.postcode === body.postcode)
    if (existingArea) {
      return NextResponse.json(
        { error: 'Service area with this postcode already exists' },
        { status: 409 }
      )
    }

    // Create new service area
    const newArea: ServiceArea = {
      id: (serviceAreas.length + 1).toString(),
      name: body.name,
      postcode: body.postcode,
      active: body.active ?? true
    }

    serviceAreas.push(newArea)

    return NextResponse.json(newArea, { status: 201 })
  } catch (error) {
    console.error('Error creating service area:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
