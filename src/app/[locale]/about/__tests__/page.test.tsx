import { render, screen } from '@testing-library/react';
import AboutPage, { metadata } from '../page';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />
}));

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
}));

describe('AboutPage', () => {
  describe('Metadata', () => {
    it('should have correct SEO metadata', () => {
      expect(metadata.title).toBe('About Us | Disaster Recovery Queensland');
      expect(metadata.description).toContain('Professional disaster recovery');
      expect(metadata.openGraph).toBeDefined();
    });

    it('should have proper OpenGraph metadata', () => {
      const og = metadata.openGraph;
      expect(og?.title).toBe('About Us | DRQ');
      expect(og?.url).toBe('https://drq.com.au/about');
      expect(og?.images).toBeDefined();
      expect(og?.locale).toBe('en_AU');
    });
  });

  describe('Layout and Structure', () => {
    beforeEach(() => {
      render(<AboutPage />);
    });

    it('should render hero section', () => {
      expect(screen.getByText('About Us')).toBeInTheDocument();
      expect(screen.getByText(/Queensland's trusted disaster recovery/)).toBeInTheDocument();
    });

    it('should render all statistics', () => {
      expect(screen.getByTestId('stat-0')).toHaveTextContent('15+Years Experience');
      expect(screen.getByTestId('stat-1')).toHaveTextContent('10,000+Emergency Responses');
      expect(screen.getByTestId('stat-2')).toHaveTextContent('50+Team Members');
      expect(screen.getByTestId('stat-3')).toHaveTextContent('100+Service Areas');
    });

    it('should render mission section', () => {
      expect(screen.getByText('Our Mission')).toBeInTheDocument();
      expect(screen.getByText(/To provide rapid, professional/)).toBeInTheDocument();
    });

    it('should render all company values', () => {
      expect(screen.getByTestId('value-0')).toHaveTextContent('24/7 Emergency Response');
      expect(screen.getByTestId('value-1')).toHaveTextContent('Professional Excellence');
      expect(screen.getByTestId('value-2')).toHaveTextContent('Customer-First Approach');
      expect(screen.getByTestId('value-3')).toHaveTextContent('Comprehensive Solutions');
    });

    it('should render all certifications', () => {
      expect(screen.getByText('IICRC Certified Firm')).toBeInTheDocument();
      expect(screen.getByText('ISO 9001:2015 Certified')).toBeInTheDocument();
      expect(screen.getByText('WorkCover Queensland Approved')).toBeInTheDocument();
      expect(screen.getByText('Master Builders Member')).toBeInTheDocument();
      expect(screen.getByText('Restoration Industry Association Member')).toBeInTheDocument();
    });
  });

  describe('Interactive Elements', () => {
    beforeEach(() => {
      render(<AboutPage />);
    });

    it('should have working contact links', () => {
      const phoneLink = screen.getByText('Call 1300 309 361');
      expect(phoneLink.closest('a')).toHaveAttribute('href', 'tel:1300309361');

      const contactLink = screen.getByText('Contact Us');
      expect(contactLink.closest('a')).toHaveAttribute('href', '/contact');
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive layout classes', () => {
      render(<AboutPage />);

      // Stats grid
      const statsGrid = screen.getByTestId('stat-0').parentElement;
      expect(statsGrid?.className).toContain('grid-cols-2 md:grid-cols-4');

      // Values grid
      const valuesGrid = screen.getByTestId('value-0').parentElement;
      expect(valuesGrid?.className).toContain('grid-cols-1 md:grid-cols-2 lg:grid-cols-4');

      // Certifications grid
      const certGrid = screen.getByTestId('certification-0').parentElement;
      expect(certGrid?.className).toContain('grid-cols-1 md:grid-cols-3');
    });
  });

  describe('Content Structure', () => {
    it('should organize content in logical sections', () => {
      render(<AboutPage />);

      const sections = document.querySelectorAll('section');
      expect(sections.length).toBe(6); // Hero, Stats, Mission, Values, Certifications, CTA

      // Verify section order
      expect(sections[0]).toHaveTextContent('About Us'); // Hero
      expect(sections[1]).toHaveTextContent('Years Experience'); // Stats
      expect(sections[2]).toHaveTextContent('Our Mission'); // Mission
      expect(sections[3]).toHaveTextContent('Our Values'); // Values
      expect(sections[4]).toHaveTextContent('Certifications & Memberships'); // Certifications
      expect(sections[5]).toHaveTextContent('Need Our Services?'); // CTA
    });

    it('should have proper heading hierarchy', () => {
      render(<AboutPage />);

      const h1s = document.querySelectorAll('h1');
      const h2s = document.querySelectorAll('h2');
      const h3s = document.querySelectorAll('h3');

      expect(h1s.length).toBe(1); // Main page title
      expect(h2s.length).toBe(4); // Section titles
      expect(h3s.length).toBe(4); // Value titles
    });
  });

  describe('Visual Elements', () => {
    it('should include icons for all stats and values', () => {
      render(<AboutPage />);

      // Check for stat icons
      const statIcons = document.querySelectorAll('[data-testid^="stat-"] svg');
      expect(statIcons.length).toBe(4);

      // Check for value icons
      const valueIcons = document.querySelectorAll('[data-testid^="value-"] svg');
      expect(valueIcons.length).toBe(4);

      // Check for certification checkmarks
      const certIcons = document.querySelectorAll('[data-testid^="certification-"] svg');
      expect(certIcons.length).toBe(5);
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(<AboutPage />);
      
      const headings = document.querySelectorAll('h1, h2, h3');
      const headingLevels = Array.from(headings).map(h => parseInt(h.tagName[1]));
      
      // Check if heading levels are sequential
      headingLevels.reduce((prev, current) => {
        expect(current - prev).toBeLessThanOrEqual(1);
        return current;
      });
    });

    it('should have proper contrast for text elements', () => {
      render(<AboutPage />);
      
      // Check hero text contrast
      const heroText = screen.getByText(/Queensland's trusted/);
      expect(heroText.className).toContain('text-white/90');

      // Check dark text contrast
      const missionText = screen.getByText(/To provide rapid/);
      expect(missionText.className).toContain('text-gray-600');
    });
  });
});
