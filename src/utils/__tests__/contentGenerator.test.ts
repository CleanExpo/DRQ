import { 
  generateLocationContent, 
  generateServicePageContent 
} from '../contentGenerator';
import { serviceAreas } from '../../config/serviceAreas';
import { DisasterEvent } from '../../types/serviceTypes';

describe('Content Generator', () => {
  const mockHistoricalEvents: DisasterEvent[] = [
    {
      date: '2022-02-28',
      type: 'flood',
      description: 'Major flooding across Brisbane',
      severity: 4
    }
  ];

  describe('generateLocationContent', () => {
    it('generates content for water damage service in Brisbane', () => {
      const content = generateLocationContent({
        service: 'water-damage',
        location: 'brisbane',
        historicalEvents: mockHistoricalEvents,
        localFactors: [],
        locale: 'en-AU'
      });

      expect(content.title).toContain('Water Damage Restoration');
      expect(content.title).toContain('Brisbane');
      expect(content.metaDescription).toContain('water damage');
      expect(content.metaDescription).toContain('Brisbane');
      expect(content.heroContent.backgroundImage).toBe('/images/services/water-damage-hero.jpg');
      expect(content.mainContent.hazardInfo).toContain('flood');
      expect(content.mainContent.responseTimeInfo).toContain('30-60 minutes');
    });

    it('generates content for fire damage service in Gold Coast', () => {
      const content = generateLocationContent({
        service: 'fire-damage',
        location: 'goldCoast',
        historicalEvents: [],
        localFactors: [],
        locale: 'en-AU'
      });

      expect(content.title).toContain('Fire Damage Recovery');
      expect(content.title).toContain('Gold Coast');
      expect(content.metaDescription).toContain('fire damage');
      expect(content.heroContent.backgroundImage).toBe('/images/services/fire-damage-hero.jpg');
      expect(content.sections.suburbs).toEqual(
        expect.arrayContaining(['Surfers Paradise', 'Broadbeach'])
      );
    });

    it('includes historical events in content when available', () => {
      const content = generateLocationContent({
        service: 'water-damage',
        location: 'brisbane',
        historicalEvents: mockHistoricalEvents,
        localFactors: [],
        locale: 'en-AU'
      });

      expect(content.mainContent.localRelevance).toContain('Major flooding across Brisbane');
      expect(content.mainContent.localRelevance).toContain('Severity: 4/5');
    });

    it('handles service-specific hazard information', () => {
      const content = generateLocationContent({
        service: 'storm-damage',
        location: 'cairns',
        historicalEvents: [],
        localFactors: [],
        locale: 'en-AU'
      });

      expect(content.mainContent.hazardInfo).toContain('Cyclone damage');
      expect(content.mainContent.hazardInfo).toContain('storm');
      expect(content.sections.primaryHazards).toContain('cyclones');
    });
  });

  describe('generateServicePageContent', () => {
    it('generates service page content with proper structure', () => {
      const page = generateServicePageContent(
        'water-damage',
        'brisbane',
        mockHistoricalEvents,
        'en-AU'
      );

      expect(page.slug).toBe('water-damage-brisbane');
      expect(page.title).toContain('Water Damage Restoration');
      expect(page.metaDescription).toContain('Brisbane');
      expect(page.serviceDetails.features).toContain('Emergency water extraction');
      expect(page.locations[0].name).toBe('Brisbane');
      expect(page.locations[0].historicalEvents).toEqual(mockHistoricalEvents);
    });

    it('includes correct service area suburbs', () => {
      const page = generateServicePageContent(
        'water-damage',
        'brisbane',
        [],
        'en-AU'
      );

      const brisbaneArea = serviceAreas.brisbane;
      const expectedSuburbs = brisbaneArea.regions.flatMap(r => r.suburbs);

      expect(page.locations[0].serviceArea).toEqual(expect.arrayContaining(expectedSuburbs));
    });

    it('handles missing historical events gracefully', () => {
      const page = generateServicePageContent(
        'water-damage',
        'brisbane',
        undefined,
        'en-AU'
      );

      expect(page.locations[0].historicalEvents).toEqual([]);
      expect(page.serviceDetails.emergencyResponse).toBe(true);
    });

    it('includes service-specific features', () => {
      const page = generateServicePageContent(
        'mould',
        'brisbane',
        [],
        'en-AU'
      );

      expect(page.serviceDetails.features).toContain('Mould inspection');
      expect(page.serviceDetails.features).toContain('Air quality testing');
    });
  });

  describe('content localization', () => {
    it('defaults to en-AU for unsupported locales', () => {
      const content = generateLocationContent({
        service: 'water-damage',
        location: 'brisbane',
        historicalEvents: [],
        localFactors: [],
        locale: 'unsupported' as any
      });

      expect(content.title).toContain('Water Damage Restoration');
    });

    it('handles date formatting based on locale', () => {
      const content = generateLocationContent({
        service: 'water-damage',
        location: 'brisbane',
        historicalEvents: mockHistoricalEvents,
        localFactors: [],
        locale: 'en-AU'
      });

      expect(content.mainContent.localRelevance).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });
  });
});
