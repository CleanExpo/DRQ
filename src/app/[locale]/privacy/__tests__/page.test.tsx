import { render, screen } from '@testing-library/react';
import PrivacyPage, { metadata } from '../page';

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
}));

describe('PrivacyPage', () => {
  describe('Metadata', () => {
    it('should have correct SEO metadata', () => {
      expect(metadata.title).toBe('Privacy Policy | Disaster Recovery Queensland');
      expect(metadata.description).toContain('Learn how DRQ collects');
      expect(metadata.openGraph).toBeDefined();
    });

    it('should have proper OpenGraph metadata', () => {
      const og = metadata.openGraph;
      expect(og?.title).toBe('Privacy Policy | DRQ');
      expect(og?.url).toBe('https://drq.com.au/privacy');
      expect(og?.locale).toBe('en_AU');
      expect(og?.type).toBe('website');
    });
  });

  describe('Layout and Structure', () => {
    beforeEach(() => {
      render(<PrivacyPage />);
    });

    it('should render page header', () => {
      expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
      expect(screen.getByText(/Last Updated:/)).toBeInTheDocument();
    });

    it('should format last updated date correctly', () => {
      const dateText = screen.getByText(/Last Updated:/).textContent;
      expect(dateText).toContain('January 15, 2024');
    });

    it('should render all main sections', () => {
      const sections = [
        'Introduction',
        'Information We Collect',
        'How We Use Your Information',
        'Information Sharing',
        'Data Security',
        'Cookie Policy',
        'Your Rights',
        'Children\'s Privacy',
        'International Data Transfers',
        'Changes to Privacy Policy',
        'Contact Information'
      ];

      sections.forEach(section => {
        expect(screen.getByText(new RegExp(section))).toBeInTheDocument();
      });
    });
  });

  describe('Content Sections', () => {
    beforeEach(() => {
      render(<PrivacyPage />);
    });

    it('should render information collection subsections', () => {
      expect(screen.getByText('2.1 Personal Information')).toBeInTheDocument();
      expect(screen.getByText('2.2 Technical Information')).toBeInTheDocument();
    });

    it('should render information usage sections', () => {
      expect(screen.getByText('3.1 Primary Purposes')).toBeInTheDocument();
      expect(screen.getByText('3.2 Marketing Communications')).toBeInTheDocument();
    });

    it('should render information sharing details', () => {
      expect(screen.getByText('4.1 Third-Party Service Providers')).toBeInTheDocument();
      expect(screen.getByText('4.2 Legal Requirements')).toBeInTheDocument();
    });

    it('should render cookie policy information', () => {
      expect(screen.getByText('6.1 What Are Cookies')).toBeInTheDocument();
      expect(screen.getByText('6.2 Types of Cookies We Use')).toBeInTheDocument();
    });
  });

  describe('User Rights', () => {
    beforeEach(() => {
      render(<PrivacyPage />);
    });

    it('should list all user rights', () => {
      const rights = [
        'Access your personal information',
        'Correct inaccurate information',
        'Request deletion of your information',
        'Opt-out of marketing communications',
        'Withdraw consent for data processing',
        'Lodge a complaint with privacy regulators'
      ];

      rights.forEach(right => {
        expect(screen.getByText(right)).toBeInTheDocument();
      });
    });
  });

  describe('Contact Information', () => {
    beforeEach(() => {
      render(<PrivacyPage />);
    });

    it('should display privacy officer contact details', () => {
      expect(screen.getByText('privacy@disasterrecoveryqld.au')).toBeInTheDocument();
      expect(screen.getByText('1300 309 361')).toBeInTheDocument();
      expect(screen.getByText(/PO Box 1234, Brisbane/)).toBeInTheDocument();
    });
  });

  describe('Related Links', () => {
    beforeEach(() => {
      render(<PrivacyPage />);
    });

    it('should render related information section', () => {
      expect(screen.getByText('Related Information')).toBeInTheDocument();
    });

    it('should have working links', () => {
      const links = [
        { text: 'Terms of Service', href: '/terms' },
        { text: 'Contact Us', href: '/contact' },
        { text: 'Frequently Asked Questions', href: '/faq' }
      ];

      links.forEach(link => {
        const element = screen.getByText(link.text);
        expect(element.closest('a')).toHaveAttribute('href', link.href);
      });
    });
  });

  describe('Data Collection Information', () => {
    beforeEach(() => {
      render(<PrivacyPage />);
    });

    it('should list personal information types', () => {
      const personalInfo = [
        'Name and contact details',
        'Property address and access information',
        'Insurance policy details',
        'Payment information',
        'Photos and videos of damaged property',
        'Communication records'
      ];

      personalInfo.forEach(info => {
        expect(screen.getByText(info)).toBeInTheDocument();
      });
    });

    it('should list technical information types', () => {
      const technicalInfo = [
        'IP address and device information',
        'Browser type and settings',
        'Website usage data',
        'Cookies and similar technologies'
      ];

      technicalInfo.forEach(info => {
        expect(screen.getByText(info)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<PrivacyPage />);
      
      const h1s = document.querySelectorAll('h1');
      const h2s = document.querySelectorAll('h2');
      const h3s = document.querySelectorAll('h3');

      expect(h1s.length).toBe(1); // Main title
      expect(h2s.length).toBeGreaterThan(10); // Section headings
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
      render(<PrivacyPage />);

      const lists = document.querySelectorAll('ul');
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
      render(<PrivacyPage />);

      // Header text
      expect(screen.getByText('Privacy Policy').className)
        .toContain('text-4xl md:text-5xl');

      // Content container
      const container = document.querySelector('.max-w-4xl');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Content Formatting', () => {
    it('should use proper typography classes', () => {
      render(<PrivacyPage />);

      const mainContent = document.querySelector('.prose');
      expect(mainContent).toHaveClass('prose-lg');
    });

    it('should style links appropriately', () => {
      render(<PrivacyPage />);

      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link.className).toMatch(/text-blue-600|hover:text-blue-800/);
      });
    });
  });
});
