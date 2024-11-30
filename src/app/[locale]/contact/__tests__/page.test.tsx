import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ContactPage, { metadata } from '../page';
import { SERVICE_REGIONS } from '../../../../services/types/IServiceArea';

// Mock fetch
global.fetch = jest.fn();

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

describe('ContactPage', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  describe('Metadata', () => {
    it('should have correct SEO metadata', () => {
      expect(metadata.title).toBe('Contact Us | Disaster Recovery Queensland');
      expect(metadata.description).toContain('Contact DRQ for emergency');
      expect(metadata.openGraph).toBeDefined();
    });

    it('should have proper OpenGraph metadata', () => {
      const og = metadata.openGraph;
      expect(og?.title).toBe('Contact DRQ | Emergency Response Available');
      expect(og?.url).toBe('https://drq.com.au/contact');
      expect(og?.images).toBeDefined();
      expect(og?.locale).toBe('en_AU');
    });
  });

  describe('Layout and Structure', () => {
    beforeEach(() => {
      render(<ContactPage />);
    });

    it('should render emergency banner', () => {
      expect(screen.getByText('Need Emergency Assistance?')).toBeInTheDocument();
      const emergencyLink = screen.getByText('Call 1300 309 361');
      expect(emergencyLink).toHaveAttribute('href', 'tel:1300309361');
    });

    it('should render contact form', () => {
      expect(screen.getByLabelText('Full name')).toBeInTheDocument();
      expect(screen.getByLabelText('Email address')).toBeInTheDocument();
      expect(screen.getByLabelText('Phone number')).toBeInTheDocument();
      expect(screen.getByLabelText('Location')).toBeInTheDocument();
      expect(screen.getByLabelText('Message')).toBeInTheDocument();
    });

    it('should render contact information', () => {
      expect(screen.getByText('Contact Information')).toBeInTheDocument();
      expect(screen.getByText('24/7 Emergency Response')).toBeInTheDocument();
      expect(screen.getByText('admin@disasterrecoveryqld.au')).toBeInTheDocument();
    });

    it('should render office hours', () => {
      expect(screen.getByText('Office Hours')).toBeInTheDocument();
      expect(screen.getByText('Monday - Friday')).toBeInTheDocument();
      expect(screen.getByText('8:00 AM - 5:00 PM')).toBeInTheDocument();
    });

    it('should render service areas', () => {
      expect(screen.getByText('Service Areas')).toBeInTheDocument();
      SERVICE_REGIONS.forEach(region => {
        expect(screen.getByText(region.name)).toBeInTheDocument();
        expect(screen.getByText(`Response Time: ${region.responseTime}`)).toBeInTheDocument();
      });
    });
  });

  describe('Form Functionality', () => {
    beforeEach(() => {
      render(<ContactPage />);
    });

    it('should handle form submission', async () => {
      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true })
        })
      );

      // Fill out form
      fireEvent.change(screen.getByLabelText('Full name'), {
        target: { value: 'John Doe' }
      });
      fireEvent.change(screen.getByLabelText('Email address'), {
        target: { value: 'john@example.com' }
      });
      fireEvent.change(screen.getByLabelText('Phone number'), {
        target: { value: '0400000000' }
      });
      fireEvent.change(screen.getByLabelText('Location'), {
        target: { value: 'Brisbane' }
      });
      fireEvent.change(screen.getByLabelText('Message'), {
        target: { value: 'Test message' }
      });

      // Submit form
      fireEvent.click(screen.getByText('Send Message'));

      await waitFor(() => {
        expect(screen.getByText('Thank you for your message')).toBeInTheDocument();
      });

      expect(global.fetch).toHaveBeenCalledWith('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          phone: '0400000000',
          location: 'Brisbane',
          message: 'Test message',
          emergency: false
        })
      });
    });

    it('should handle form submission errors', async () => {
      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.reject(new Error('Failed to submit'))
      );

      // Fill and submit form
      fireEvent.change(screen.getByLabelText('Full name'), {
        target: { value: 'John Doe' }
      });
      fireEvent.click(screen.getByText('Send Message'));

      await waitFor(() => {
        expect(screen.getByText(/Failed to submit form/)).toBeInTheDocument();
      });
    });

    it('should validate required fields', () => {
      const submitButton = screen.getByText('Send Message');
      fireEvent.click(submitButton);

      const requiredFields = [
        'Full name',
        'Email address',
        'Phone number',
        'Location',
        'Message'
      ];

      requiredFields.forEach(fieldName => {
        const field = screen.getByLabelText(fieldName);
        expect(field).toBeInvalid();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<ContactPage />);

      // Form
      expect(screen.getByRole('form')).toHaveAttribute('aria-label', 'Contact form');

      // Inputs
      expect(screen.getByLabelText('Full name')).toHaveAttribute('aria-required', 'true');
      expect(screen.getByLabelText('Email address')).toHaveAttribute('aria-required', 'true');
      expect(screen.getByLabelText('Phone number')).toHaveAttribute('aria-required', 'true');

      // Emergency checkbox
      expect(screen.getByLabelText(/This is an emergency/)).toBeInTheDocument();

      // Map
      expect(screen.getByTestId('mock-map')).toHaveAttribute('aria-label', 'Service areas map');
    });

    it('should handle form feedback accessibly', async () => {
      render(<ContactPage />);

      // Submit form to trigger error
      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.reject(new Error('Failed to submit'))
      );

      fireEvent.click(screen.getByText('Send Message'));

      await waitFor(() => {
        const errorMessage = screen.getByText(/Failed to submit form/);
        expect(errorMessage).toHaveAttribute('role', 'alert');
        expect(errorMessage).toHaveAttribute('aria-live', 'polite');
      });
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive layout classes', () => {
      render(<ContactPage />);

      // Main grid
      const mainGrid = document.querySelector('.grid-cols-1.lg\\:grid-cols-2');
      expect(mainGrid).toBeInTheDocument();

      // Service areas grid
      const areasGrid = document.querySelector('.space-y-4');
      expect(areasGrid).toBeInTheDocument();
    });
  });

  describe('Map Integration', () => {
    it('should render map with correct props', () => {
      render(<ContactPage />);

      const map = screen.getByTestId('mock-map');
      expect(map).toHaveTextContent('Map: -27.4698, 153.0251 - Radius: 100km');
    });
  });
});
