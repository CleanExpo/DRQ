/**
 * Geographic boundaries of our service coverage area
 */
export const SERVICE_BOUNDARIES = {
  north: 'Moreton Bay',
  south: 'Tweed Heads',
  west: 'Ipswich',
  east: 'Pacific Ocean'
} as const;

/**
 * Service radius limits from central business districts
 */
export const SERVICE_RADIUS = {
  standardKm: 50,
  maxKm: 75
} as const;

/**
 * Service coverage types and their descriptions
 */
export const COVERAGE_TYPES = {
  standard: {
    name: 'Standard Coverage',
    description: 'Areas within our standard 50km service radius',
    responseTime: '20-40 minutes'
  },
  priority: {
    name: 'Priority Coverage',
    description: 'High-priority areas with expedited response times',
    responseTime: '15-30 minutes'
  },
  extended: {
    name: 'Extended Coverage',
    description: 'Areas between 50-75km requiring additional travel time',
    responseTime: '25-45 minutes'
  }
} as const;
