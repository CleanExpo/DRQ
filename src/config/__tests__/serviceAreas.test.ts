import { 
  serviceAreas, 
  getServiceArea, 
  getAllServiceAreas, 
  getNearestServiceArea,
  isWithinServiceArea
} from '../serviceAreas';

describe('Service Areas Configuration', () => {
  it('should have all major service regions', () => {
    const areas = getAllServiceAreas();
    const expectedRegions = [
      'Redlands',
      'Brisbane City',
      'Western Suburbs',
      'Scenic Rim',
      'Lockyer Valley',
      'Logan',
      'Springfield',
      'Inner Brisbane'
    ];
    
    expectedRegions.forEach(region => {
      expect(areas.some(area => area.name === region)).toBe(true);
    });
  });

  it('should get a specific service area by slug', () => {
    const brisbaneCity = getServiceArea('brisbane-city');
    expect(brisbaneCity).toBeDefined();
    expect(brisbaneCity?.name).toBe('Brisbane City');
    expect(brisbaneCity?.regions.length).toBeGreaterThan(0);
  });

  it('should return undefined for invalid service area slug', () => {
    const invalid = getServiceArea('invalid-area');
    expect(invalid).toBeUndefined();
  });

  it('should find nearest service area', () => {
    // Test coordinates in Brisbane City
    const nearBrisbaneCity = getNearestServiceArea(-27.4698, 153.0251);
    expect(nearBrisbaneCity.name).toBe('Brisbane City');

    // Test coordinates in Logan
    const nearLogan = getNearestServiceArea(-27.6389, 153.1073);
    expect(nearLogan.name).toBe('Logan');
  });

  it('should check if coordinates are within service area', () => {
    const brisbaneCity = getServiceArea('brisbane-city');
    if (!brisbaneCity) throw new Error('Brisbane City service area not found');

    // Test point within Brisbane City service area
    expect(isWithinServiceArea(-27.4698, 153.0251, brisbaneCity)).toBe(true);

    // Test point outside Brisbane City service area (somewhere in Sydney)
    expect(isWithinServiceArea(-33.8688, 151.2093, brisbaneCity)).toBe(false);
  });

  it('should have required properties for each service area', () => {
    const areas = getAllServiceAreas();
    
    areas.forEach(area => {
      expect(area).toHaveProperty('name');
      expect(area).toHaveProperty('slug');
      expect(area).toHaveProperty('coordinates');
      expect(area).toHaveProperty('emergencyResponseTime');
      expect(area).toHaveProperty('serviceRadius');
      expect(area).toHaveProperty('regions');
      expect(area).toHaveProperty('serviceAvailability');
      expect(area.coordinates).toHaveProperty('lat');
      expect(area.coordinates).toHaveProperty('lng');
    });
  });

  it('should have valid response times for each service area', () => {
    const areas = getAllServiceAreas();
    
    areas.forEach(area => {
      expect(area.serviceAvailability.responseTime.emergency).toMatch(/^\d{1,2}(-\d{1,2})?\s+minutes$/);
      expect(area.serviceAvailability.responseTime.standard).toBe('24 hours');
    });
  });

  it('should have primary services defined for regions', () => {
    const areas = getAllServiceAreas();
    
    areas.forEach(area => {
      area.regions.forEach(region => {
        expect(region.primaryServices).toBeDefined();
        expect(region.primaryServices?.length).toBeGreaterThan(0);
      });
    });
  });

  it('should have valid population data', () => {
    const areas = getAllServiceAreas();
    
    areas.forEach(area => {
      expect(area.population).toBeDefined();
      expect(typeof area.population).toBe('number');
      expect(area.population).toBeGreaterThan(0);
    });
  });

  it('should have primary hazards defined', () => {
    const areas = getAllServiceAreas();
    
    areas.forEach(area => {
      expect(area.primaryHazards).toBeDefined();
      expect(area.primaryHazards.length).toBeGreaterThan(0);
    });
  });

  it('should have at least two regions per service area', () => {
    const areas = getAllServiceAreas();
    
    areas.forEach(area => {
      expect(area.regions.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('should have valid service radius values', () => {
    const areas = getAllServiceAreas();
    
    areas.forEach(area => {
      expect(area.serviceRadius).toBeGreaterThan(0);
      expect(area.serviceRadius).toBeLessThanOrEqual(30); // Maximum 30km radius
    });
  });
});
