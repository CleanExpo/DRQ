import React from 'react'
import Link from 'next/link'
import { CONTACT } from '../constants/contact'

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </p>
        <div className="space-y-6">
          <div className="space-x-4">
            <Link
              href="/en-AU"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors"
            >
              Go Home
            </Link>
            <Link
              href="/en-AU/contact"
              className="inline-block border-2 border-primary text-primary px-6 py-3 rounded-lg font-bold hover:bg-primary hover:text-white transition-colors"
            >
              Contact Us
            </Link>
          </div>
          <div className="text-gray-600">
            <p>Need immediate assistance?</p>
            <p>
              Call us at{' '}
              <a
                href={`tel:${CONTACT.PHONE}`}
                className="text-primary hover:underline font-semibold"
              >
                {CONTACT.PHONE}
              </a>
            </p>
          </div>
          <div className="text-sm text-gray-500">
            <p>Available 24/7 for emergency services</p>
          </div>
        </div>
      </div>
    </div>
  )
}
