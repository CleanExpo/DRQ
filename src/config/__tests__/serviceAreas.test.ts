import { 
  serviceAreas, 
  getServiceArea, 
  getAllServiceAreas, 
  getNearestServiceArea,
  isWithinServiceArea
} from '../serviceAreas';

describe('Service Areas Configuration', () => {
  it('should have all major Queensland regions', () => {
    const areas = getAllServiceAreas();
    const expectedRegions = ['Brisbane', 'Gold Coast', 'Sunshine Coast', 'Cairns'];
    
    expectedRegions.forEach(region => {
      expect(areas.some(area => area.name === region)).toBe(true);
    });
  });

  it('should get a specific service area by slug', () => {
    const brisbane = getServiceArea('brisbane');
    expect(brisbane).toBeDefined();
    expect(brisbane?.name).toBe('Brisbane');
    expect(brisbane?.regions.length).toBeGreaterThan(0);
  });

  it('should return undefined for invalid service area slug', () => {
    const invalid = getServiceArea('invalid-area');
    expect(invalid).toBeUndefined();
  });

  it('should find nearest service area', () => {
    // Test coordinates near Brisbane
    const nearBrisbane = getNearestServiceArea(-27.4698, 153.0251);
    expect(nearBrisbane.name).toBe('Brisbane');

    // Test coordinates near Gold Coast
    const nearGoldCoast = getNearestServiceArea(-28.0167, 153.4000);
    expect(nearGoldCoast.name).toBe('Gold Coast');
  });

  it('should check if coordinates are within service area', () => {
    const brisbane = getServiceArea('brisbane');
    if (!brisbane) throw new Error('Brisbane service area not found');

    // Test point within Brisbane service area
    expect(isWithinServiceArea(-27.4698, 153.0251, brisbane)).toBe(true);

    // Test point outside Brisbane service area (somewhere in Sydney)
    expect(isWithinServiceArea(-33.8688, 151.2093, brisbane)).toBe(false);
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
      expect(area.serviceAvailability.responseTime.standard).toBeDefined();
    });
  });

  it('should have historical events for major regions', () => {
    const brisbane = getServiceArea('brisbane');
    expect(brisbane?.regions[0].historicalEvents?.length).toBeGreaterThan(0);
    
    const goldCoast = getServiceArea('goldCoast');
    expect(goldCoast?.regions[0].historicalEvents?.length).toBeGreaterThan(0);
  });

  it('should have valid service-specific response times', () => {
    const brisbane = getServiceArea('brisbane');
    const brisbaneCBD = brisbane?.regions.find(r => r.name === 'Brisbane CBD');
    
    expect(brisbaneCBD?.responseTimesByService).toBeDefined();
    expect(brisbaneCBD?.responseTimesByService?.['Water Damage']).toBe('30 minutes');
    expect(brisbaneCBD?.responseTimesByService?.['Fire Damage']).toBe('45 minutes');
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
      expect(area.primaryHazards?.length).toBeGreaterThan(0);
    });
  });
});
