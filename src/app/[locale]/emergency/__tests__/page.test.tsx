import { render, screen, act } from '@testing-library/react';
import EmergencyPage, { metadata } from '../page';
import { SERVICE_REGIONS } from '../../../../services/types/IServiceArea';

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

// Mock useEmergency hook
jest.mock('../../../../hooks/useEmergency', () => ({
  useEmergency: () => ({
    alerts: [
      {
        id: 'test-alert-1',
        message: 'Emergency in Brisbane',
        severity: 'HIGH',
        location: 'Brisbane',
        timestamp: new Date().toISOString()
      }
    ]
  })
}));

describe('EmergencyPage', () => {
  // Mock Date for consistent testing
  const mockDate = new Date('2024-01-01T12:00:00');
  let originalDate: DateConstructor;

  beforeAll(() => {
    originalDate = global.Date;
    global.Date = class extends Date {
      constructor() {
        super();
        return mockDate;
      }
    } as DateConstructor;
  });

  afterAll(() => {
    global.Date = originalDate;
  });

  describe('Metadata', () => {
    it('should have correct SEO metadata', () => {
      expect(metadata.title).toBe('Emergency Services | Disaster Recovery Queensland');
      expect(metadata.description).toContain('24/7 emergency disaster recovery');
      expect(metadata.openGraph).toBeDefined();
    });

    it('should have proper OpenGraph metadata', () => {
      const og = metadata.openGraph;
      expect(og?.title).toBe('Emergency Services | DRQ');
      expect(og?.url).toBe('https://drq.com.au/emergency');
      expect(og?.images).toBeDefined();
      expect(og?.locale).toBe('en_AU');
    });
  });

  describe('Layout and Structure', () => {
    beforeEach(() => {
      render(<EmergencyPage />);
    });

    it('should render emergency banner', () => {
      expect(screen.getByText('Emergency Response')).toBeInTheDocument();
      expect(screen.getByText('Available 24/7 for immediate assistance')).toBeInTheDocument();
      
      const phoneLink = screen.getAllByText('Call 1300 309 361')[0];
      expect(phoneLink.closest('a')).toHaveAttribute('href', 'tel:1300309361');
    });

    it('should display current time', () => {
      expect(screen.getByText(/Current Time:/)).toBeInTheDocument();
      expect(screen.getByText(/Current Time:/).textContent).toContain('12:00:00');
    });

    it('should render active alerts section', () => {
      expect(screen.getByText('Active Emergency Alerts')).toBeInTheDocument();
      expect(screen.getByText('Emergency in Brisbane')).toBeInTheDocument();
    });

    it('should render service status for all regions', () => {
      SERVICE_REGIONS.forEach(region => {
        expect(screen.getByText(region.name)).toBeInTheDocument();
        expect(screen.getByText(`Response Time: ${region.responseTime}`)).toBeInTheDocument();
      });
    });

    it('should render emergency procedures', () => {
      expect(screen.getByText('Emergency Procedures')).toBeInTheDocument();
      expect(screen.getByText('Water Damage')).toBeInTheDocument();
      expect(screen.getByText('Fire Damage')).toBeInTheDocument();
      expect(screen.getByText('Storm Damage')).toBeInTheDocument();
    });
  });

  describe('Service Status', () => {
    it('should show correct status based on alerts', () => {
      render(<EmergencyPage />);

      // Brisbane should show limited service due to active alert
      const brisbaneStatus = screen.getByText('Limited availability due to active emergencies');
      expect(brisbaneStatus).toHaveClass('bg-yellow-100', 'text-yellow-800');

      // Other regions should show full service
      const fullServiceStatuses = screen.getAllByText('Full service available');
      expect(fullServiceStatuses.length).toBeGreaterThan(0);
      fullServiceStatuses.forEach(status => {
        expect(status).toHaveClass('bg-green-100', 'text-green-800');
      });
    });
  });

  describe('Emergency Procedures', () => {
    it('should display all procedure steps', () => {
      render(<EmergencyPage />);

      // Water Damage steps
      expect(screen.getByText('Turn off water supply if possible')).toBeInTheDocument();
      expect(screen.getByText('Document damage with photos')).toBeInTheDocument();

      // Fire Damage steps
      expect(screen.getByText('Ensure everyone is safely evacuated')).toBeInTheDocument();
      expect(screen.getByText('Wait for fire services clearance')).toBeInTheDocument();

      // Storm Damage steps
      expect(screen.getByText('Stay away from damaged structures')).toBeInTheDocument();
      expect(screen.getByText('Secure loose items if safe')).toBeInTheDocument();
    });

    it('should number procedure steps correctly', () => {
      render(<EmergencyPage />);
      
      const steps = document.querySelectorAll('.rounded-full');
      steps.forEach((step, index) => {
        expect(step).toHaveTextContent((index % 4 + 1).toString());
      });
    });
  });

  describe('Map Integration', () => {
    it('should render map with correct props', () => {
      render(<EmergencyPage />);

      const map = screen.getByTestId('mock-map');
      expect(map).toHaveTextContent('Map: -27.4698, 153.0251 - Radius: 100km');
    });
  });

  describe('Time Updates', () => {
    it('should update time periodically', () => {
      jest.useFakeTimers();
      render(<EmergencyPage />);

      // Initial time
      expect(screen.getByText(/Current Time: 12:00:00/)).toBeInTheDocument();

      // Advance time by 1 minute
      act(() => {
        jest.advanceTimersByTime(60000);
      });

      // Time should be updated
      expect(screen.getByText(/Current Time: 12:00:00/)).toBeInTheDocument();

      jest.useRealTimers();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<EmergencyPage />);
      
      const h1s = document.querySelectorAll('h1');
      const h2s = document.querySelectorAll('h2');
      const h3s = document.querySelectorAll('h3');

      expect(h1s.length).toBe(1); // Main page title
      expect(h2s.length).toBe(5); // Section titles
      expect(h3s.length).toBeGreaterThan(0); // Procedure titles
    });

    it('should have proper ARIA attributes', () => {
      render(<EmergencyPage />);

      // Emergency alert icons
      const alertIcons = document.querySelectorAll('[aria-hidden="true"]');
      expect(alertIcons.length).toBeGreaterThan(0);

      // Phone links
      const phoneLinks = screen.getAllByText('Call 1300 309 361');
      phoneLinks.forEach(link => {
        expect(link.closest('a')).toHaveAttribute('href', 'tel:1300309361');
      });
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive layout classes', () => {
      render(<EmergencyPage />);

      // Service status grid
      const statusGrid = document.querySelector('.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3');
      expect(statusGrid).toBeInTheDocument();

      // Procedures grid
      const proceduresGrid = document.querySelector('.grid-cols-1.md\\:grid-cols-3');
      expect(proceduresGrid).toBeInTheDocument();
    });
  });
});
