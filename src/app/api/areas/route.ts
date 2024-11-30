import { NextResponse } from 'next/server';
import { SERVICE_AREAS, POSTCODE_RANGES, ServiceArea } from '../../../constants/areas';
import { Service } from '../../../constants/services';

interface EmergencyResponse {
  available: boolean;
  responseTime: string;
}

interface Coverage {
  residential: boolean;
  commercial: boolean;
  industrial: boolean;
}

interface AreaDetails {
  name: ServiceArea;
  postcodes: [string, string];
  services: string[];
  emergencyResponse: EmergencyResponse;
  coverage: Coverage;
}

interface PostcodeCheckRequest {
  postcode: string;
}

interface PostcodeCheckResponse {
  available: boolean;
  area?: ServiceArea;
  services?: string[];
  emergencyResponse?: EmergencyResponse;
  message?: string;
}

export async function GET(): Promise<NextResponse<AreaDetails[]>> {
  try {
    const areasWithDetails: AreaDetails[] = SERVICE_AREAS.map(area => ({
      name: area,
      postcodes: POSTCODE_RANGES[area],
      services: [
        'Water Damage',
        'Flood Recovery',
        'Mould Remediation',
        'Fire Damage',
        'Sewage Cleanup',
        'Commercial'
      ],
      emergencyResponse: {
        available: true,
        responseTime: '1-2 hours'
      },
      coverage: {
        residential: true,
        commercial: true,
        industrial: true
      }
    }));

    return NextResponse.json(areasWithDetails, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=7200'
      }
    });
  } catch (error) {
    console.error('Error fetching service areas:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service areas' } as any,
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request
): Promise<NextResponse<PostcodeCheckResponse>> {
  try {
    const body = await request.json() as PostcodeCheckRequest;
    const { postcode } = body;

    if (!postcode) {
      return NextResponse.json(
        { error: 'Postcode is required' } as any,
        { status: 400 }
      );
    }

    // Check if postcode is in any of our service areas
    const serviceArea = Object.entries(POSTCODE_RANGES).find(([_, range]) => {
      const [min, max] = range;
      return postcode >= min && postcode <= max;
    });

    if (serviceArea) {
      return NextResponse.json({
        available: true,
        area: serviceArea[0] as ServiceArea,
        services: [
          'Water Damage',
          'Flood Recovery',
          'Mould Remediation',
          'Fire Damage',
          'Sewage Cleanup',
          'Commercial'
        ],
        emergencyResponse: {
          available: true,
          responseTime: '1-2 hours'
        }
      });
    }

    return NextResponse.json({
      available: false,
      message: 'Sorry, we do not currently service this area. Please contact us for more information.'
    });

  } catch (error) {
    console.error('Error checking postcode:', error);
    return NextResponse.json(
      { error: 'Failed to check postcode' } as any,
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
