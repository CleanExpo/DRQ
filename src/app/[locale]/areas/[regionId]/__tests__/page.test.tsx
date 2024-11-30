import { render, screen } from '@testing-library/react';
import AreaPage, { generateMetadata } from '../page';
import { SERVICE_REGIONS } from '../../../../../services/types/IServiceArea';
import { notFound } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  notFound: jest.fn()
}));

// Mock next/dynamic
jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: () => {
    return function MockRegionMap({ center, radius }: any) {
      return (
        <div data-testid="mock-map">
          Map: {center.lat}, {center.lng} - Radius: {radius}km
        </div>
      );
    };
  }
}));

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
}));

// Mock useEmergency hook
jest.mock('../../../../../hooks/useEmergency', () => ({
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

describe('AreaPage', () => {
  describe('Metadata Generation', () => {
    it('should generate correct metadata for valid region', async () => {
      const metadata = await generateMetadata({ 
        params: { regionId: 'brisbane' }
      });

      expect(metadata.title).toBe('Brisbane Service Area | Disaster Recovery Queensland');
      expect(metadata.description).toContain('Brisbane');
      expect(metadata.openGraph).toBeDefined();
      expect(metadata.openGraph?.url).toBe('https://drq.com.au/areas/brisbane');
    });

    it('should return empty metadata for invalid region', async () => {
      const metadata = await generateMetadata({ 
        params: { regionId: 'invalid-region' }
      });

      expect(metadata).toEqual({});
    });
  });

  describe('Page Rendering', () => {
    it('should render 404 for invalid region', () => {
      render(<AreaPage params={{ regionId: 'invalid-region' }} />);
      expect(notFound).toHaveBeenCalled();
    });

    it('should render region details correctly', () => {
      const regionId = 'brisbane';
      const region = SERVICE_REGIONS.find(r => r.id === regionId)!;

      render(<AreaPage params={{ regionId }} />);

      // Check header content
      expect(screen.getByText(region.name)).toBeInTheDocument();
      expect(screen.getByText(region.description!)).toBeInTheDocument();

      // Check map
      expect(screen.getByTestId('mock-map')).toBeInTheDocument();

      // Check contact information
      expect(screen.getByText('Emergency Response')).toBeInTheDocument();
      expect(screen.getByText(region.emergencyInfo!.primaryContact)).toBeInTheDocument();

      // Check response information
      expect(screen.getByText(region.responseTime)).toBeInTheDocument();
      expect(screen.getByText(`${region.coverage!.radius}km from city center`)).toBeInTheDocument();
    });

    it('should render active alerts', () => {
      render(<AreaPage params={{ regionId: 'brisbane' }} />);
      
      const alertsSection = screen.getByTestId('region-alerts');
      expect(alertsSection).toBeInTheDocument();
      expect(screen.getByText('Test alert for Brisbane')).toBeInTheDocument();
    });

    it('should not render alerts section when no alerts', () => {
      render(<AreaPage params={{ regionId: 'gold-coast' }} />);
      expect(screen.queryByTestId('region-alerts')).not.toBeInTheDocument();
    });
  });

  describe('Service Areas Display', () => {
    it('should display coverage boundaries', () => {
      const region = SERVICE_REGIONS.find(r => r.id === 'brisbane')!;
      render(<AreaPage params={{ regionId: 'brisbane' }} />);

      region.coverage!.boundaries!.forEach(boundary => {
        expect(screen.getByText(boundary)).toBeInTheDocument();
      });
    });

    it('should display all serviced suburbs', () => {
      const region = SERVICE_REGIONS.find(r => r.id === 'brisbane')!;
      render(<AreaPage params={{ regionId: 'brisbane' }} />);

      region.suburbs.forEach(suburb => {
        expect(screen.getByText(suburb)).toBeInTheDocument();
      });
    });
  });

  describe('Available Services', () => {
    it('should display all available services', () => {
      const region = SERVICE_REGIONS.find(r => r.id === 'brisbane')!;
      render(<AreaPage params={{ regionId: 'brisbane' }} />);

      region.services.forEach(service => {
        expect(screen.getByText(service.name)).toBeInTheDocument();
        expect(screen.getByText(service.shortDescription)).toBeInTheDocument();
      });
    });

    it('should have working service links', () => {
      const region = SERVICE_REGIONS.find(r => r.id === 'brisbane')!;
      render(<AreaPage params={{ regionId: 'brisbane' }} />);

      const links = screen.getAllByText('Learn More');
      links.forEach((link, index) => {
        expect(link.closest('a')).toHaveAttribute(
          'href',
          `/services/${region.services[index].slug}`
        );
      });
    });
  });

  describe('Contact Information', () => {
    it('should display all contact methods', () => {
      const region = SERVICE_REGIONS.find(r => r.id === 'brisbane')!;
      render(<AreaPage params={{ regionId: 'brisbane' }} />);

      expect(screen.getByText(region.emergencyInfo!.primaryContact)).toBeInTheDocument();
      expect(screen.getByText('admin@disasterrecoveryqld.au')).toBeInTheDocument();
    });

    it('should have working contact links', () => {
      const region = SERVICE_REGIONS.find(r => r.id === 'brisbane')!;
      render(<AreaPage params={{ regionId: 'brisbane' }} />);

      const phoneLinks = screen.getAllByText(region.contactNumber);
      phoneLinks.forEach(link => {
        expect(link.closest('a')).toHaveAttribute('href', `tel:${region.contactNumber}`);
      });

      const emailLink = screen.getByText('admin@disasterrecoveryqld.au');
      expect(emailLink.closest('a')).toHaveAttribute('href', 'mailto:admin@disasterrecoveryqld.au');
    });
  });

  describe('Navigation', () => {
    it('should have working back link', () => {
      render(<AreaPage params={{ regionId: 'brisbane' }} />);
      
      const backLink = screen.getByText('Back to Service Areas');
      expect(backLink.closest('a')).toHaveAttribute('href', '/areas');
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive layout classes', () => {
      render(<AreaPage params={{ regionId: 'brisbane' }} />);

      // Contact and Response grid
      const gridContainer = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2');
      expect(gridContainer).toBeInTheDocument();

      // Services grid
      const servicesGrid = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3');
      expect(servicesGrid).toBeInTheDocument();

      // Suburbs grid
      const suburbsGrid = document.querySelector('.grid.grid-cols-2.md\\:grid-cols-3.lg\\:grid-cols-4');
      expect(suburbsGrid).toBeInTheDocument();
    });
  });
});
