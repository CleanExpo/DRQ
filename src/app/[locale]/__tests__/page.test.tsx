import { render, screen } from '@testing-library/react';
import HomePage, { metadata } from '../page';

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

describe('HomePage', () => {
  describe('Metadata', () => {
    it('should have correct SEO metadata', () => {
      expect(metadata.title).toBe('Disaster Recovery Queensland | Professional Restoration Services');
      expect(metadata.description).toContain('Professional disaster recovery and restoration services');
      expect(metadata.openGraph).toBeDefined();
      expect(metadata.twitter).toBeDefined();
    });

    it('should have proper OpenGraph metadata', () => {
      const og = metadata.openGraph;
      expect(og?.title).toBeDefined();
      expect(og?.description).toBeDefined();
      expect(og?.url).toBe('https://drq.com.au');
      expect(og?.images).toBeDefined();
      expect(og?.locale).toBe('en_AU');
    });
  });

  describe('Layout and Structure', () => {
    beforeEach(() => {
      render(<HomePage />);
    });

    it('should render hero section', () => {
      const heroSection = screen.getByTestId('hero-section');
      expect(heroSection).toBeInTheDocument();
      expect(screen.getByText('Disaster Recovery Queensland')).toBeInTheDocument();
      expect(screen.getByTestId('emergency-cta')).toHaveAttribute('href', '/contact');
      expect(screen.getByTestId('services-cta')).toHaveAttribute('href', '/services');
    });

    it('should render services section with all service cards', () => {
      const servicesSection = screen.getByTestId('services-section');
      expect(servicesSection).toBeInTheDocument();
      expect(screen.getByText('Our Recovery Services')).toBeInTheDocument();

      // Check all service cards
      expect(screen.getByTestId('service-card-0')).toBeInTheDocument();
      expect(screen.getByTestId('service-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('service-card-2')).toBeInTheDocument();

      // Verify service content
      expect(screen.getByText('Water Damage')).toBeInTheDocument();
      expect(screen.getByText('Fire Damage')).toBeInTheDocument();
      expect(screen.getByText('Storm Damage')).toBeInTheDocument();
    });

    it('should render contact information section', () => {
      const contactSection = screen.getByTestId('contact-section');
      expect(contactSection).toBeInTheDocument();

      // Check all contact items
      expect(screen.getByTestId('contact-item-0')).toBeInTheDocument(); // Phone
      expect(screen.getByTestId('contact-item-1')).toBeInTheDocument(); // Email
      expect(screen.getByTestId('contact-item-2')).toBeInTheDocument(); // Hours
      expect(screen.getByTestId('contact-item-3')).toBeInTheDocument(); // Location

      // Verify contact content
      expect(screen.getByText('1300 309 361')).toBeInTheDocument();
      expect(screen.getByText('admin@disasterrecoveryqld.au')).toBeInTheDocument();
      expect(screen.getByText('24/7 Service')).toBeInTheDocument();
      expect(screen.getByText('All Queensland Regions')).toBeInTheDocument();
    });

    it('should render CTA section', () => {
      const ctaSection = screen.getByTestId('cta-section');
      expect(ctaSection).toBeInTheDocument();
      expect(screen.getByText('Need Emergency Assistance?')).toBeInTheDocument();
      expect(screen.getByTestId('emergency-contact-cta')).toHaveAttribute('href', '/contact');
    });
  });

  describe('Links and Navigation', () => {
    beforeEach(() => {
      render(<HomePage />);
    });

    it('should have working service links', () => {
      const serviceLinks = screen.getAllByText('Learn More');
      expect(serviceLinks[0].closest('a')).toHaveAttribute('href', '/services/water-damage');
      expect(serviceLinks[1].closest('a')).toHaveAttribute('href', '/services/fire-damage');
      expect(serviceLinks[2].closest('a')).toHaveAttribute('href', '/services/flood-recovery');
    });

    it('should have working contact links', () => {
      expect(screen.getByText('1300 309 361').closest('a'))
        .toHaveAttribute('href', 'tel:1300309361');
      expect(screen.getByText('admin@disasterrecoveryqld.au').closest('a'))
        .toHaveAttribute('href', 'mailto:admin@disasterrecoveryqld.au');
      expect(screen.getByText('All Queensland Regions').closest('a'))
        .toHaveAttribute('href', '/areas');
    });

    it('should have working CTA buttons', () => {
      const emergencyButtons = screen.getAllByText(/Emergency/i);
      emergencyButtons.forEach(button => {
        const link = button.closest('a');
        expect(link).toHaveAttribute('href', '/contact');
      });
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive classes', () => {
      render(<HomePage />);
      
      // Hero text
      const heroText = screen.getByText('Disaster Recovery Queensland');
      expect(heroText.className).toContain('md:text-6xl');

      // Services grid
      const servicesSection = screen.getByTestId('services-section');
      expect(servicesSection.querySelector('.grid')?.className)
        .toContain('grid-cols-1 md:grid-cols-3');

      // Contact info grid
      const contactSection = screen.getByTestId('contact-section');
      expect(contactSection.querySelector('.grid')?.className)
        .toContain('grid-cols-1 md:grid-cols-2 lg:grid-cols-4');
    });
  });
});
