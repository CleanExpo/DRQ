/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, within } from '@testing-library/react';
import LocationPage from '../page';
import { getServiceArea } from '../../../../../config/serviceAreas';

// Mock the components
jest.mock('../../../../../components/seo/PageSEO', () => ({
  PageSEO: () => null
}));

jest.mock('../../../../../components/layout/Header/Header', () => ({
  Header: () => null
}));

jest.mock('../../../../../components/layout/Hero/Hero', () => ({
  Hero: () => null
}));

jest.mock('../../../../../components/sections/ServicesHighlight/ServicesHighlight', () => ({
  ServicesHighlight: () => null
}));

// Mock i18n config
jest.mock('../../../../../config/i18n.config', () => ({
  isValidLocale: jest.fn().mockReturnValue(true),
  getSupportedLocales: jest.fn().mockReturnValue(['en-AU', 'zh']),
  getAlternateLinks: jest.fn().mockReturnValue({
    'en-AU': '/service-areas/brisbane',
    'zh': '/zh/service-areas/brisbane'
  })
}));

describe('LocationPage', () => {
  const defaultProps = {
    params: {
      area: 'brisbane',
      locale: 'en-AU'
    }
  };

  // Mock console.error before tests
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });

  // Restore console.error after tests
  afterAll(() => {
    console.error = originalError;
  });

  it('renders the location page with service area information', () => {
    render(<LocationPage {...defaultProps} />);
    
    const serviceArea = getServiceArea('brisbane');
    expect(screen.getByText(`Service Areas in ${serviceArea?.name}`)).toBeInTheDocument();
    expect(screen.getByTestId('emergency-response-section')).toBeInTheDocument();
  });

  it('displays emergency response time information', () => {
    render(<LocationPage {...defaultProps} />);
    
    const serviceArea = getServiceArea('brisbane');
    const emergencySection = screen.getByTestId('emergency-response-section');
    
    expect(emergencySection).toHaveTextContent('Emergency Service');
    expect(emergencySection).toHaveTextContent('Standard Service');
    expect(emergencySection).toHaveTextContent(serviceArea!.serviceAvailability.responseTime.emergency);
    expect(emergencySection).toHaveTextContent(serviceArea!.serviceAvailability.responseTime.standard);
  });

  it('displays primary hazards section', () => {
    render(<LocationPage {...defaultProps} />);
    
    const serviceArea = getServiceArea('brisbane');
    const hazardsSection = screen.getByTestId('hazards-section');
    
    serviceArea?.primaryHazards?.forEach(hazard => {
      const capitalizedHazard = hazard.charAt(0).toUpperCase() + hazard.slice(1);
      expect(hazardsSection).toHaveTextContent(capitalizedHazard);
    });
  });

  it('displays regions with their services and suburbs', () => {
    render(<LocationPage {...defaultProps} />);
    
    const serviceArea = getServiceArea('brisbane');
    serviceArea?.regions.forEach((region, index) => {
      const regionSection = screen.getByTestId(`region-${index}`);
      
      // Region name
      expect(regionSection).toHaveTextContent(region.name);

      // Primary services
      if (region.primaryServices) {
        const servicesSection = screen.getByTestId(`primary-services-${index}`);
        const servicesList = within(servicesSection).getAllByRole('listitem');
        expect(servicesList).toHaveLength(region.primaryServices.length);
        region.primaryServices.forEach((service, i) => {
          expect(servicesList[i]).toHaveTextContent(service);
        });
      }

      // Response times
      if (region.responseTimesByService) {
        const responseTimes = screen.getByTestId(`response-times-${index}`);
        Object.entries(region.responseTimesByService).forEach(([service, time]) => {
          const responseItem = within(responseTimes).getByText(new RegExp(`${service}:`));
          expect(responseItem.nextElementSibling).toHaveTextContent(time);
        });
      }

      // Suburbs
      const suburbsSection = screen.getByTestId(`suburbs-${index}`);
      const suburbsList = within(suburbsSection).getAllByRole('listitem');
      expect(suburbsList).toHaveLength(region.suburbs.length);
      region.suburbs.forEach((suburb, i) => {
        expect(suburbsList[i]).toHaveTextContent(suburb);
      });
    });
  });

  it('displays historical events when available', () => {
    render(<LocationPage {...defaultProps} />);
    
    const serviceArea = getServiceArea('brisbane');
    serviceArea?.regions.forEach((region, index) => {
      if (region.historicalEvents && region.historicalEvents.length > 0) {
        const eventsSection = screen.getByTestId(`historical-events-${index}`);
        const eventsList = within(eventsSection).getAllByRole('listitem');
        expect(eventsList).toHaveLength(region.historicalEvents.length);
        region.historicalEvents.forEach((event, i) => {
          expect(eventsList[i]).toHaveTextContent(event.description);
          expect(eventsList[i]).toHaveTextContent(`Severity: ${event.severity}/5`);
        });
      }
    });
  });

  it('handles invalid service area gracefully', () => {
    const { container } = render(
      <LocationPage params={{ area: 'invalid-area', locale: 'en-AU' }} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('handles invalid locale gracefully', () => {
    render(
      <LocationPage params={{ area: 'brisbane', locale: 'invalid-locale' }} />
    );
    
    const serviceArea = getServiceArea('brisbane');
    expect(screen.getByText(`Service Areas in ${serviceArea?.name}`)).toBeInTheDocument();
  });

  it('generates correct static params', async () => {
    const { generateStaticParams } = require('../page');
    const params = await generateStaticParams();

    // Should generate params for each service area and locale combination
    expect(params).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          area: 'brisbane',
          locale: 'en-AU'
        }),
        expect.objectContaining({
          area: 'brisbane',
          locale: 'zh'
        })
      ])
    );
  });

  it('displays all required sections for each region', () => {
    render(<LocationPage {...defaultProps} />);
    
    const serviceArea = getServiceArea('brisbane');
    serviceArea?.regions.forEach((_, index) => {
      expect(screen.getByTestId(`region-${index}`)).toBeInTheDocument();
      expect(screen.getByTestId(`suburbs-${index}`)).toBeInTheDocument();
      
      // Optional sections based on data availability
      if (screen.queryByTestId(`primary-services-${index}`)) {
        expect(screen.getByTestId(`primary-services-${index}`)).toBeInTheDocument();
      }
      if (screen.queryByTestId(`response-times-${index}`)) {
        expect(screen.getByTestId(`response-times-${index}`)).toBeInTheDocument();
      }
      if (screen.queryByTestId(`historical-events-${index}`)) {
        expect(screen.getByTestId(`historical-events-${index}`)).toBeInTheDocument();
      }
    });
  });
});
