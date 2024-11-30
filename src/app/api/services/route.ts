import { NextResponse } from 'next/server';
import { SERVICES, Service } from '../../../constants/services';

interface EmergencyInfo {
  available: boolean;
  responseTime: string;
  coverage: string;
}

interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

interface ServiceWithDetails extends Service {
  features: string[];
  process: ProcessStep[];
  emergencyInfo: EmergencyInfo;
}

type ServiceName = Service['name'];

export async function GET(): Promise<NextResponse<ServiceWithDetails[]>> {
  try {
    const servicesWithDetails: ServiceWithDetails[] = SERVICES.map(service => ({
      ...service,
      features: getServiceFeatures(service.name),
      process: getServiceProcess(service.name),
      emergencyInfo: {
        available: true,
        responseTime: '1-2 hours',
        coverage: 'South East Queensland'
      }
    }));

    return NextResponse.json(servicesWithDetails, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=7200'
      }
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' } as any,
      { status: 500 }
    );
  }
}

function getServiceFeatures(serviceName: ServiceName): string[] {
  const commonFeatures: string[] = [
    '24/7 Emergency Response',
    'Professional Equipment',
    'Experienced Technicians',
    'Insurance Claim Support'
  ];

  const serviceSpecificFeatures: Record<ServiceName, string[]> = {
    'Water Damage': [
      'Advanced Water Extraction',
      'Structural Drying',
      'Moisture Detection',
      'Mould Prevention'
    ],
    'Flood Recovery': [
      'Flood Water Removal',
      'Sanitization Services',
      'Content Recovery',
      'Structural Assessment'
    ],
    'Mould Remediation': [
      'Mould Testing',
      'Safe Removal',
      'Prevention Strategies',
      'Air Quality Testing'
    ],
    'Fire Damage': [
      'Smoke Removal',
      'Odour Control',
      'Content Restoration',
      'Structural Repairs'
    ],
    'Sewage Cleanup': [
      'Safe Waste Removal',
      'Disinfection Services',
      'Odour Elimination',
      'Health Safety Measures'
    ],
    'Commercial': [
      'Business Continuity',
      'Large Scale Capacity',
      'Industry Compliance',
      'Project Management'
    ]
  };

  return [...commonFeatures, ...(serviceSpecificFeatures[serviceName] || [])];
}

function getServiceProcess(serviceName: ServiceName): ProcessStep[] {
  const commonSteps: ProcessStep[] = [
    {
      step: 1,
      title: 'Assessment',
      description: 'Thorough inspection and damage assessment'
    },
    {
      step: 2,
      title: 'Planning',
      description: 'Detailed restoration plan development'
    },
    {
      step: 3,
      title: 'Execution',
      description: 'Professional restoration services'
    },
    {
      step: 4,
      title: 'Completion',
      description: 'Final inspection and quality assurance'
    }
  ];

  const serviceSpecificSteps: Record<ServiceName, string[]> = {
    'Water Damage': [
      'Water Extraction',
      'Structural Drying',
      'Restoration',
      'Prevention'
    ],
    'Flood Recovery': [
      'Water Removal',
      'Sanitization',
      'Drying',
      'Restoration'
    ],
    'Mould Remediation': [
      'Inspection',
      'Containment',
      'Removal',
      'Prevention'
    ],
    'Fire Damage': [
      'Assessment',
      'Cleanup',
      'Restoration',
      'Deodorization'
    ],
    'Sewage Cleanup': [
      'Containment',
      'Removal',
      'Sanitization',
      'Restoration'
    ],
    'Commercial': [
      'Assessment',
      'Planning',
      'Execution',
      'Verification'
    ]
  };

  return commonSteps.map((step, index) => ({
    ...step,
    title: serviceSpecificSteps[serviceName]?.[index] || step.title
  }));
}

export const dynamic = 'force-dynamic';
