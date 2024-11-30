import type { ServiceArea } from '@/types/api'

// Mock service areas data
export const serviceAreas: ServiceArea[] = [
  {
    id: '1',
    name: 'Brisbane',
    postcode: '4000',
    active: true
  },
  {
    id: '2',
    name: 'Brisbane CBD',
    postcode: '4001',
    active: true
  },
  {
    id: '3',
    name: 'Ipswich',
    postcode: '4305',
    active: true
  },
  {
    id: '4',
    name: 'Logan',
    postcode: '4114',
    active: true
  },
  {
    id: '5',
    name: 'Gold Coast',
    postcode: '4217',
    active: true
  },
  {
    id: '6',
    name: 'Redlands',
    postcode: '4163',
    active: true
  }
]

// Helper function to check if a postcode is serviced
export function isServicedPostcode(postcode: string): boolean {
  return serviceAreas.some(area => 
    area.postcode === postcode && area.active
  )
}

// Helper function to get area by postcode
export function getAreaByPostcode(postcode: string): ServiceArea | undefined {
  return serviceAreas.find(area => area.postcode === postcode)
}

// Helper function to get area by id
export function getAreaById(id: string): ServiceArea | undefined {
  return serviceAreas.find(area => area.id === id)
}

// Helper function to get active areas
export function getActiveAreas(): ServiceArea[] {
  return serviceAreas.filter(area => area.active)
}
