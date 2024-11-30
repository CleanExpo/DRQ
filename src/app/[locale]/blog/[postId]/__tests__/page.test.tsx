import { render, screen } from '@testing-library/react';
import BlogPostPage, { generateMetadata } from '../page';
import { notFound } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  notFound: jest.fn()
}));

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

describe('BlogPostPage', () => {
  const validPostId = 'water-damage-prevention';

  describe('Metadata Generation', () => {
    it('should generate correct metadata for valid post', async () => {
      const metadata = await generateMetadata({ params: { postId: validPostId } });

      expect(metadata.title).toBe('Essential Water Damage Prevention Tips for Queensland Homes | DRQ Blog');
      expect(metadata.description).toBeDefined();
      expect(metadata.openGraph).toBeDefined();
    });

    it('should include OpenGraph article metadata', async () => {
      const metadata = await generateMetadata({ params: { postId: validPostId } });
      const og = metadata.openGraph;

      expect(og?.type).toBe('article');
      expect(og?.authors).toContain('John Smith');
      expect(og?.publishedTime).toBeDefined();
      expect(og?.tags).toEqual(['Water Damage', 'Prevention', 'Home Maintenance']);
    });

    it('should return empty metadata for invalid post', async () => {
      const metadata = await generateMetadata({ params: { postId: 'invalid-post' } });
      expect(metadata).toEqual({});
    });
  });

  describe('Page Rendering', () => {
    it('should render 404 for invalid post', () => {
      render(<BlogPostPage params={{ postId: 'invalid-post' }} />);
      expect(notFound).toHaveBeenCalled();
    });

    it('should render article content', () => {
      render(<BlogPostPage params={{ postId: validPostId }} />);

      expect(screen.getByText('Essential Water Damage Prevention Tips for Queensland Homes')).toBeInTheDocument();
      expect(screen.getByText(/Water damage is one of the most common/)).toBeInTheDocument();
    });

    it('should render article metadata', () => {
      render(<BlogPostPage params={{ postId: validPostId }} />);

      expect(screen.getByText('January 15, 2024')).toBeInTheDocument();
      expect(screen.getByText('John Smith')).toBeInTheDocument();
    });

    it('should render tags', () => {
      render(<BlogPostPage params={{ postId: validPostId }} />);

      expect(screen.getByText('Water Damage')).toBeInTheDocument();
      expect(screen.getByText('Prevention')).toBeInTheDocument();
      expect(screen.getByText('Home Maintenance')).toBeInTheDocument();
    });
  });

  describe('Author Information', () => {
    beforeEach(() => {
      render(<BlogPostPage params={{ postId: validPostId }} />);
    });

    it('should display author details', () => {
      expect(screen.getByText('John Smith')).toBeInTheDocument();
      expect(screen.getByText('Senior Water Damage Specialist')).toBeInTheDocument();
      expect(screen.getByText(/15 years of experience/)).toBeInTheDocument();
    });

    it('should display author image', () => {
      const authorImage = screen.getByAltText('John Smith');
      expect(authorImage).toBeInTheDocument();
      expect(authorImage).toHaveAttribute('src', expect.stringContaining('john-smith.jpg'));
    });
  });

  describe('Social Sharing', () => {
    beforeEach(() => {
      render(<BlogPostPage params={{ postId: validPostId }} />);
    });

    it('should render share buttons', () => {
      expect(screen.getByLabelText('Share on Facebook')).toBeInTheDocument();
      expect(screen.getByLabelText('Share on Twitter')).toBeInTheDocument();
      expect(screen.getByLabelText('Share on LinkedIn')).toBeInTheDocument();
    });

    it('should have correct sharing URLs', () => {
      const encodedUrl = encodeURIComponent('https://drq.com.au/blog/water-damage-prevention');
      
      const facebookLink = screen.getByLabelText('Share on Facebook');
      expect(facebookLink).toHaveAttribute('href', expect.stringContaining(encodedUrl));

      const twitterLink = screen.getByLabelText('Share on Twitter');
      expect(twitterLink).toHaveAttribute('href', expect.stringContaining(encodedUrl));

      const linkedinLink = screen.getByLabelText('Share on LinkedIn');
      expect(linkedinLink).toHaveAttribute('href', expect.stringContaining(encodedUrl));
    });

    it('should open share links in new tab', () => {
      const shareButtons = [
        screen.getByLabelText('Share on Facebook'),
        screen.getByLabelText('Share on Twitter'),
        screen.getByLabelText('Share on LinkedIn')
      ];

      shareButtons.forEach(button => {
        expect(button).toHaveAttribute('target', '_blank');
        expect(button).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });
  });

  describe('Related Posts', () => {
    beforeEach(() => {
      render(<BlogPostPage params={{ postId: validPostId }} />);
    });

    it('should render related posts section', () => {
      expect(screen.getByText('Related Articles')).toBeInTheDocument();
    });

    it('should display related post cards', () => {
      const relatedPosts = screen.getAllByRole('link').filter(link => 
        link.getAttribute('href')?.startsWith('/blog/') &&
        link.getAttribute('href') !== '/blog'
      );
      expect(relatedPosts.length).toBeGreaterThan(0);
    });
  });

  describe('Navigation', () => {
    beforeEach(() => {
      render(<BlogPostPage params={{ postId: validPostId }} />);
    });

    it('should have back to blog link', () => {
      const backLink = screen.getByText('Back to Blog');
      expect(backLink.closest('a')).toHaveAttribute('href', '/blog');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<BlogPostPage params={{ postId: validPostId }} />);
      
      const h1s = document.querySelectorAll('h1');
      const h2s = document.querySelectorAll('h2');
      const h3s = document.querySelectorAll('h3');

      expect(h1s.length).toBe(1); // Article title
      expect(h2s.length).toBeGreaterThan(0); // Section headings
      expect(h3s.length).toBeGreaterThan(0); // Subsection headings
    });

    it('should have proper image alt texts', () => {
      render(<BlogPostPage params={{ postId: validPostId }} />);

      const images = screen.getAllByRole('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('alt');
        expect(img.getAttribute('alt')).not.toBe('');
      });
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive layout classes', () => {
      render(<BlogPostPage params={{ postId: validPostId }} />);

      // Hero section
      expect(document.querySelector('.h-\\[400px\\].md\\:h-\\[500px\\]')).toBeInTheDocument();

      // Content grid
      expect(document.querySelector('.grid-cols-1.lg\\:grid-cols-3')).toBeInTheDocument();
    });
  });
});
