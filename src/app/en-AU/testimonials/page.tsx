import React from 'react'
import Link from 'next/link'
import { SERVICES } from '../../../constants/services'

interface Testimonial {
  id: string
  name: string
  location: string
  service: string
  rating: number
  review: string
  date: string
}

const sampleTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Thompson',
    location: 'Brisbane',
    service: 'Water Damage',
    rating: 5,
    review: 'Excellent emergency response time. The team was professional and thorough in handling our water damage situation. They kept us informed throughout the process and did a fantastic job.',
    date: '2023-11-28'
  },
  {
    id: '2',
    name: 'John Miller',
    location: 'Gold Coast',
    service: 'Mould Remediation',
    rating: 5,
    review: 'Very knowledgeable team. They identified the source of our mould problem and provided a comprehensive solution. Great attention to detail and excellent results.',
    date: '2023-11-25'
  },
  {
    id: '3',
    name: 'Emma Wilson',
    location: 'Ipswich',
    service: 'Fire Damage',
    rating: 5,
    review: 'Cannot thank the team enough for their help after our fire incident. They were compassionate, professional, and restored our property beyond expectations.',
    date: '2023-11-22'
  },
  {
    id: '4',
    name: 'Michael Chen',
    location: 'Brisbane',
    service: 'Commercial',
    rating: 5,
    review: 'Outstanding commercial restoration service. Minimal disruption to our business operations and excellent project management throughout the restoration process.',
    date: '2023-11-19'
  },
  {
    id: '5',
    name: 'Lisa Anderson',
    location: 'Logan',
    service: 'Flood Recovery',
    rating: 5,
    review: 'Quick response during a flood emergency. The team worked efficiently to minimize damage and their recovery process was thorough and effective.',
    date: '2023-11-16'
  },
  {
    id: '6',
    name: 'David Parker',
    location: 'Redland',
    service: 'Sewage Cleanup',
    rating: 5,
    review: 'Professional and efficient sewage cleanup service. They handled a difficult situation with expertise and ensured proper sanitization of the affected area.',
    date: '2023-11-13'
  }
]

const serviceCategories = SERVICES.map(service => service.name)

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => (
        <span
          key={index}
          className={`text-xl ${
            index < rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
        >
          ★
        </span>
      ))}
    </div>
  )
}

export default function TestimonialsPage() {
  const averageRating = sampleTestimonials.reduce((acc, curr) => acc + curr.rating, 0) / sampleTestimonials.length

  return (
    <div className="flex flex-col gap-12 py-8">
      {/* Hero Section */}
      <section className="bg-blue-900 text-white px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Client Testimonials
          </h1>
          <p className="text-xl">
            See what our clients say about our services
          </p>
        </div>
      </section>

      {/* Rating Summary */}
      <section className="px-4 max-w-4xl mx-auto text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-4">Overall Rating</h2>
          <div className="flex justify-center items-center gap-4 mb-4">
            <StarRating rating={averageRating} />
            <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
          </div>
          <p className="text-gray-600">
            Based on {sampleTestimonials.length} verified reviews
          </p>
        </div>
      </section>

      {/* Testimonials Content */}
      <section className="px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            {/* Filter by Service */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Filter by Service</h2>
              <ul className="space-y-2">
                <li>
                  <button className="text-blue-900 hover:underline font-bold">
                    All Services
                  </button>
                </li>
                {serviceCategories.map((category) => (
                  <li key={category}>
                    <button className="text-blue-900 hover:underline">
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Filter by Rating */}
            <div>
              <h2 className="text-xl font-bold mb-4">Filter by Rating</h2>
              <ul className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <li key={rating}>
                    <button className="flex items-center gap-2 text-blue-900 hover:underline">
                      <StarRating rating={rating} />
                      <span>& Up</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Reviews */}
          <div className="md:col-span-3">
            <div className="space-y-6">
              {sampleTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{testimonial.name}</h3>
                      <p className="text-gray-600">
                        {testimonial.location} • {testimonial.service}
                      </p>
                    </div>
                    <StarRating rating={testimonial.rating} />
                  </div>
                  <p className="text-gray-700 mb-4">{testimonial.review}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(testimonial.date).toLocaleDateString('en-AU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Experience Our Service?</h2>
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
