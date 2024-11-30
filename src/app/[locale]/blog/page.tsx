'use client';

import { useState } from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Search, 
  Calendar, 
  User, 
  Tag,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog | Disaster Recovery Queensland',
  description: 'Expert insights, tips, and guides on disaster recovery, water damage restoration, fire damage repair, and emergency response.',
  openGraph: {
    title: 'Blog | DRQ',
    description: 'Expert insights and guides on disaster recovery and restoration.',
    url: 'https://drq.com.au/blog',
    siteName: 'Disaster Recovery Queensland',
    images: [
      {
        url: '/images/blog-og.jpg',
        width: 1200,
        height: 630,
        alt: 'DRQ Blog'
      }
    ],
    locale: 'en_AU',
    type: 'website',
  }
};

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  imageUrl: string;
  featured?: boolean;
  tags: string[];
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: 'water-damage-prevention',
    title: 'Essential Water Damage Prevention Tips for Queensland Homes',
    excerpt: 'Learn how to protect your home from water damage during Queensland\'s wet season with these expert prevention tips.',
    category: 'Prevention',
    author: 'John Smith',
    date: '2024-01-15',
    imageUrl: '/images/blog/water-damage-prevention.jpg',
    featured: true,
    tags: ['Water Damage', 'Prevention', 'Home Maintenance']
  },
  {
    id: 'fire-safety-guide',
    title: 'Complete Fire Safety Guide for Residential Properties',
    excerpt: 'A comprehensive guide to fire safety, including prevention measures, evacuation plans, and immediate response procedures.',
    category: 'Safety',
    author: 'Sarah Johnson',
    date: '2024-01-10',
    imageUrl: '/images/blog/fire-safety.jpg',
    featured: true,
    tags: ['Fire Safety', 'Emergency Response', 'Home Safety']
  },
  {
    id: 'mould-prevention',
    title: 'Identifying and Preventing Mould Growth After Floods',
    excerpt: 'Expert advice on detecting early signs of mould and preventing growth following flood or water damage incidents.',
    category: 'Health',
    author: 'Dr. Michael Brown',
    date: '2024-01-05',
    imageUrl: '/images/blog/mould-prevention.jpg',
    tags: ['Mould', 'Health', 'Water Damage']
  },
  {
    id: 'storm-preparation',
    title: 'Storm Season Preparation: What You Need to Know',
    excerpt: 'Essential preparation tips for Queensland\'s storm season, including property protection and emergency planning.',
    category: 'Prevention',
    author: 'Emma Wilson',
    date: '2023-12-28',
    imageUrl: '/images/blog/storm-prep.jpg',
    tags: ['Storm Damage', 'Prevention', 'Emergency Planning']
  },
  {
    id: 'insurance-claims',
    title: 'Navigating Insurance Claims After Disaster Damage',
    excerpt: 'A step-by-step guide to filing and managing insurance claims following property damage from natural disasters.',
    category: 'Insurance',
    author: 'James Anderson',
    date: '2023-12-20',
    imageUrl: '/images/blog/insurance-claims.jpg',
    tags: ['Insurance', 'Claims', 'Property Damage']
  }
];

const CATEGORIES = [
  'All',
  'Prevention',
  'Safety',
  'Health',
  'Insurance',
  'Emergency Response'
];

const POSTS_PER_PAGE = 6;

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter posts based on search and category
  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = 
      selectedCategory === 'All' || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            DRQ Blog
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Expert insights and guides on disaster recovery and restoration
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="w-full md:w-auto relative">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Search articles"
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Posts */}
      {currentPage === 1 && searchQuery === '' && selectedCategory === 'All' && (
        <div className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Featured Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {BLOG_POSTS.filter(post => post.featured).map(post => (
                <Link
                  key={post.id}
                  href={`/blog/${post.id}`}
                  className="group relative h-80 rounded-lg overflow-hidden"
                >
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="text-white/80 text-sm mb-2">
                      {post.category}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {post.title}
                    </h3>
                    <p className="text-white/90">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* All Posts */}
      <div className="container mx-auto px-4 py-12">
        {/* Results info */}
        {searchQuery && (
          <div className="mb-6 text-gray-600">
            Found {filteredPosts.length} articles matching "{searchQuery}"
          </div>
        )}

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedPosts.map(post => (
            <article
              key={post.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <Link href={`/blog/${post.id}`} className="block">
                <div className="relative h-48">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(post.date)}
                    </span>
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {post.author}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">
              No articles found matching your criteria
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                aria-label={`Page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
