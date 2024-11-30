import { NextResponse } from 'next/server'
import type { ServiceType } from '@/types/api'

const services: ServiceType[] = [
  {
    id: '1',
    name: 'Water Damage',
    description: 'Professional water damage restoration services',
    icon: 'droplet',
    slug: 'water-damage'
  },
  {
    id: '2',
    name: 'Mould Remediation',
    description: 'Expert mould removal and remediation',
    icon: 'alert-circle',
    slug: 'mould-remediation'
  },
  {
    id: '3',
    name: 'Sewage Clean Up',
    description: 'Emergency sewage cleanup and sanitization',
    icon: 'alert-triangle',
    slug: 'sewage-cleanup'
  },
  {
    id: '4',
    name: 'Fire Damage',
    description: 'Fire damage restoration and repair',
    icon: 'flame',
    slug: 'fire-damage'
  }
]

export async function GET() {
  return NextResponse.json(services, {
    status: 200,
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
    }
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.description || !body.slug) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create new service
    const newService: ServiceType = {
      id: (services.length + 1).toString(),
      name: body.name,
      description: body.description,
      icon: body.icon || 'help-circle',
      slug: body.slug
    }

    services.push(newService)

    return NextResponse.json(newService, { status: 201 })
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
