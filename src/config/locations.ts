export const locationStructure = {
  brisbane: {
    name: "Brisbane",
    regions: [
      {
        id: "brisbane-cbd",
        name: "Brisbane CBD",
        suburbs: ["Brisbane City", "Spring Hill", "Fortitude Valley", "South Brisbane", "West End", "Kangaroo Point"],
        responseTime: "15-30 minutes",
        description: "Immediate response available in Brisbane CBD and inner city areas",
        features: ["24/7 Emergency Response", "Priority Service", "Rapid Response Team"]
      },
      {
        id: "brisbane-south",
        name: "Brisbane South",
        suburbs: ["Mount Gravatt", "Holland Park", "Sunnybank", "Carindale", "Mansfield", "Upper Mount Gravatt"],
        responseTime: "20-40 minutes",
        description: "Comprehensive coverage across Brisbane's southern suburbs",
        features: ["24/7 Emergency Response", "Local Teams", "Full Service Coverage"]
      },
      {
        id: "brisbane-west",
        name: "Brisbane West",
        suburbs: ["Indooroopilly", "Toowong", "St Lucia", "Chapel Hill", "Kenmore", "Moggill"],
        responseTime: "20-40 minutes",
        description: "Servicing Brisbane's western corridor",
        features: ["24/7 Emergency Response", "Local Teams", "Full Service Coverage"]
      },
      {
        id: "brisbane-north",
        name: "Brisbane North",
        suburbs: ["Chermside", "Aspley", "Kedron", "Nundah", "Stafford", "Albany Creek"],
        responseTime: "20-40 minutes",
        description: "Complete coverage of Brisbane's northern suburbs",
        features: ["24/7 Emergency Response", "Local Teams", "Full Service Coverage"]
      },
      {
        id: "brisbane-east",
        name: "Brisbane East",
        suburbs: ["Wynnum", "Manly", "Capalaba", "Cleveland", "Victoria Point", "Wellington Point"],
        responseTime: "20-40 minutes",
        description: "Servicing Brisbane's bayside and eastern suburbs",
        features: ["24/7 Emergency Response", "Local Teams", "Full Service Coverage"]
      },
      {
        id: "brisbane-central",
        name: "Brisbane Central",
        suburbs: ["New Farm", "Teneriffe", "Newstead", "Bowen Hills", "Kelvin Grove", "Paddington"],
        responseTime: "15-30 minutes",
        description: "Quick response times in Brisbane's inner suburbs",
        features: ["24/7 Emergency Response", "Priority Service", "Rapid Response Team"]
      }
    ],
    serviceCenter: "Brisbane CBD",
    emergencyContact: "1300 309 361",
    availability: "24/7"
  },
  ipswich: {
    name: "Ipswich",
    regions: [
      {
        id: "ipswich-city",
        name: "Ipswich City",
        suburbs: ["Ipswich Central", "Booval", "Bundamba", "Goodna", "Springfield", "Redbank"],
        responseTime: "25-45 minutes",
        description: "Servicing greater Ipswich metropolitan area",
        features: ["24/7 Emergency Response", "Local Teams", "Full Service Coverage"]
      },
      {
        id: "ipswich-country",
        name: "Ipswich Country",
        suburbs: ["Karalee", "Karana Downs", "Mount Crosby", "Pine Mountain", "Marburg"],
        responseTime: "30-50 minutes",
        description: "Coverage extending to Ipswich's outer regions",
        features: ["24/7 Emergency Response", "Rural Service", "Extended Coverage"]
      },
      {
        id: "lockyer-valley",
        name: "Lockyer Valley",
        suburbs: ["Gatton", "Laidley", "Forest Hill", "Plainland", "Grantham"],
        responseTime: "35-55 minutes",
        description: "Servicing the Lockyer Valley region",
        features: ["24/7 Emergency Response", "Rural Service", "Extended Coverage"]
      },
      {
        id: "scenic-rim",
        name: "Scenic Rim",
        suburbs: ["Beaudesert", "Boonah", "Kalbar", "Kooralbyn", "Tamborine"],
        responseTime: "35-55 minutes",
        description: "Coverage throughout the Scenic Rim region",
        features: ["24/7 Emergency Response", "Rural Service", "Extended Coverage"]
      }
    ],
    serviceCenter: "Ipswich Central",
    emergencyContact: "1300 309 361",
    availability: "24/7"
  },
  logan: {
    name: "Logan",
    regions: [
      {
        id: "logan-central",
        name: "Logan Central",
        suburbs: ["Logan Central", "Woodridge", "Springwood", "Daisy Hill", "Shailer Park"],
        responseTime: "25-45 minutes",
        description: "Servicing Logan City and surrounding areas",
        features: ["24/7 Emergency Response", "Local Teams", "Full Service Coverage"]
      },
      {
        id: "logan-village",
        name: "Logan Village",
        suburbs: ["Logan Village", "Waterford", "Bethania", "Holmview", "Beenleigh"],
        responseTime: "30-50 minutes",
        description: "Coverage extending to Logan's outer regions",
        features: ["24/7 Emergency Response", "Local Teams", "Extended Coverage"]
      }
    ],
    serviceCenter: "Logan Central",
    emergencyContact: "1300 309 361",
    availability: "24/7"
  },
  redlands: {
    name: "Redland Shire",
    regions: [
      {
        id: "redlands",
        name: "Redlands",
        suburbs: ["Cleveland", "Capalaba", "Victoria Point", "Wellington Point", "Alexandra Hills"],
        responseTime: "25-45 minutes",
        description: "Complete coverage of the Redlands area",
        features: ["24/7 Emergency Response", "Local Teams", "Full Service Coverage"]
      }
    ],
    serviceCenter: "Cleveland",
    emergencyContact: "1300 309 361",
    availability: "24/7"
  },
  goldCoast: {
    name: "Gold Coast",
    regions: [
      {
        id: "gold-coast-central",
        name: "Gold Coast Central",
        suburbs: ["Surfers Paradise", "Broadbeach", "Main Beach", "Southport", "Bundall"],
        responseTime: "20-40 minutes",
        description: "Rapid response in Gold Coast central areas",
        features: ["24/7 Emergency Response", "Priority Service", "Rapid Response Team"]
      },
      {
        id: "gold-coast-hinterland",
        name: "Gold Coast Hinterland",
        suburbs: ["Mount Tamborine", "Canungra", "Mudgeeraba", "Nerang", "Highland Park"],
        responseTime: "30-50 minutes",
        description: "Servicing Gold Coast Hinterland regions",
        features: ["24/7 Emergency Response", "Rural Service", "Extended Coverage"]
      }
    ],
    serviceCenter: "Surfers Paradise",
    emergencyContact: "1300 309 361",
    availability: "24/7"
  }
} as const;

export type LocationId = keyof typeof locationStructure;
export type Region = typeof locationStructure[LocationId]["regions"][number];
export type RegionId = Region["id"];

// Helper functions
export function getLocation(locationId: LocationId) {
  return locationStructure[locationId];
}

export function getRegion(locationId: LocationId, regionId: RegionId) {
  return locationStructure[locationId].regions.find(r => r.id === regionId);
}

export function isSuburbServiced(suburb: string): { serviced: boolean; region?: Region; location?: LocationId } {
  for (const [locationId, location] of Object.entries(locationStructure)) {
    for (const region of location.regions) {
      if (region.suburbs.some(s => s.toLowerCase() === suburb.toLowerCase())) {
        return { serviced: true, region, location: locationId as LocationId };
      }
    }
  }
  return { serviced: false };
}

export function getResponseTime(suburb: string): string | null {
  const result = isSuburbServiced(suburb);
  return result.serviced ? result.region!.responseTime : null;
}
