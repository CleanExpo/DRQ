import { render, screen, fireEvent } from '@testing-library/react';
import FAQPage, { metadata } from '../page';

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
}));

describe('FAQPage', () => {
  describe('Metadata', () => {
    it('should have correct SEO metadata', () => {
      expect(metadata.title).toBe('FAQ | Disaster Recovery Queensland');
      expect(metadata.description).toContain('Frequently asked questions');
      expect(metadata.openGraph).toBeDefined();
    });

    it('should have proper OpenGraph metadata', () => {
      const og = metadata.openGraph;
      expect(og?.title).toBe('FAQ | DRQ');
      expect(og?.url).toBe('https://drq.com.au/faq');
      expect(og?.images).toBeDefined();
      expect(og?.locale).toBe('en_AU');
    });
  });

  describe('Layout and Structure', () => {
    beforeEach(() => {
      render(<FAQPage />);
    });

    it('should render page header', () => {
      expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
      expect(screen.getByText(/Find answers to common questions/)).toBeInTheDocument();
    });

    it('should render quick contact section', () => {
      expect(screen.getByText('Need immediate assistance?')).toBeInTheDocument();
      
      const phoneLink = screen.getByText('Call 1300 309 361');
      expect(phoneLink.closest('a')).toHaveAttribute('href', 'tel:1300309361');
      
      const contactLink = screen.getByText('Contact Us');
      expect(contactLink.closest('a')).toHaveAttribute('href', '/contact');
    });

    it('should render all FAQ categories', () => {
      expect(screen.getByText('Emergency Response')).toBeInTheDocument();
      expect(screen.getByText('Our Services')).toBeInTheDocument();
      expect(screen.getByText('Insurance & Claims')).toBeInTheDocument();
      expect(screen.getByText('Service Areas')).toBeInTheDocument();
      expect(screen.getByText('Pricing & Payments')).toBeInTheDocument();
    });

    it('should render CTA section', () => {
      expect(screen.getByText('Still Have Questions?')).toBeInTheDocument();
      expect(screen.getByText('Call Us')).toBeInTheDocument();
      expect(screen.getByText('Send a Message')).toBeInTheDocument();
    });
  });

  describe('Category Interaction', () => {
    beforeEach(() => {
      render(<FAQPage />);
    });

    it('should show emergency category by default', () => {
      expect(screen.getByText('How quickly can you respond to emergencies?')).toBeInTheDocument();
    });

    it('should toggle categories when clicked', () => {
      // Click services category
      fireEvent.click(screen.getByText('Our Services'));
      expect(screen.getByText('What types of damage do you handle?')).toBeInTheDocument();
      expect(screen.queryByText('How quickly can you respond to emergencies?')).not.toBeInTheDocument();

      // Click services again to close
      fireEvent.click(screen.getByText('Our Services'));
      expect(screen.queryByText('What types of damage do you handle?')).not.toBeInTheDocument();
    });

    it('should close other categories when opening a new one', () => {
      // Open services
      fireEvent.click(screen.getByText('Our Services'));
      expect(screen.getByText('What types of damage do you handle?')).toBeInTheDocument();

      // Open insurance
      fireEvent.click(screen.getByText('Insurance & Claims'));
      expect(screen.getByText('Do you work with insurance companies?')).toBeInTheDocument();
      expect(screen.queryByText('What types of damage do you handle?')).not.toBeInTheDocument();
    });
  });

  describe('Question Interaction', () => {
    beforeEach(() => {
      render(<FAQPage />);
    });

    it('should toggle question answers when clicked', () => {
      const question = screen.getByText('How quickly can you respond to emergencies?');
      
      // Initially answer should not be visible
      expect(screen.queryByText(/We provide 24\/7 emergency response/)).not.toBeInTheDocument();
      
      // Click to show answer
      fireEvent.click(question);
      expect(screen.getByText(/We provide 24\/7 emergency response/)).toBeInTheDocument();
      
      // Click again to hide answer
      fireEvent.click(question);
      expect(screen.queryByText(/We provide 24\/7 emergency response/)).not.toBeInTheDocument();
    });

    it('should allow multiple questions to be open simultaneously', () => {
      // Open first question
      fireEvent.click(screen.getByText('How quickly can you respond to emergencies?'));
      
      // Open second question
      fireEvent.click(screen.getByText('What should I do while waiting for your team?'));
      
      // Both answers should be visible
      expect(screen.getByText(/We provide 24\/7 emergency response/)).toBeInTheDocument();
      expect(screen.getByText(/If safe, turn off the main water supply/)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<FAQPage />);

      // Category buttons
      const categoryButtons = document.querySelectorAll('[aria-expanded]');
      expect(categoryButtons.length).toBeGreaterThan(0);
      categoryButtons.forEach(button => {
        expect(button).toHaveAttribute('aria-expanded');
      });

      // Question buttons
      fireEvent.click(screen.getByText('Emergency Response'));
      const questionButtons = document.querySelectorAll('button[aria-expanded]');
      expect(questionButtons.length).toBeGreaterThan(0);
    });

    it('should have proper heading hierarchy', () => {
      render(<FAQPage />);
      
      const h1s = document.querySelectorAll('h1');
      const h2s = document.querySelectorAll('h2');
      const h3s = document.querySelectorAll('h3');

      expect(h1s.length).toBe(1); // Main page title
      expect(h2s.length).toBeGreaterThan(0); // Category titles
      expect(h3s.length).toBeGreaterThan(0); // Questions
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive layout classes', () => {
      render(<FAQPage />);

      // Header text
      expect(screen.getByText('Frequently Asked Questions').className)
        .toContain('text-4xl md:text-5xl');

      // Quick contact section
      const contactSection = document.querySelector('.flex-col.sm\\:flex-row');
      expect(contactSection).toBeInTheDocument();

      // CTA buttons
      const ctaSection = document.querySelector('.flex-col.sm\\:flex-row');
      expect(ctaSection).toBeInTheDocument();
    });
  });

  describe('Content Organization', () => {
    it('should group questions by category', () => {
      render(<FAQPage />);

      // Check emergency category questions
      fireEvent.click(screen.getByText('Emergency Response'));
      expect(screen.getByText('How quickly can you respond to emergencies?')).toBeInTheDocument();
      expect(screen.getByText('What should I do while waiting for your team?')).toBeInTheDocument();

      // Check services category questions
      fireEvent.click(screen.getByText('Our Services'));
      expect(screen.getByText('What types of damage do you handle?')).toBeInTheDocument();
      expect(screen.getByText('What equipment do you use?')).toBeInTheDocument();
    });

    it('should maintain question order within categories', () => {
      render(<FAQPage />);
      
      fireEvent.click(screen.getByText('Emergency Response'));
      const questions = screen.getAllByRole('button').filter(button => 
        button.textContent?.includes('?')
      );

      expect(questions[0]).toHaveTextContent('How quickly can you respond');
      expect(questions[1]).toHaveTextContent('What should I do while waiting');
      expect(questions[2]).toHaveTextContent('Do you charge extra for after-hours');
    });
  });
});
