import { render, screen, fireEvent } from '@testing-library/react';
import BlogPage, { metadata } from '../page';

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

describe('BlogPage', () => {
  describe('Metadata', () => {
    it('should have correct SEO metadata', () => {
      expect(metadata.title).toBe('Blog | Disaster Recovery Queensland');
      expect(metadata.description).toContain('Expert insights');
      expect(metadata.openGraph).toBeDefined();
    });

    it('should have proper OpenGraph metadata', () => {
      const og = metadata.openGraph;
      expect(og?.title).toBe('Blog | DRQ');
      expect(og?.url).toBe('https://drq.com.au/blog');
      expect(og?.images).toBeDefined();
      expect(og?.locale).toBe('en_AU');
    });
  });

  describe('Layout and Structure', () => {
    beforeEach(() => {
      render(<BlogPage />);
    });

    it('should render page header', () => {
      expect(screen.getByText('DRQ Blog')).toBeInTheDocument();
      expect(screen.getByText(/Expert insights and guides/)).toBeInTheDocument();
    });

    it('should render search and filters', () => {
      expect(screen.getByPlaceholderText('Search articles...')).toBeInTheDocument();
      expect(screen.getByText('All')).toBeInTheDocument();
      expect(screen.getByText('Prevention')).toBeInTheDocument();
      expect(screen.getByText('Safety')).toBeInTheDocument();
    });

    it('should render featured articles section', () => {
      expect(screen.getByText('Featured Articles')).toBeInTheDocument();
      const featuredPosts = screen.getAllByText(/Essential Water Damage Prevention|Complete Fire Safety Guide/);
      expect(featuredPosts.length).toBeGreaterThan(0);
    });

    it('should render article grid', () => {
      const articles = screen.getAllByRole('article');
      expect(articles.length).toBeGreaterThan(0);
    });
  });

  describe('Search Functionality', () => {
    beforeEach(() => {
      render(<BlogPage />);
    });

    it('should filter articles based on search query', () => {
      const searchInput = screen.getByPlaceholderText('Search articles...');
      
      // Search for water damage
      fireEvent.change(searchInput, { target: { value: 'water damage' } });
      expect(screen.getByText(/Essential Water Damage Prevention/)).toBeInTheDocument();
      expect(screen.queryByText(/Complete Fire Safety Guide/)).not.toBeInTheDocument();
    });

    it('should show no results message when no matches found', () => {
      const searchInput = screen.getByPlaceholderText('Search articles...');
      fireEvent.change(searchInput, { target: { value: 'nonexistent article' } });
      
      expect(screen.getByText('No articles found matching your criteria')).toBeInTheDocument();
    });

    it('should search across titles, excerpts, and tags', () => {
      const searchInput = screen.getByPlaceholderText('Search articles...');
      
      // Search by tag
      fireEvent.change(searchInput, { target: { value: 'prevention' } });
      const preventionResults = screen.getAllByText(/Prevention/);
      expect(preventionResults.length).toBeGreaterThan(0);
    });
  });

  describe('Category Filtering', () => {
    beforeEach(() => {
      render(<BlogPage />);
    });

    it('should filter articles by category', () => {
      // Click Prevention category
      fireEvent.click(screen.getByText('Prevention'));
      
      expect(screen.getByText(/Essential Water Damage Prevention/)).toBeInTheDocument();
      expect(screen.queryByText(/Complete Fire Safety Guide/)).not.toBeInTheDocument();
    });

    it('should show all articles when "All" category selected', () => {
      // First filter to Prevention
      fireEvent.click(screen.getByText('Prevention'));
      
      // Then click All
      fireEvent.click(screen.getByText('All'));
      
      expect(screen.getByText(/Essential Water Damage Prevention/)).toBeInTheDocument();
      expect(screen.getByText(/Complete Fire Safety Guide/)).toBeInTheDocument();
    });

    it('should highlight selected category', () => {
      fireEvent.click(screen.getByText('Prevention'));
      
      const preventionButton = screen.getByText('Prevention');
      expect(preventionButton).toHaveClass('bg-blue-600', 'text-white');
    });
  });

  describe('Pagination', () => {
    beforeEach(() => {
      render(<BlogPage />);
    });

    it('should render pagination controls when needed', () => {
      const pageButtons = screen.getAllByRole('button', { name: /Page \d/ });
      expect(pageButtons.length).toBeGreaterThan(0);
    });

    it('should navigate between pages', () => {
      const nextButton = screen.getByLabelText('Next page');
      fireEvent.click(nextButton);
      
      const page2Button = screen.getByRole('button', { name: 'Page 2' });
      expect(page2Button).toHaveAttribute('aria-current', 'page');
    });

    it('should disable navigation buttons at boundaries', () => {
      // First page - prev should be disabled
      const prevButton = screen.getByLabelText('Previous page');
      expect(prevButton).toBeDisabled();

      // Navigate to last page
      const lastPageButton = screen.getAllByRole('button', { name: /Page \d/ }).pop();
      fireEvent.click(lastPageButton!);

      // Last page - next should be disabled
      const nextButton = screen.getByLabelText('Next page');
      expect(nextButton).toBeDisabled();
    });
  });

  describe('Article Display', () => {
    beforeEach(() => {
      render(<BlogPage />);
    });

    it('should display article metadata', () => {
      const articles = screen.getAllByRole('article');
      const firstArticle = articles[0];

      expect(firstArticle).toHaveTextContent(/John Smith/); // Author
      expect(firstArticle).toHaveTextContent(/January 15, 2024/); // Date
    });

    it('should display article tags', () => {
      const tags = screen.getAllByText(/Water Damage|Prevention|Home Maintenance/);
      expect(tags.length).toBeGreaterThan(0);
    });

    it('should link to full article', () => {
      const articles = screen.getAllByRole('article');
      const firstArticle = articles[0];
      
      const link = firstArticle.querySelector('a');
      expect(link).toHaveAttribute('href', expect.stringMatching(/^\/blog\//));
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive layout classes', () => {
      render(<BlogPage />);

      // Header text
      expect(screen.getByText('DRQ Blog').className)
        .toContain('text-4xl md:text-5xl');

      // Search and filters
      const searchContainer = document.querySelector('.flex-col.md\\:flex-row');
      expect(searchContainer).toBeInTheDocument();

      // Article grid
      const articleGrid = document.querySelector('.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3');
      expect(articleGrid).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<BlogPage />);

      // Search input
      expect(screen.getByPlaceholderText('Search articles...'))
        .toHaveAttribute('aria-label', 'Search articles');

      // Pagination
      const currentPage = screen.getByRole('button', { name: 'Page 1' });
      expect(currentPage).toHaveAttribute('aria-current', 'page');
    });

    it('should have proper heading hierarchy', () => {
      render(<BlogPage />);
      
      const h1s = document.querySelectorAll('h1');
      const h2s = document.querySelectorAll('h2');
      const h3s = document.querySelectorAll('h3');

      expect(h1s.length).toBe(1); // Main page title
      expect(h2s.length).toBeGreaterThan(0); // Section titles
      expect(h3s.length).toBeGreaterThan(0); // Article titles
    });
  });
});
