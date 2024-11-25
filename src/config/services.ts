export const serviceStructure = {
  waterDamage: {
    id: 'water-damage',
    title: 'Water Damage Restoration',
    shortDescription: 'Emergency water damage restoration and flood cleanup services',
    longDescription: 'Professional water damage restoration services available 24/7. We handle everything from emergency water extraction to complete structural drying and contents restoration.',
    emergency: true,
    responseTime: '1-2 hours',
    services: [
      {
        id: 'emergency-response',
        name: 'Emergency Response',
        description: 'Immediate response to water damage emergencies with rapid water extraction and damage assessment.',
        features: [
          '24/7 emergency response',
          'Rapid water extraction',
          'Initial damage assessment',
          'Emergency board-up if needed'
        ]
      },
      {
        id: 'flood-cleanup',
        name: 'Flood Cleanup',
        description: 'Comprehensive flood cleanup services including water removal, sanitization, and damage mitigation.',
        features: [
          'Complete water removal',
          'Property sanitization',
          'Damage documentation',
          'Insurance liaison'
        ]
      },
      {
        id: 'structural-drying',
        name: 'Structural Drying',
        description: 'Professional structural drying using industrial equipment and moisture monitoring.',
        features: [
          'Industrial drying equipment',
          'Moisture monitoring',
          'Temperature control',
          'Progress documentation'
        ]
      }
    ]
  },
  sewageCleanup: {
    id: 'sewage-cleanup',
    title: 'Sewage Cleanup',
    shortDescription: 'Professional sewage cleanup and sanitization services',
    longDescription: 'Expert sewage cleanup services with proper sanitization and decontamination procedures. We ensure safe and thorough cleanup of sewage spills and backups.',
    emergency: true,
    responseTime: '1-2 hours',
    services: [
      {
        id: 'emergency-response',
        name: 'Emergency Response',
        description: 'Rapid response to sewage emergencies with immediate containment and cleanup.',
        features: [
          '24/7 emergency response',
          'Immediate containment',
          'Safety assessment',
          'Hazard control'
        ]
      },
      {
        id: 'sanitization',
        name: 'Sanitization',
        description: 'Complete sanitization and disinfection of affected areas.',
        features: [
          'Professional disinfection',
          'EPA-approved products',
          'Complete decontamination',
          'Health safety protocols'
        ]
      }
    ]
  },
  mouldRemediation: {
    id: 'mould-remediation',
    title: 'Mould Remediation',
    shortDescription: 'Professional mould inspection and remediation services',
    longDescription: 'Comprehensive mould remediation services including inspection, safe removal, and prevention strategies. We ensure complete elimination of mould and prevention of future growth.',
    emergency: false,
    responseTime: '24-48 hours',
    services: [
      {
        id: 'inspection',
        name: 'Inspection',
        description: 'Thorough inspection and assessment of mould problems.',
        features: [
          'Visual inspection',
          'Moisture detection',
          'Air quality testing',
          'Lab analysis'
        ]
      },
      {
        id: 'remediation',
        name: 'Remediation',
        description: 'Professional mould removal and remediation services.',
        features: [
          'Safe removal methods',
          'Containment procedures',
          'HEPA filtration',
          'Surface treatment'
        ]
      }
    ]
  }
} as const;

export const commercialStructure = {
  office: {
    id: 'office-buildings',
    title: 'Office Buildings',
    description: 'Comprehensive restoration services for office buildings and corporate spaces.',
    features: [
      '24/7 Emergency Response',
      'Minimal Business Disruption',
      'Full Documentation',
      'Insurance Liaison'
    ]
  },
  retail: {
    id: 'retail-spaces',
    title: 'Retail Spaces',
    description: 'Specialized solutions for retail locations and shopping centers.',
    features: [
      'After-hours Service',
      'Stock Protection',
      'Rapid Reopening',
      'Brand Protection'
    ]
  },
  healthcare: {
    id: 'healthcare',
    title: 'Healthcare Facilities',
    description: 'Expert services for hospitals and medical facilities.',
    features: [
      'Sterile Environment',
      'Code Compliance',
      'Infection Control',
      'Patient Safety'
    ]
  }
} as const;

export const commercialServices = {
  waterDamage: {
    title: 'Commercial Water Damage',
    description: 'Professional water damage restoration for commercial properties.',
    features: [
      'Rapid Response Teams',
      'Business Continuity Focus',
      'Large-Scale Capabilities',
      'Industry Compliance'
    ]
  },
  sewageCleanup: {
    title: 'Commercial Sewage Cleanup',
    description: 'Expert sewage cleanup services for commercial facilities.',
    features: [
      'Health & Safety Protocols',
      'Complete Sanitization',
      'Minimal Disruption',
      'Code Compliance'
    ]
  },
  mouldRemediation: {
    title: 'Commercial Mould Remediation',
    description: 'Professional mould remediation for commercial properties.',
    features: [
      'Air Quality Testing',
      'Safe Removal Methods',
      'Prevention Strategies',
      'Documentation'
    ]
  }
} as const;

// Type exports
export type ServiceId = keyof typeof serviceStructure;
export type Service = typeof serviceStructure[ServiceId];
export type SubService = Service['services'][number];

export type CommercialId = keyof typeof commercialStructure;
export type Commercial = typeof commercialStructure[CommercialId];

export type CommercialServiceId = keyof typeof commercialServices;
export type CommercialService = typeof commercialServices[CommercialServiceId];

// Helper functions
export function getService(id: ServiceId) {
  return serviceStructure[id];
}

export function getCommercialService(id: CommercialServiceId) {
  return commercialServices[id];
}

export function getCommercialIndustry(id: CommercialId) {
  return commercialStructure[id];
}

export function isEmergencyService(id: ServiceId) {
  return serviceStructure[id].emergency;
}

export function getResponseTime(id: ServiceId) {
  return serviceStructure[id].responseTime;
}

export default serviceStructure;
