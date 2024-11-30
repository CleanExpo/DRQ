import { render, screen, fireEvent } from '@testing-library/react';
import AreasPage, { metadata } from '../page';
import { SERVICE_REGIONS } from '../../../../services/types/IServiceArea';

// Mock useEmergency hook
jest.mock('../../../../hooks/useEmergency', () => ({
  useEmergency: () => ({
    alerts: [
      {
        id: 'test-alert-1',
        message: 'Test alert for Brisbane',
        severity: 'HIGH',
        location: 'Brisbane',
        timestamp: new Date().toISOString()
      }
    ]
  })
}));

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
}));

describe('AreasPage', () => {
  describe('Metadata', () => {
    it('should have correct SEO metadata', () => {
      expect(metadata.title).toBe('Service Areas | Disaster Recovery Queensland');
      expect(metadata.description).toContain('Find emergency restoration services');
      expect(metadata.openGraph).toBeDefined();
    });

    it('should have proper OpenGraph metadata', () => {
      const og = metadata.openGraph;
      expect(og?.title).toBeDefined();
      expect(og?.description).toBeDefined();
      expect(og?.url).toBe('https://drq.com.au/areas');
      expect(og?.images).toBeDefined();
      expect(og?.locale).toBe('en_AU');
    });
  });

  describe('Layout and Structure', () => {
    beforeEach(() => {
      render(<AreasPage />);
    });

    it('should render page header', () => {
      expect(screen.getByText('Service Areas')).toBeInTheDocument();
      expect(screen.getByText('Find emergency restoration services in your area')).toBeInTheDocument();
    });

    it('should render search section', () => {
      expect(screen.getByTestId('suburb-search-toggle')).toBeInTheDocument();
      expect(screen.getByTestId('postcode-search-toggle')).toBeInTheDocument();
      expect(screen.getByTestId('search-input')).toBeInTheDocument();
    });

    it('should render all region cards', () => {
      SERVICE_REGIONS.forEach(region => {
        expect(screen.getByTestId(`region-card-${region.id}`)).toBeInTheDocument();
      });
    });
  });

  describe('Search Functionality', () => {
    beforeEach(() => {
      render(<AreasPage />);
    });

    it('should filter regions by suburb search', () => {
      const searchInput = screen.getByTestId('search-input');
      fireEvent.change(searchInput, { target: { value: 'Brisbane CBD' } });

      expect(screen.getByTestId('region-card-brisbane')).toBeInTheDocument();
      expect(screen.queryByTestId('region-card-gold-coast')).not.toBeInTheDocument();
    });

    it('should filter regions by postcode search', () => {
      // Switch to postcode search
      fireEvent.click(screen.getByTestId('postcode-search-toggle'));
      const searchInput = screen.getByTestId('search-input');
      fireEvent.change(searchInput, { target: { value: '4000' } });

      expect(screen.getByTestId('region-card-brisbane')).toBeInTheDocument();
      expect(screen.queryByTestId('region-card-gold-coast')).not.toBeInTheDocument();
    });

    it('should show no results message when no matches found', () => {
      const searchInput = screen.getByTestId('search-input');
      fireEvent.change(searchInput, { target: { value: 'NonexistentSuburb' } });

      expect(screen.getByTestId('no-results')).toBeInTheDocument();
    });

    it('should toggle between suburb and postcode search', () => {
      const postcodeToggle = screen.getByTestId('postcode-search-toggle');
      const suburbToggle = screen.getByTestId('suburb-search-toggle');

      // Initial state
      expect(suburbToggle).toHaveClass('bg-blue-600');
      expect(postcodeToggle).not.toHaveClass('bg-blue-600');

      // Switch to postcode
      fireEvent.click(postcodeToggle);
      expect(postcodeToggle).toHaveClass('bg-blue-600');
      expect(suburbToggle).not.toHaveClass('bg-blue-600');

      // Switch back to suburb
      fireEvent.click(suburbToggle);
      expect(suburbToggle).toHaveClass('bg-blue-600');
      expect(postcodeToggle).not.toHaveClass('bg-blue-600');
    });
  });

  describe('Region Cards', () => {
    beforeEach(() => {
      render(<AreasPage />);
    });

    it('should display region details correctly', () => {
      SERVICE_REGIONS.forEach(region => {
        const card = screen.getByTestId(`region-card-${region.id}`);
        
        // Check basic info
        expect(card).toHaveTextContent(region.name);
        expect(card).toHaveTextContent(region.responseTime);
        
        // Check suburbs
        region.suburbs.slice(0, 3).forEach(suburb => {
          expect(card).toHaveTextContent(suburb);
        });
        
        // Check services
        region.services.forEach(service => {
          expect(card).toHaveTextContent(service.name);
        });
      });
    });

    it('should display active alerts for regions', () => {
      expect(screen.getByTestId('region-alerts-brisbane')).toBeInTheDocument();
      expect(screen.queryByTestId('region-alerts-gold-coast')).not.toBeInTheDocument();
    });

    it('should have working links and buttons', () => {
      SERVICE_REGIONS.forEach(region => {
        expect(screen.getByTestId(`region-details-link-${region.id}`))
          .toHaveAttribute('href', `/areas/${region.id}`);
        expect(screen.getByTestId(`region-contact-${region.id}`))
          .toHaveAttribute('href', `tel:${region.contactNumber}`);
      });
    });

    it('should display coverage information', () => {
      SERVICE_REGIONS.forEach(region => {
        if (region.coverage) {
          const card = screen.getByTestId(`region-card-${region.id}`);
          expect(card).toHaveTextContent(`Coverage: ${region.coverage.radius}km radius`);
        }
      });
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive classes', () => {
      render(<AreasPage />);

      // Regions grid
      const regionsGrid = screen.getByTestId('regions-grid');
      expect(regionsGrid.className).toContain('grid-cols-1 md:grid-cols-2 lg:grid-cols-3');

      // Services grid in region cards
      const servicesGrids = document.querySelectorAll('.grid.grid-cols-2');
      expect(servicesGrids.length).toBeGreaterThan(0);
    });
  });

  describe('Error States', () => {
    it('should handle empty regions gracefully', () => {
      // Mock empty regions
      jest.spyOn(Array.prototype, 'filter').mockReturnValueOnce([]);
      render(<AreasPage />);

      expect(screen.getByTestId('no-results')).toBeInTheDocument();
    });

    it('should handle missing region data gracefully', () => {
      const incompleteRegion = {
        ...SERVICE_REGIONS[0],
        suburbs: undefined,
        services: undefined
      };

      // Mock incomplete region
      jest.spyOn(Array.prototype, 'filter').mockReturnValueOnce([incompleteRegion]);
      render(<AreasPage />);

      expect(screen.getByTestId(`region-card-${incompleteRegion.id}`)).toBeInTheDocument();
    });
  });
});
