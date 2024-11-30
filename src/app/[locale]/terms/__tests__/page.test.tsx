import { render, screen } from '@testing-library/react';
import TermsPage, { metadata } from '../page';

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
}));

describe('TermsPage', () => {
  describe('Metadata', () => {
    it('should have correct SEO metadata', () => {
      expect(metadata.title).toBe('Terms of Service | Disaster Recovery Queensland');
      expect(metadata.description).toContain('Terms and conditions');
      expect(metadata.openGraph).toBeDefined();
    });

    it('should have proper OpenGraph metadata', () => {
      const og = metadata.openGraph;
      expect(og?.title).toBe('Terms of Service | DRQ');
      expect(og?.url).toBe('https://drq.com.au/terms');
      expect(og?.locale).toBe('en_AU');
      expect(og?.type).toBe('website');
    });
  });

  describe('Layout and Structure', () => {
    beforeEach(() => {
      render(<TermsPage />);
    });

    it('should render page header', () => {
      expect(screen.getByText('Terms of Service')).toBeInTheDocument();
      expect(screen.getByText(/Last Updated:/)).toBeInTheDocument();
    });

    it('should format last updated date correctly', () => {
      const dateText = screen.getByText(/Last Updated:/).textContent;
      expect(dateText).toContain('January 15, 2024');
    });

    it('should render all main sections', () => {
      const sections = [
        'Introduction',
        'Service Terms',
        'Customer Responsibilities',
        'Insurance and Liability',
        'Privacy and Data',
        'Cancellation and Termination',
        'Dispute Resolution',
        'Changes to Terms',
        'Contact Information'
      ];

      sections.forEach(section => {
        expect(screen.getByText(new RegExp(section))).toBeInTheDocument();
      });
    });
  });

  describe('Content Sections', () => {
    beforeEach(() => {
      render(<TermsPage />);
    });

    it('should render service terms subsections', () => {
      expect(screen.getByText('2.1 Service Availability')).toBeInTheDocument();
      expect(screen.getByText('2.2 Service Quality')).toBeInTheDocument();
      expect(screen.getByText('2.3 Estimates and Quotes')).toBeInTheDocument();
    });

    it('should render customer responsibilities', () => {
      expect(screen.getByText('3.1 Access and Information')).toBeInTheDocument();
      expect(screen.getByText('3.2 Payment Terms')).toBeInTheDocument();
    });

    it('should render insurance and liability information', () => {
      expect(screen.getByText('4.1 Insurance Coverage')).toBeInTheDocument();
      expect(screen.getByText('4.2 Limitation of Liability')).toBeInTheDocument();
    });
  });

  describe('Related Links', () => {
    beforeEach(() => {
      render(<TermsPage />);
    });

    it('should render related information section', () => {
      expect(screen.getByText('Related Information')).toBeInTheDocument();
    });

    it('should have working links', () => {
      const links = [
        { text: 'Privacy Policy', href: '/privacy' },
        { text: 'Contact Us', href: '/contact' },
        { text: 'Frequently Asked Questions', href: '/faq' }
      ];

      links.forEach(link => {
        const element = screen.getByText(link.text);
        expect(element.closest('a')).toHaveAttribute('href', link.href);
      });
    });
  });

  describe('Contact Information', () => {
    beforeEach(() => {
      render(<TermsPage />);
    });

    it('should display contact details', () => {
      expect(screen.getByText('1300 309 361')).toBeInTheDocument();
      expect(screen.getByText('legal@disasterrecoveryqld.au')).toBeInTheDocument();
      expect(screen.getByText('PO Box 1234, Brisbane QLD 4000')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<TermsPage />);
      
      const h1s = document.querySelectorAll('h1');
      const h2s = document.querySelectorAll('h2');
      const h3s = document.querySelectorAll('h3');

      expect(h1s.length).toBe(1); // Main title
      expect(h2s.length).toBeGreaterThan(8); // Section headings
      expect(h3s.length).toBeGreaterThan(0); // Subsection headings

      // Check heading order
      const headings = Array.from(document.querySelectorAll('h1, h2, h3'));
      headings.reduce((prevLevel, heading) => {
        const currentLevel = parseInt(heading.tagName[1]);
        expect(currentLevel - prevLevel).toBeLessThanOrEqual(1);
        return currentLevel;
      }, 0);
    });

    it('should have proper list structure', () => {
      render(<TermsPage />);

      const lists = document.querySelectorAll('ul, ol');
      lists.forEach(list => {
        expect(list.children.length).toBeGreaterThan(0);
        Array.from(list.children).forEach(child => {
          expect(child.tagName.toLowerCase()).toBe('li');
        });
      });
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive layout classes', () => {
      render(<TermsPage />);

      // Header text
      expect(screen.getByText('Terms of Service').className)
        .toContain('text-4xl md:text-5xl');

      // Content container
      const container = document.querySelector('.max-w-4xl');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Content Formatting', () => {
    it('should use proper typography classes', () => {
      render(<TermsPage />);

      const mainContent = document.querySelector('.prose');
      expect(mainContent).toHaveClass('prose-lg');
    });

    it('should style links appropriately', () => {
      render(<TermsPage />);

      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link.className).toMatch(/text-blue-600|hover:text-blue-800/);
      });
    });
  });
});
