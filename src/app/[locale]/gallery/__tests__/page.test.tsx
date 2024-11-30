import { render, screen, fireEvent } from '@testing-library/react';
import GalleryPage, { metadata } from '../page';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />
}));

describe('GalleryPage', () => {
  describe('Metadata', () => {
    it('should have correct SEO metadata', () => {
      expect(metadata.title).toBe('Project Gallery | Disaster Recovery Queensland');
      expect(metadata.description).toContain('View our restoration projects');
      expect(metadata.openGraph).toBeDefined();
    });

    it('should have proper OpenGraph metadata', () => {
      const og = metadata.openGraph;
      expect(og?.title).toBe('Project Gallery | DRQ');
      expect(og?.url).toBe('https://drq.com.au/gallery');
      expect(og?.images).toBeDefined();
      expect(og?.locale).toBe('en_AU');
    });
  });

  describe('Layout and Structure', () => {
    beforeEach(() => {
      render(<GalleryPage />);
    });

    it('should render page header', () => {
      expect(screen.getByText('Project Gallery')).toBeInTheDocument();
      expect(screen.getByText('Before and after photos of our restoration projects')).toBeInTheDocument();
    });

    it('should render category filters', () => {
      const categories = ['All', 'Water Damage', 'Fire Damage', 'Mould Remediation', 'Storm Damage'];
      categories.forEach(category => {
        expect(screen.getByText(category)).toBeInTheDocument();
      });
    });

    it('should render gallery grid', () => {
      const images = screen.getAllByRole('button', { name: /View/ });
      expect(images.length).toBeGreaterThan(0);
    });
  });

  describe('Category Filtering', () => {
    beforeEach(() => {
      render(<GalleryPage />);
    });

    it('should highlight selected category', () => {
      const waterDamageButton = screen.getByText('Water Damage');
      fireEvent.click(waterDamageButton);
      expect(waterDamageButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('should filter images by category', () => {
      // Click Water Damage category
      fireEvent.click(screen.getByText('Water Damage'));
      
      // Should show water damage projects
      expect(screen.getByText('Flood Damage Restoration')).toBeInTheDocument();
      // Should not show fire damage projects
      expect(screen.queryByText('Fire Damage Recovery')).not.toBeInTheDocument();
    });

    it('should show all images when "All" category selected', () => {
      // First filter to Water Damage
      fireEvent.click(screen.getByText('Water Damage'));
      // Then click All
      fireEvent.click(screen.getByText('All'));
      
      // Should show all projects
      expect(screen.getByText('Flood Damage Restoration')).toBeInTheDocument();
      expect(screen.getByText('Fire Damage Recovery')).toBeInTheDocument();
    });

    it('should show no results message when no images in category', () => {
      // Click Storm Damage category (which has no images)
      fireEvent.click(screen.getByText('Storm Damage'));
      expect(screen.getByText('No projects found in this category')).toBeInTheDocument();
    });
  });

  describe('Image Modal', () => {
    beforeEach(() => {
      render(<GalleryPage />);
    });

    it('should open modal when image clicked', () => {
      fireEvent.click(screen.getByText('Flood Damage Restoration'));
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should show image details in modal', () => {
      fireEvent.click(screen.getByText('Flood Damage Restoration'));
      expect(screen.getByText(/Complete restoration of a flood-damaged home/)).toBeInTheDocument();
      expect(screen.getByText(/Brisbane CBD/)).toBeInTheDocument();
    });

    it('should toggle between before and after images', () => {
      fireEvent.click(screen.getByText('Flood Damage Restoration'));
      
      const beforeButton = screen.getByText('Before');
      const afterButton = screen.getByText('After');

      // Initially showing before image
      expect(beforeButton).toHaveAttribute('aria-pressed', 'true');
      expect(afterButton).toHaveAttribute('aria-pressed', 'false');

      // Click after button
      fireEvent.click(afterButton);
      expect(beforeButton).toHaveAttribute('aria-pressed', 'false');
      expect(afterButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('should close modal when close button clicked', () => {
      // Open modal
      fireEvent.click(screen.getByText('Flood Damage Restoration'));
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      // Close modal
      fireEvent.click(screen.getByLabelText('Close gallery'));
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should navigate between images', () => {
      fireEvent.click(screen.getByText('Flood Damage Restoration'));
      
      // Navigate to next image
      fireEvent.click(screen.getByLabelText('Next image'));
      expect(screen.getByText('Fire Damage Recovery')).toBeInTheDocument();

      // Navigate to previous image
      fireEvent.click(screen.getByLabelText('Previous image'));
      expect(screen.getByText('Flood Damage Restoration')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      render(<GalleryPage />);
    });

    it('should have proper ARIA labels on interactive elements', () => {
      // Category buttons
      const categoryButtons = screen.getAllByRole('button').filter(button => 
        !button.getAttribute('aria-label')?.includes('View')
      );
      categoryButtons.forEach(button => {
        expect(button).toHaveAttribute('aria-pressed');
      });

      // Gallery items
      const galleryItems = screen.getAllByRole('button', { name: /View/ });
      galleryItems.forEach(item => {
        expect(item).toHaveAttribute('aria-label');
      });
    });

    it('should have proper modal dialog attributes', () => {
      fireEvent.click(screen.getByText('Flood Damage Restoration'));
      
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby');
    });

    it('should have proper heading hierarchy', () => {
      const h1s = document.querySelectorAll('h1');
      const h2s = document.querySelectorAll('h2');

      expect(h1s.length).toBe(1); // Main title
      expect(h2s.length).toBeGreaterThan(0); // Project titles
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive layout classes', () => {
      render(<GalleryPage />);

      // Header text
      expect(screen.getByText('Project Gallery').className)
        .toContain('text-4xl md:text-5xl');

      // Gallery grid
      const galleryGrid = document.querySelector('.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3');
      expect(galleryGrid).toBeInTheDocument();
    });
  });

  describe('Image Loading', () => {
    it('should have proper image attributes', () => {
      render(<GalleryPage />);

      const images = screen.getAllByRole('img');
      images.forEach(image => {
        expect(image).toHaveAttribute('alt');
        expect(image.getAttribute('alt')).not.toBe('');
        expect(image).toHaveAttribute('src');
      });
    });
  });
});
