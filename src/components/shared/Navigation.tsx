import React from 'react'
import Link from 'next/link'
import { CONTACT } from '../../constants/contact'
import { SERVICES } from '../../constants/services'

export const Navigation = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/en-AU" className="flex items-center">
              <span className="text-xl font-bold text-blue-900">DRQ</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-900">
                <span>Services</span>
              </button>
              <div className="absolute top-full left-0 w-48 bg-white shadow-lg rounded-lg py-2 hidden group-hover:block">
                {SERVICES.map((service) => (
                  <Link
                    key={service.href}
                    href={service.href}
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-900"
                  >
                    {service.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link
              href="/en-AU/contact"
              className="text-gray-700 hover:text-blue-900"
            >
              Contact
            </Link>
            <div className="text-gray-700">
              Call: {CONTACT.PHONE}
            </div>
            <Link
              href="/en-AU/emergency"
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Emergency Service
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
