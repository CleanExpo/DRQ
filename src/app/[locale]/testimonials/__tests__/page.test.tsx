import { render, screen, fireEvent } from '@testing-library/react';
import TestimonialsPage, { metadata } from '../page';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />
}));

describe('TestimonialsPage', () => {
  describe('Metadata', () => {
    it('should have correct SEO metadata', () => {
      expect(metadata.title).toBe('Client Testimonials | Disaster Recovery Queensland');
      expect(metadata.description).toContain('Read what our clients say');
      expect(metadata.openGraph).toBeDefined();
    });

    it('should have proper OpenGraph metadata', () => {
      const og = metadata.openGraph;
      expect(og?.title).toBe('Client Testimonials | DRQ');
      expect(og?.url).toBe('https://drq.com.au/testimonials');
      expect(og?.images).toBeDefined();
      expect(og?.locale).toBe('en_AU');
    });
  });

  describe('Layout and Structure', () => {
    beforeEach(() => {
      render(<TestimonialsPage />);
    });

    it('should render page header', () => {
      expect(screen.getByText('Client Testimonials')).toBeInTheDocument();
      expect(screen.getByText('Read what our clients say about our services')).toBeInTheDocument();
    });

    it('should render filter controls', () => {
      expect(screen.getByLabelText('Service Type')).toBeInTheDocument();
      expect(screen.getByLabelText('Location')).toBeInTheDocument();
    });

    it('should render testimonials', () => {
      expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
      expect(screen.getByText('Michael Brown')).toBeInTheDocument();
      expect(screen.getByText('Emma Wilson')).toBeInTheDocument();
    });
  });

  describe('Filtering', () => {
    beforeEach(() => {
      render(<TestimonialsPage />);
    });

    it('should filter by service type', () => {
      const serviceFilter = screen.getByLabelText('Filter by service type');
      fireEvent.change(serviceFilter, { target: { value: 'Water Damage' } });

      expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
      expect(screen.queryByText('Michael Brown')).not.toBeInTheDocument();
    });

    it('should filter by location', () => {
      const locationFilter = screen.getByLabelText('Filter by location');
      fireEvent.change(locationFilter, { target: { value: 'Brisbane CBD' } });

      expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
      expect(screen.queryByText('Michael Brown')).not.toBeInTheDocument();
    });

    it('should show no results message when no matches found', () => {
      const serviceFilter = screen.getByLabelText('Filter by service type');
      const locationFilter = screen.getByLabelText('Filter by location');

      fireEvent.change(serviceFilter, { target: { value: 'Water Damage' } });
      fireEvent.change(locationFilter, { target: { value: 'Gold Coast' } });

      expect(screen.getByText('No testimonials found matching your filters')).toBeInTheDocument();
    });

    it('should show all testimonials when filters reset to "All"', () => {
      // First filter to specific service
      const serviceFilter = screen.getByLabelText('Filter by service type');
      fireEvent.change(serviceFilter, { target: { value: 'Water Damage' } });

      // Then reset to All
      fireEvent.change(serviceFilter, { target: { value: 'All' } });

      expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
      expect(screen.getByText('Michael Brown')).toBeInTheDocument();
      expect(screen.getByText('Emma Wilson')).toBeInTheDocument();
    });
  });

  describe('Testimonial Content', () => {
    beforeEach(() => {
      render(<TestimonialsPage />);
    });

    it('should display client information correctly', () => {
      const testimonial = screen.getByText('Sarah Johnson').closest('article');
      expect(testimonial).toHaveTextContent('Brisbane CBD');
      expect(testimonial).toHaveTextContent('Water Damage');
      expect(testimonial).toHaveTextContent('January 10, 2024');
    });

    it('should show verified badge for verified reviews', () => {
      const verifiedBadges = screen.getAllByTitle('Verified Review');
      expect(verifiedBadges.length).toBeGreaterThan(0);
    });

    it('should display star ratings', () => {
      const ratings = screen.getAllByLabelText(/Rating: \d out of 5 stars/);
      expect(ratings.length).toBeGreaterThan(0);
    });

    it('should show company responses when available', () => {
      expect(screen.getByText(/Thank you for your kind words, Sarah/)).toBeInTheDocument();
      expect(screen.getByText(/Responded on January 11, 2024/)).toBeInTheDocument();
    });
  });

  describe('Mobile Responsiveness', () => {
    beforeEach(() => {
      render(<TestimonialsPage />);
    });

    it('should toggle filter visibility on mobile', () => {
      const filterButton = screen.getByText(/Show Filters/);
      const filterSection = screen.getByTestId('filter-options');

      // Initially hidden on mobile
      expect(filterSection).toHaveClass('hidden');

      // Show filters
      fireEvent.click(filterButton);
      expect(filterSection).toHaveClass('block');

      // Hide filters
      fireEvent.click(filterButton);
      expect(filterSection).toHaveClass('hidden');
    });

    it('should have responsive layout classes', () => {
      // Header text
      expect(screen.getByText('Client Testimonials').className)
        .toContain('text-4xl md:text-5xl');

      // Filter container
      const filterContainer = screen.getByTestId('filter-options');
      expect(filterContainer.className).toContain('md:flex');
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      render(<TestimonialsPage />);
    });

    it('should have proper heading hierarchy', () => {
      const h1s = document.querySelectorAll('h1');
      const h2s = document.querySelectorAll('h2');

      expect(h1s.length).toBe(1); // Main title
      expect(h2s.length).toBeGreaterThan(0); // Client names
    });

    it('should have accessible filter controls', () => {
      expect(screen.getByLabelText('Service Type')).toHaveAttribute('id', 'service-filter');
      expect(screen.getByLabelText('Location')).toHaveAttribute('id', 'location-filter');
    });

    it('should have proper ARIA labels', () => {
      const testimonialsFeed = screen.getByRole('feed');
      expect(testimonialsFeed).toHaveAttribute('aria-label', 'Client testimonials');

      const ratings = screen.getAllByLabelText(/Rating: \d out of 5 stars/);
      expect(ratings.length).toBeGreaterThan(0);
    });

    it('should have accessible filter toggle button', () => {
      const filterButton = screen.getByText(/Show Filters/);
      expect(filterButton).toHaveAttribute('aria-expanded');
      expect(filterButton).toHaveAttribute('aria-controls', 'filter-options');
    });
  });

  describe('Image Handling', () => {
    it('should render client images when available', () => {
      render(<TestimonialsPage />);

      const clientImage = screen.getByAltText('Sarah Johnson');
      expect(clientImage).toBeInTheDocument();
      expect(clientImage).toHaveAttribute('src', expect.stringContaining('sarah-j.jpg'));
    });
  });
});
