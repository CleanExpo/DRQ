import React from 'react'
import Link from 'next/link'
import { SERVICES } from '../../../constants/services'

interface GalleryImage {
  id: string
  title: string
  service: string
  category: string
  beforeImage: string
  afterImage: string
  description: string
}

const sampleGallery: GalleryImage[] = [
  {
    id: '1',
    title: 'Flood Damage Restoration',
    service: 'Water Damage',
    category: 'Residential',
    beforeImage: '/images/projects/water-damage-before.jpg',
    afterImage: '/images/projects/water-damage-after.jpg',
    description: 'Complete restoration of a flood-damaged living room in Brisbane.'
  },
  {
    id: '2',
    title: 'Mould Remediation Project',
    service: 'Mould Remediation',
    category: 'Commercial',
    beforeImage: '/images/projects/mould-before.jpg',
    afterImage: '/images/projects/mould-after.jpg',
    description: 'Extensive mould removal and prevention in a commercial office space.'
  },
  {
    id: '3',
    title: 'Fire Damage Recovery',
    service: 'Fire Damage',
    category: 'Residential',
    beforeImage: '/images/projects/fire-before.jpg',
    afterImage: '/images/projects/fire-after.jpg',
    description: 'Complete restoration after severe fire damage in a residential property.'
  },
  {
    id: '4',
    title: 'Commercial Water Damage',
    service: 'Commercial',
    category: 'Commercial',
    beforeImage: '/images/projects/commercial-before.jpg',
    afterImage: '/images/projects/commercial-after.jpg',
    description: 'Emergency water extraction and restoration in a retail space.'
  },
  {
    id: '5',
    title: 'Storm Damage Repair',
    service: 'Water Damage',
    category: 'Residential',
    beforeImage: '/images/projects/storm-before.jpg',
    afterImage: '/images/projects/storm-after.jpg',
    description: 'Comprehensive restoration after severe storm damage.'
  },
  {
    id: '6',
    title: 'Sewage Cleanup Project',
    service: 'Sewage Cleanup',
    category: 'Commercial',
    beforeImage: '/images/projects/sewage-before.jpg',
    afterImage: '/images/projects/sewage-after.jpg',
    description: 'Professional sewage cleanup and sanitization in a commercial building.'
  }
]

const categories = ['All', 'Residential', 'Commercial']

export default function GalleryPage() {
  return (
    <div className="flex flex-col gap-12 py-8">
      {/* Hero Section */}
      <section className="bg-blue-900 text-white px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Project Gallery
          </h1>
          <p className="text-xl">
            View our completed restoration projects
          </p>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            {/* Categories */}
            <div className="mb-8">
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

            {/* Filter by Service */}
            <div>
              <h2 className="text-xl font-bold mb-4">Filter by Service</h2>
              <ul className="space-y-2">
                <li>
                  <button className="text-blue-900 hover:underline font-bold">
                    All Services
                  </button>
                </li>
                {SERVICES.map((service) => (
                  <li key={service.href}>
                    <button className="text-blue-900 hover:underline">
                      {service.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="md:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {sampleGallery.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-video bg-gray-100">
                    <div className="absolute inset-0 flex">
                      <div className="w-1/2 h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">Before Image</span>
                      </div>
                      <div className="w-1/2 h-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600">After Image</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                      <span>{project.service}</span>
                      <span>{project.category}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-gray-600 mb-4">{project.description}</p>
                    <button className="text-blue-900 hover:underline">
                      View Details →
                    </button>
                  </div>
                </div>
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
