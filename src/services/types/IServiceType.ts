export interface ServiceProcess {
  id: string;
  title: string;
  description: string;
  timeEstimate: string;
  priority: number;
}

export interface ServiceBenefit {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface ServiceType {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  icon: string;
  emergencyResponse: boolean;
  responseTime: string;
  processes: ServiceProcess[];
  benefits: ServiceBenefit[];
  imageUrl: string;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export const SERVICE_TYPES: Record<string, ServiceType> = {
  'water-damage': {
    id: 'water-damage',
    name: 'Water Damage Restoration',
    slug: 'water-damage',
    shortDescription: 'Emergency water extraction and structural drying',
    longDescription: `Our water damage restoration service provides immediate response to flooding, leaks, and water damage emergencies. Using advanced equipment and techniques, we extract water, dry affected areas, and prevent mold growth to protect your property.`,
    icon: 'droplet',
    emergencyResponse: true,
    responseTime: '1-2 hours',
    processes: [
      {
        id: 'assessment',
        title: 'Damage Assessment',
        description: 'Thorough inspection and documentation of water damage',
        timeEstimate: '30-60 minutes',
        priority: 1
      },
      {
        id: 'water-extraction',
        title: 'Water Extraction',
        description: 'Removal of standing water using professional equipment',
        timeEstimate: '2-4 hours',
        priority: 2
      },
      {
        id: 'drying',
        title: 'Structural Drying',
        description: 'Complete drying of affected areas using industrial dehumidifiers',
        timeEstimate: '2-3 days',
        priority: 3
      },
      {
        id: 'restoration',
        title: 'Restoration',
        description: 'Repair and restoration of damaged areas',
        timeEstimate: '1-5 days',
        priority: 4
      }
    ],
    benefits: [
      {
        id: 'prevent-mold',
        title: 'Prevent Mold Growth',
        description: 'Quick response prevents harmful mold development',
        icon: 'shield'
      },
      {
        id: 'save-property',
        title: 'Save Property',
        description: 'Minimize damage to structure and contents',
        icon: 'home'
      },
      {
        id: 'health-safety',
        title: 'Health Protection',
        description: 'Ensure safe and healthy environment',
        icon: 'heart'
      }
    ],
    imageUrl: '/images/services/water-damage.jpg',
    faqs: [
      {
        question: 'How quickly should water damage be addressed?',
        answer: 'Water damage should be addressed immediately, ideally within the first 24-48 hours, to prevent mold growth and structural damage.'
      },
      {
        question: 'What causes water damage?',
        answer: 'Water damage can be caused by flooding, burst pipes, roof leaks, sewage backups, and appliance malfunctions.'
      },
      {
        question: 'Is water damage covered by insurance?',
        answer: 'Most insurance policies cover sudden and accidental water damage, but coverage varies. We can assist with insurance claims.'
      }
    ]
  },
  'fire-damage': {
    id: 'fire-damage',
    name: 'Fire & Smoke Damage',
    slug: 'fire-damage',
    shortDescription: 'Complete fire and smoke damage restoration',
    longDescription: `Our fire damage restoration service provides comprehensive recovery from fire and smoke damage. We handle everything from initial assessment to complete restoration, including smoke odor removal and structural repairs.`,
    icon: 'flame',
    emergencyResponse: true,
    responseTime: '1-2 hours',
    processes: [
      {
        id: 'security',
        title: 'Property Security',
        description: 'Secure property from further damage',
        timeEstimate: '1-2 hours',
        priority: 1
      },
      {
        id: 'assessment',
        title: 'Damage Assessment',
        description: 'Evaluate fire and smoke damage extent',
        timeEstimate: '1-2 hours',
        priority: 2
      },
      {
        id: 'cleanup',
        title: 'Cleanup & Removal',
        description: 'Remove debris and damaged materials',
        timeEstimate: '1-3 days',
        priority: 3
      },
      {
        id: 'restoration',
        title: 'Restoration',
        description: 'Repair and restore damaged areas',
        timeEstimate: '5-14 days',
        priority: 4
      }
    ],
    benefits: [
      {
        id: 'quick-response',
        title: 'Fast Response',
        description: '24/7 emergency response to minimize damage',
        icon: 'clock'
      },
      {
        id: 'odor-removal',
        title: 'Complete Odor Removal',
        description: 'Eliminate smoke odors permanently',
        icon: 'wind'
      },
      {
        id: 'insurance-help',
        title: 'Insurance Assistance',
        description: 'Help with insurance claims process',
        icon: 'file-text'
      }
    ],
    imageUrl: '/images/services/fire-damage.jpg',
    faqs: [
      {
        question: 'What should I do immediately after a fire?',
        answer: 'First ensure everyone is safe, then contact emergency services and your insurance company. Do not enter the property until it\'s declared safe.'
      },
      {
        question: 'Can smoke damage be completely removed?',
        answer: 'Yes, with professional equipment and techniques, smoke damage and odors can be completely removed from both structure and contents.'
      },
      {
        question: 'How long does fire damage restoration take?',
        answer: 'The duration varies depending on damage extent, but typically ranges from a few days to several weeks for complete restoration.'
      }
    ]
  },
  'flood-recovery': {
    id: 'flood-recovery',
    name: 'Flood Recovery',
    slug: 'flood-recovery',
    shortDescription: 'Professional flood damage restoration',
    longDescription: `Our flood recovery service provides comprehensive solutions for properties affected by flooding. We handle water extraction, sanitization, drying, and restoration to return your property to pre-flood condition.`,
    icon: 'waves',
    emergencyResponse: true,
    responseTime: '1-2 hours',
    processes: [
      {
        id: 'safety',
        title: 'Safety Assessment',
        description: 'Evaluate structural safety and hazards',
        timeEstimate: '30-60 minutes',
        priority: 1
      },
      {
        id: 'extraction',
        title: 'Water Extraction',
        description: 'Remove flood water and debris',
        timeEstimate: '4-8 hours',
        priority: 2
      },
      {
        id: 'sanitization',
        title: 'Sanitization',
        description: 'Clean and disinfect affected areas',
        timeEstimate: '1-2 days',
        priority: 3
      },
      {
        id: 'restoration',
        title: 'Property Restoration',
        description: 'Repair and restore damaged areas',
        timeEstimate: '5-14 days',
        priority: 4
      }
    ],
    benefits: [
      {
        id: 'quick-response',
        title: 'Rapid Response',
        description: 'Fast action to minimize damage',
        icon: 'clock'
      },
      {
        id: 'complete-service',
        title: 'Complete Service',
        description: 'From extraction to restoration',
        icon: 'check-circle'
      },
      {
        id: 'health-protection',
        title: 'Health Protection',
        description: 'Proper sanitization and safety',
        icon: 'shield'
      }
    ],
    imageUrl: '/images/services/flood-recovery.jpg',
    faqs: [
      {
        question: 'Is flood water dangerous?',
        answer: 'Yes, flood water can be contaminated with sewage, chemicals, and debris. Professional handling is essential for safety.'
      },
      {
        question: 'How long does flood recovery take?',
        answer: 'Recovery time varies based on damage extent but typically takes 1-3 weeks for complete restoration.'
      },
      {
        question: 'What about mold after flooding?',
        answer: 'Quick action is crucial to prevent mold. We use professional drying equipment and techniques to prevent mold growth.'
      }
    ]
  },
  'mould-remediation': {
    id: 'mould-remediation',
    name: 'Mould Remediation',
    slug: 'mould-remediation',
    shortDescription: 'Professional mould removal and prevention',
    longDescription: `Our mould remediation service provides comprehensive mould removal and prevention solutions. We identify and address the root cause of mould growth while safely removing existing mould to protect your health and property.`,
    icon: 'bug',
    emergencyResponse: false,
    responseTime: '24-48 hours',
    processes: [
      {
        id: 'inspection',
        title: 'Mould Inspection',
        description: 'Identify mould extent and cause',
        timeEstimate: '1-2 hours',
        priority: 1
      },
      {
        id: 'containment',
        title: 'Containment Setup',
        description: 'Prevent mould spread during removal',
        timeEstimate: '2-4 hours',
        priority: 2
      },
      {
        id: 'removal',
        title: 'Mould Removal',
        description: 'Safe removal of mould-affected materials',
        timeEstimate: '1-3 days',
        priority: 3
      },
      {
        id: 'prevention',
        title: 'Prevention Measures',
        description: 'Address root causes and prevent recurrence',
        timeEstimate: '1-2 days',
        priority: 4
      }
    ],
    benefits: [
      {
        id: 'health',
        title: 'Health Protection',
        description: 'Remove harmful mould spores',
        icon: 'heart'
      },
      {
        id: 'prevention',
        title: 'Future Prevention',
        description: 'Stop mould from returning',
        icon: 'shield'
      },
      {
        id: 'expertise',
        title: 'Expert Service',
        description: 'Professional remediation methods',
        icon: 'award'
      }
    ],
    imageUrl: '/images/services/mould-remediation.jpg',
    faqs: [
      {
        question: 'Is all mould dangerous?',
        answer: 'While not all mould is toxic, any mould growth can cause health issues and should be professionally assessed.'
      },
      {
        question: 'How do you prevent mould from returning?',
        answer: 'We identify and address moisture sources, improve ventilation, and provide recommendations for ongoing prevention.'
      },
      {
        question: 'How long does mould remediation take?',
        answer: 'Most residential mould remediation projects take 3-7 days, depending on the extent of the mould growth.'
      }
    ]
  },
  'sewage-cleanup': {
    id: 'sewage-cleanup',
    name: 'Sewage Cleanup',
    slug: 'sewage-cleanup',
    shortDescription: 'Professional sewage removal and sanitization',
    longDescription: `Our sewage cleanup service provides safe and thorough removal of sewage contamination. We handle extraction, cleaning, sanitization, and restoration while ensuring proper safety protocols are followed.`,
    icon: 'trash',
    emergencyResponse: true,
    responseTime: '1-2 hours',
    processes: [
      {
        id: 'assessment',
        title: 'Safety Assessment',
        description: 'Evaluate contamination and hazards',
        timeEstimate: '30-60 minutes',
        priority: 1
      },
      {
        id: 'extraction',
        title: 'Sewage Removal',
        description: 'Safe removal of contaminated water',
        timeEstimate: '2-4 hours',
        priority: 2
      },
      {
        id: 'sanitization',
        title: 'Deep Sanitization',
        description: 'Professional cleaning and disinfection',
        timeEstimate: '1-2 days',
        priority: 3
      },
      {
        id: 'restoration',
        title: 'Area Restoration',
        description: 'Repair and restore affected areas',
        timeEstimate: '2-5 days',
        priority: 4
      }
    ],
    benefits: [
      {
        id: 'safety',
        title: 'Safe Removal',
        description: 'Professional hazard handling',
        icon: 'shield'
      },
      {
        id: 'sanitization',
        title: 'Complete Sanitization',
        description: 'Thorough disinfection process',
        icon: 'check-circle'
      },
      {
        id: 'prevention',
        title: 'Future Prevention',
        description: 'Address underlying issues',
        icon: 'tool'
      }
    ],
    imageUrl: '/images/services/sewage-cleanup.jpg',
    faqs: [
      {
        question: 'How dangerous is sewage backup?',
        answer: 'Sewage contains harmful bacteria and pathogens. Professional cleanup is essential for health and safety.'
      },
      {
        question: 'What causes sewage backup?',
        answer: 'Common causes include clogged pipes, tree root intrusion, system overload, and damaged sewer lines.'
      },
      {
        question: 'Is sewage damage covered by insurance?',
        answer: 'Many insurance policies cover sewage backup damage. We can assist with the claims process.'
      }
    ]
  },
  'commercial': {
    id: 'commercial',
    name: 'Commercial Services',
    slug: 'commercial',
    shortDescription: 'Specialized commercial property restoration',
    longDescription: `Our commercial restoration services are tailored for businesses and commercial properties. We provide rapid response and efficient solutions to minimize business interruption while ensuring thorough restoration.`,
    icon: 'building',
    emergencyResponse: true,
    responseTime: '1-2 hours',
    processes: [
      {
        id: 'assessment',
        title: 'Business Assessment',
        description: 'Evaluate damage and business impact',
        timeEstimate: '1-2 hours',
        priority: 1
      },
      {
        id: 'planning',
        title: 'Recovery Planning',
        description: 'Develop efficient restoration plan',
        timeEstimate: '2-4 hours',
        priority: 2
      },
      {
        id: 'execution',
        title: 'Restoration Work',
        description: 'Implement recovery solutions',
        timeEstimate: '1-14 days',
        priority: 3
      },
      {
        id: 'completion',
        title: 'Project Completion',
        description: 'Final inspection and handover',
        timeEstimate: '1-2 days',
        priority: 4
      }
    ],
    benefits: [
      {
        id: 'business-focus',
        title: 'Business Continuity',
        description: 'Minimize interruption',
        icon: 'briefcase'
      },
      {
        id: 'scale',
        title: 'Scalable Solutions',
        description: 'Handle any size project',
        icon: 'maximize'
      },
      {
        id: 'compliance',
        title: 'Industry Compliance',
        description: 'Meet all regulations',
        icon: 'check-square'
      }
    ],
    imageUrl: '/images/services/commercial.jpg',
    faqs: [
      {
        question: 'How do you minimize business interruption?',
        answer: 'We develop custom plans to work around your business operations and can provide after-hours service when needed.'
      },
      {
        question: 'Can you handle large commercial properties?',
        answer: 'Yes, we have the equipment and team to handle properties of any size, from small offices to large industrial facilities.'
      },
      {
        question: 'Do you provide documentation for insurance?',
        answer: 'Yes, we provide detailed documentation and work directly with insurance companies to streamline the claims process.'
      }
    ]
  }
};
