import React from 'react'
import Link from 'next/link'
import { SERVICE_AREAS } from '../../constants/areas'
import { CONTACT } from '../../constants/contact'
import { SERVICES } from '../../constants/services'

export const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">DRQ</h3>
            <p className="text-gray-300">
              Professional disaster recovery and restoration services across South East Queensland
            </p>
            <div className="mt-4 text-gray-300">
              <p>{CONTACT.ADDRESS.STREET}</p>
              <p>{CONTACT.ADDRESS.SUBURB}, {CONTACT.ADDRESS.STATE} {CONTACT.ADDRESS.POSTCODE}</p>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              {SERVICES.map((service) => (
                <li key={service.href}>
                  <Link
                    href={service.href}
                    className="text-gray-300 hover:text-white"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Service Areas</h3>
            <ul className="space-y-2">
              {SERVICE_AREAS.map((area) => (
                <li key={area} className="text-gray-300">
                  {area}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-4">
              <p className="text-gray-300">
                {CONTACT.HOURS.EMERGENCY}
                <br />
                Call: {CONTACT.PHONE}
              </p>
              <p className="text-gray-300">
                {CONTACT.HOURS.OFFICE}
                <br />
                Email: {CONTACT.EMAIL}
              </p>
              <Link
                href="/en-AU/emergency"
                className="inline-block bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
              >
                Emergency Service
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-blue-800 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} DRQ. All rights reserved.</p>
          <div className="mt-4 space-x-4">
            {Object.entries(CONTACT.SOCIAL).map(([platform, url]) => (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                {platform.charAt(0) + platform.slice(1).toLowerCase()}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
