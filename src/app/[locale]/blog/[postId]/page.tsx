'use client';

import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Calendar, 
  User, 
  Tag,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  ArrowLeft,
  ArrowRight,
  ChevronLeft
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: {
    name: string;
    role: string;
    imageUrl: string;
    bio: string;
  };
  date: string;
  imageUrl: string;
  tags: string[];
  relatedPosts?: string[];
}

const BLOG_POSTS: Record<string, BlogPost> = {
  'water-damage-prevention': {
    id: 'water-damage-prevention',
    title: 'Essential Water Damage Prevention Tips for Queensland Homes',
    excerpt: 'Learn how to protect your home from water damage during Queensland\'s wet season with these expert prevention tips.',
    content: `
      <h2>Understanding Water Damage Risks</h2>
      <p>Water damage is one of the most common and costly problems faced by Queensland homeowners. During the wet season, homes are particularly vulnerable to water intrusion through various entry points.</p>

      <h2>Prevention Strategies</h2>
      <h3>Regular Maintenance</h3>
      <ul>
        <li>Inspect and clean gutters regularly</li>
        <li>Check roof for damaged or missing tiles</li>
        <li>Ensure proper drainage around your property</li>
        <li>Maintain and test sump pumps if installed</li>
      </ul>

      <h3>Early Warning Signs</h3>
      <p>Being able to identify early warning signs of water damage can help prevent extensive damage:</p>
      <ul>
        <li>Water stains on walls or ceilings</li>
        <li>Musty odors</li>
        <li>Peeling paint or wallpaper</li>
        <li>Warped flooring</li>
      </ul>

      <h2>Emergency Preparedness</h2>
      <p>Having an emergency plan and supplies ready can help minimize damage when water incidents occur:</p>
      <ul>
        <li>Know location of main water shut-off valve</li>
        <li>Keep emergency contact numbers handy</li>
        <li>Maintain emergency repair supplies</li>
        <li>Document valuable items and maintain current insurance</li>
      </ul>
    `,
    category: 'Prevention',
    author: {
      name: 'John Smith',
      role: 'Senior Water Damage Specialist',
      imageUrl: '/images/team/john-smith.jpg',
      bio: 'John has over 15 years of experience in water damage restoration and prevention. He specializes in developing preventive strategies for residential properties.'
    },
    date: '2024-01-15',
    imageUrl: '/images/blog/water-damage-prevention.jpg',
    tags: ['Water Damage', 'Prevention', 'Home Maintenance'],
    relatedPosts: ['storm-preparation', 'mould-prevention']
  }
};

interface PostPageProps {
  params: {
    postId: string;
  };
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = BLOG_POSTS[params.postId];
  if (!post) return {};

  return {
    title: `${post.title} | DRQ Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://drq.com.au/blog/${post.id}`,
      siteName: 'Disaster Recovery Queensland',
      images: [
        {
          url: post.imageUrl,
          width: 1200,
          height: 630,
          alt: post.title
        }
      ],
      locale: 'en_AU',
      type: 'article',
      authors: [post.author.name],
      publishedTime: post.date,
      tags: post.tags
    }
  };
}

export default function BlogPostPage({ params }: PostPageProps) {
  const post = BLOG_POSTS[params.postId];

  if (!post) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const shareUrl = `https://drq.com.au/blog/${post.id}`;
  const shareText = `Check out this article: ${post.title}`;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px]">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <Link
              href="/blog"
              className="inline-flex items-center text-white/80 hover:text-white mb-4"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 max-w-4xl">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-white/90">
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {formatDate(post.date)}
              </span>
              <span className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                {post.author.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>

            {/* Article Content */}
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Share Buttons */}
            <div className="mt-12 pt-6 border-t">
              <div className="flex items-center gap-4">
                <span className="font-medium text-gray-700">Share this article:</span>
                <div className="flex gap-2">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    aria-label="Share on Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-blue-400 hover:bg-blue-50 rounded-full transition-colors"
                    aria-label="Share on Twitter"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(post.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                    aria-label="Share on LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Author Info */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Image
                  src={post.author.imageUrl}
                  alt={post.author.name}
                  width={60}
                  height={60}
                  className="rounded-full"
                />
                <div className="ml-4">
                  <h2 className="font-bold text-gray-900">{post.author.name}</h2>
                  <p className="text-sm text-gray-600">{post.author.role}</p>
                </div>
              </div>
              <p className="text-gray-600">
                {post.author.bio}
              </p>
            </div>

            {/* Related Posts */}
            {post.relatedPosts && post.relatedPosts.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Related Articles
                </h2>
                <div className="space-y-4">
                  {post.relatedPosts.map(postId => {
                    const relatedPost = BLOG_POSTS[postId];
                    if (!relatedPost) return null;

                    return (
                      <Link
                        key={postId}
                        href={`/blog/${postId}`}
                        className="block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="relative h-40">
                          <Image
                            src={relatedPost.imageUrl}
                            alt={relatedPost.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-gray-900 mb-2">
                            {relatedPost.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {formatDate(relatedPost.date)}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
