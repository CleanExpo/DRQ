import { NextResponse } from 'next/server';
import { CONTACT } from '../../../constants/contact';
import { SERVICES, Service } from '../../../constants/services';
import { SERVICE_AREAS, POSTCODE_RANGES } from '../../../constants/areas';

interface EmergencyRequest {
  name: string;
  phone: string;
  service: Service['name'];
  postcode?: string;
  [key: string]: unknown;
}

interface EmergencyResponse {
  success: boolean;
  message: string;
  requestId: string;
  responseTime: string;
  contact: {
    phone: string;
    email: string;
  };
  nextSteps: string[];
}

interface ErrorResponse {
  error: string;
  message?: string;
  contact?: {
    phone: string;
    email: string;
  };
}

interface EmergencyRequestRecord extends EmergencyRequest {
  id: string;
  timestamp: string;
  status: 'received';
  priority: 'high';
  responseTime: string;
  assignedTeam: string;
  contactMethods: {
    phone: string;
    email: string;
  };
}

export async function POST(
  request: Request
): Promise<NextResponse<EmergencyResponse | ErrorResponse>> {
  try {
    const body = await request.json() as EmergencyRequest;
    
    // Validate required fields
    const requiredFields = ['name', 'phone', 'service'] as const;
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate service type
    const validService = SERVICES.some(s => s.name === body.service);
    if (!validService) {
      return NextResponse.json(
        { error: 'Invalid service type' },
        { status: 400 }
      );
    }

    // Validate postcode if provided
    if (body.postcode) {
      const inServiceArea = Object.entries(POSTCODE_RANGES).some(([_, range]) => {
        const [min, max] = range;
        return body.postcode! >= min && body.postcode! <= max;
      });

      if (!inServiceArea) {
        return NextResponse.json({
          error: 'Location not in service area',
          message: 'Sorry, we do not currently service this area. Please contact us for more information.',
          contact: {
            phone: CONTACT.PHONE,
            email: CONTACT.EMAIL
          }
        }, { status: 400 });
      }
    }

    // Process emergency request
    const emergencyRequest: EmergencyRequestRecord = {
      id: generateRequestId(),
      timestamp: new Date().toISOString(),
      status: 'received',
      priority: 'high',
      ...body,
      responseTime: '1-2 hours',
      assignedTeam: 'Emergency Response Unit',
      contactMethods: {
        phone: CONTACT.PHONE,
        email: CONTACT.EMAIL
      }
    };

    // In production, this would:
    // 1. Save to database
    // 2. Send notifications to emergency response team
    // 3. Send confirmation to customer
    // 4. Log the request
    console.log('Emergency Request:', emergencyRequest);

    return NextResponse.json({
      success: true,
      message: 'Emergency request received',
      requestId: emergencyRequest.id,
      responseTime: emergencyRequest.responseTime,
      contact: emergencyRequest.contactMethods,
      nextSteps: [
        'Our emergency team has been notified',
        'You will receive a call within 15 minutes',
        'Please ensure safe access to the affected area',
        'Gather any relevant insurance information if available'
      ]
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store'
      }
    });

  } catch (error) {
    console.error('Error processing emergency request:', error);
    return NextResponse.json(
      {
        error: 'Failed to process emergency request',
        message: 'Please call us directly at ' + CONTACT.PHONE
      },
      { status: 500 }
    );
  }
}

function generateRequestId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `EMG-${timestamp}-${random}`.toUpperCase();
}

export const dynamic = 'force-dynamic';
