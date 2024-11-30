export type ServiceArea = 
  | 'Brisbane'
  | 'Gold Coast'
  | 'Ipswich'
  | 'Logan'
  | 'Redland'
  | 'Scenic Rim'
  | 'Somerset'
  | 'Gold Coast Hinterland';

export type PostcodeRange = [string, string];

export const SERVICE_AREAS: ServiceArea[] = [
  'Brisbane',
  'Gold Coast',
  'Ipswich',
  'Logan',
  'Redland',
  'Scenic Rim',
  'Somerset',
  'Gold Coast Hinterland'
] as const;

export const POSTCODE_RANGES: Record<ServiceArea, PostcodeRange> = {
  'Brisbane': ['4000', '4999'],
  'Gold Coast': ['4200', '4299'],
  'Ipswich': ['4300', '4399'],
  'Logan': ['4100', '4199'],
  'Redland': ['4150', '4199'],
  'Scenic Rim': ['4200', '4299'],
  'Somerset': ['4300', '4399'],
  'Gold Coast Hinterland': ['4200', '4299']
} as const;
