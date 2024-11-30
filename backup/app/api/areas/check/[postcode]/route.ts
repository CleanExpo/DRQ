import { NextResponse } from 'next/server'
import { isServicedPostcode } from '@/lib/areas'
import type { NextRequest } from 'next/server'

interface RouteParams {
  params: {
    postcode: string
  }
}

export async function GET(
  _request: NextRequest,
  { params }: RouteParams
) {
  const { postcode } = params

  if (!postcode) {
    return NextResponse.json(
      { error: 'Postcode is required' },
      { status: 400 }
    )
  }

  // Clean postcode input
  const cleanPostcode = postcode.replace(/\s+/g, '')

  const isServiced = isServicedPostcode(cleanPostcode)

  return NextResponse.json(
    { 
      postcode: cleanPostcode,
      isServiced,
      message: isServiced 
        ? 'Service is available in your area'
        : 'Sorry, we currently do not service this area'
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
      }
    }
  )
}
