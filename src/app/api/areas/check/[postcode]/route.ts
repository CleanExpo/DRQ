import { NextResponse } from 'next/server';
import { SERVICE_AREAS, POSTCODE_RANGES, ServiceArea, PostcodeRange } from '../../../../../constants/areas';

interface PostcodeCheckResponse {
  postcode: string;
  isServiced: boolean;
  areas: ServiceArea[];
}

interface PostcodeErrorResponse {
  error: string;
}

function isPostcodeInRange(postcode: string, range: PostcodeRange): boolean {
  const postcodeNum = parseInt(postcode);
  const [min, max] = range;
  return postcodeNum >= parseInt(min) && postcodeNum <= parseInt(max);
}

function isServicedPostcode(postcode: string): boolean {
  return SERVICE_AREAS.some(area => {
    const range = POSTCODE_RANGES[area];
    return range && isPostcodeInRange(postcode, range);
  });
}

export async function GET(
  request: Request,
  { params }: { params: { postcode: string } }
): Promise<NextResponse<PostcodeCheckResponse | PostcodeErrorResponse>> {
  try {
    const { postcode } = params;

    // Validate postcode format
    if (!/^\d{4}$/.test(postcode)) {
      return NextResponse.json(
        { error: 'Invalid postcode format' },
        { status: 400 }
      );
    }

    // Check if postcode is serviced
    const isServiced = isServicedPostcode(postcode);

    // Get matching service areas
    const matchingAreas = SERVICE_AREAS.filter(area => {
      const range = POSTCODE_RANGES[area];
      return range && isPostcodeInRange(postcode, range);
    });

    return NextResponse.json({
      postcode,
      isServiced,
      areas: matchingAreas
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
      }
    });
  } catch (error) {
    console.error('Error checking postcode:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
