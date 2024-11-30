export interface Service {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription?: string;
}

export const services: Service[] = [
  {
    id: 'water-damage',
    name: 'Water Damage Restoration',
    shortDescription: 'Expert water damage restoration services for homes and businesses affected by floods, leaks, or storms.',
  },
  {
    id: 'storm-damage',
    name: 'Storm Damage Recovery',
    shortDescription: 'Comprehensive storm damage recovery services including debris removal and structural repairs.',
  },
  {
    id: 'mould-remediation',
    name: 'Mould Remediation',
    shortDescription: 'Professional mould detection and removal services to ensure a healthy living environment.',
  },
  {
    id: 'fire-damage',
    name: 'Fire Damage Restoration',
    shortDescription: 'Complete fire and smoke damage restoration services to help recover your property.',
  },
  {
    id: 'sewage-cleanup',
    name: 'Sewage Cleanup',
    shortDescription: 'Safe and thorough sewage cleanup and sanitization services for your property.',
  },
  {
    id: 'emergency-response',
    name: 'Emergency Response',
    shortDescription: '24/7 emergency response services for immediate assistance when disaster strikes.',
  }
];
