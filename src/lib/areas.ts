import { ServiceArea, PostcodeRange } from '../constants/areas';
import { ApiResponse } from '../types/api';

/**
 * Checks if a postcode is within a given range
 */
export function isPostcodeInRange(postcode: string, range: PostcodeRange): boolean {
  const postcodeNum = parseInt(postcode);
  const [min, max] = range;
  return postcodeNum >= parseInt(min) && postcodeNum <= parseInt(max);
}

/**
 * Checks if a postcode is in any of our service areas
 */
export function isServicedPostcode(postcode: string, ranges: Record<ServiceArea, PostcodeRange>): boolean {
  return Object.values(ranges).some(range => isPostcodeInRange(postcode, range));
}

/**
 * Gets all service areas that cover a given postcode
 */
export function getServiceAreasForPostcode(
  postcode: string,
  ranges: Record<ServiceArea, PostcodeRange>
): ServiceArea[] {
  return Object.entries(ranges)
    .filter(([_, range]) => isPostcodeInRange(postcode, range))
    .map(([area]) => area as ServiceArea);
}

/**
 * Validates a postcode format
 */
export function isValidPostcode(postcode: string): boolean {
  return /^\d{4}$/.test(postcode);
}

/**
 * Formats a postcode range for display
 */
export function formatPostcodeRange(range: PostcodeRange): string {
  const [min, max] = range;
  return min === max ? min : `${min}-${max}`;
}

/**
 * Gets the primary service area for a postcode
 * Returns the first matching area or undefined if none match
 */
export function getPrimaryServiceArea(
  postcode: string,
  ranges: Record<ServiceArea, PostcodeRange>
): ServiceArea | undefined {
  const entry = Object.entries(ranges).find(([_, range]) => 
    isPostcodeInRange(postcode, range)
  );
  return entry ? entry[0] as ServiceArea : undefined;
}

/**
 * Checks if an area services a specific postcode
 */
export function doesAreaServicePostcode(
  area: ServiceArea,
  postcode: string,
  ranges: Record<ServiceArea, PostcodeRange>
): boolean {
  const range = ranges[area];
  return range ? isPostcodeInRange(postcode, range) : false;
}

/**
 * Gets the coverage percentage for a service area
 * based on the range of postcodes it covers
 */
export function getAreaCoveragePercentage(
  area: ServiceArea,
  ranges: Record<ServiceArea, PostcodeRange>
): number {
  const range = ranges[area];
  if (!range) return 0;
  
  const [min, max] = range;
  const totalPostcodes = parseInt(max) - parseInt(min) + 1;
  const totalPossiblePostcodes = 9999 - 1000 + 1; // 1000-9999
  
  return Math.round((totalPostcodes / totalPossiblePostcodes) * 100);
}
