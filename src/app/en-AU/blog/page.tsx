import React from 'react'
import Link from 'next/link'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  date: string
  category: string
  readTime: string
}

const samplePosts: BlogPost[] = [
  {
    id: '1',
    title: 'How to Prevent Water Damage in Your Home',
    excerpt: 'Learn essential tips and strategies to protect your home from water damage and minimize potential risks.',
    date: '2023-12-01',
    category: 'Prevention',
    readTime: '5 min read'
  },
  {
    id: '2',
    title: 'Understanding Mould Growth After Floods',
    excerpt: 'Discover why mould grows after flooding and what steps you can take to prevent it from spreading in your property.',
    date: '2023-11-28',
    category: 'Education',
    readTime: '4 min read'
  },
  {
    id: '3',
    title: 'Fire Safety Tips for Business Owners',
    excerpt: 'Essential fire safety measures every business owner should implement to protect their property and employees.',
    date: '2023-11-25',
    category: 'Safety',
    readTime: '6 min read'
  },
  {
    id: '4',
    title: 'The Importance of Quick Water Extraction',
    excerpt: 'Why immediate water extraction is crucial after flooding and how it can prevent long-term damage to your property.',
    date: '2023-11-22',
    category: 'Services',
    readTime: '3 min read'
  },
  {
    id: '5',
    title: 'Commercial Property Maintenance Guide',
    excerpt: 'A comprehensive guide to maintaining commercial properties and preventing common disasters.',
    date: '2023-11-19',
    category: 'Commercial',
    readTime: '7 min read'
  },
  {
    id: '6',
    title: 'Storm Season Preparation Tips',
    excerpt: 'How to prepare your property for storm season and minimize potential damage from severe weather.',
    date: '2023-11-16',
    category: 'Prevention',
    readTime: '5 min read'
  }
]

const categories = [
  'All',
  'Prevention',
  'Education',
  'Safety',
  'Services',
  'Commercial',
  'News'
]

export default function BlogPage() {
  return (
    <div className="flex flex-col gap-12 py-8">
      {/* Hero Section */}
      <section className="bg-blue-900 text-white px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Blog & News
          </h1>
          <p className="text-xl">
            Industry insights, tips, and updates from our experts
          </p>
        </div>
      </section>

      {/* Blog Content */}
      <section className="px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            {/* Search */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Search</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full p-2 border rounded-lg pr-10"
                />
                <span className="absolute right-3 top-2.5 text-gray-400">
                  🔍
                </span>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h2 className="text-xl font-bold mb-4">Categories</h2>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category}>
                    <button className="text-blue-900 hover:underline">
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Blog Posts */}
          <div className="md:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {samplePosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                      <span>{post.category}</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3">
                      <Link href={`/en-AU/blog/${post.id}`} className="hover:text-blue-900">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {new Date(post.date).toLocaleDateString('en-AU', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      <Link
                        href={`/en-AU/blog/${post.id}`}
                        className="text-blue-900 hover:underline"
                      >
                        Read more →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Need Our Services?</h2>
          <p className="mb-8">
            Contact us for professional restoration services
          </p>
          <div className="space-x-4">
            <Link
              href="/en-AU/contact"
              className="inline-block bg-blue-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-800"
            >
              Contact Us
            </Link>
            <Link
              href="/en-AU/emergency"
              className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700"
            >
              Emergency Service
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
