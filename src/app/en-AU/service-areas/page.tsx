import React from 'react'
import { SERVICE_AREAS } from '../../../constants/areas'
import { CONTACT } from '../../../constants/contact'

export default function ServiceAreasPage() {
  return (
    <div className="flex flex-col gap-12 py-8">
      {/* Hero Section */}
      <section className="bg-blue-900 text-white px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Service Areas
          </h1>
          <p className="text-xl">
            Professional restoration services across South East Queensland
          </p>
        </div>
      </section>

      {/* Areas List */}
      <section className="px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Areas */}
          <div>
            <h2 className="text-3xl font-bold mb-8">Areas We Service</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SERVICE_AREAS.map((area) => (
                <div
                  key={area}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  {area}
                </div>
              ))}
            </div>
          </div>

          {/* Postcode Checker */}
          <div>
            <h2 className="text-3xl font-bold mb-8">Check Your Area</h2>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <form className="space-y-4">
                <div>
                  <label htmlFor="postcode" className="block text-gray-700 mb-2">
                    Enter Your Postcode
                  </label>
                  <input
                    id="postcode"
                    type="text"
                    className="w-full p-2 border rounded-lg"
                    placeholder="e.g., 4000"
                    maxLength={4}
                    pattern="\d{4}"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-800"
                >
                  Check Availability
                </button>
              </form>
              <div className="mt-6 text-sm text-gray-600">
                <p>
                  Not sure if we service your area? Call us at{' '}
                  <a
                    href={`tel:${CONTACT.PHONE}`}
                    className="text-blue-600 hover:underline"
                  >
                    {CONTACT.PHONE}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Map */}
      <section className="px-4 py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Coverage Map</h2>
          <div className="aspect-w-16 aspect-h-9 bg-white rounded-lg shadow-lg">
            {/* Map would be integrated here */}
            <div className="w-full h-[400px] bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-600">Interactive map coming soon</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-900 text-white px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Need Emergency Service?</h2>
          <p className="text-xl mb-8">
            We provide 24/7 emergency response across our service areas
          </p>
          <div className="space-x-4">
            <a
              href={`tel:${CONTACT.PHONE}`}
              className="inline-block bg-white text-blue-900 px-6 py-3 rounded-lg font-bold hover:bg-gray-100"
            >
              Call {CONTACT.PHONE}
            </a>
            <a
              href="/en-AU/emergency"
              className="inline-block bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-bold hover:bg-white hover:text-blue-900"
            >
              Emergency Service
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
