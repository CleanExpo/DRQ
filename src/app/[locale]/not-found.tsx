import Link from 'next/link';
import { services } from '@/config/services';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white">
      {/* 404 Section */}
      <div className="px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
        <div className="max-w-max mx-auto">
          <main className="sm:flex">
            <p className="text-4xl font-bold text-red-600 sm:text-5xl">404</p>
            <div className="sm:ml-6">
              <div className="sm:border-l sm:border-gray-200 sm:pl-6">
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl">
                  Page not found
                </h1>
                <p className="mt-1 text-base text-gray-500">
                  The page you're looking for doesn't exist or has been moved.
                </p>
              </div>
              <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Go back home
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  View services
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Emergency Contact Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 rounded-lg p-6">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-red-800">
              Need Emergency Assistance?
            </h2>
            <p className="mt-2 text-red-700">
              Our emergency response team is available 24/7
            </p>
            <div className="mt-4">
              <a
                href="tel:1300XXXXXX"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Call 1300 XXX XXX
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Available Services Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Our Services
          </h2>
          <p className="mt-4 text-gray-500">
            Explore our professional restoration services
          </p>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-medium text-gray-900">
                {service.name}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {service.shortDescription}
              </p>
              <div className="mt-4">
                <Link
                  href={`/services/${service.id}`}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Learn more →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Areas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-16">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Service Areas
          </h2>
          <p className="mt-2 text-gray-500">
            We provide emergency restoration services across South East Queensland:
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {[
              'Brisbane',
              'Gold Coast',
              'Ipswich',
              'Logan',
              'Redland Shire'
            ].map((area) => (
              <span
                key={area}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-16">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Quick Links
          </h2>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="text-red-600 hover:text-red-700"
            >
              Home
            </Link>
            <Link
              href="/services"
              className="text-red-600 hover:text-red-700"
            >
              Services
            </Link>
            <Link
              href="/locations"
              className="text-red-600 hover:text-red-700"
            >
              Locations
            </Link>
            <Link
              href="/emergency"
              className="text-red-600 hover:text-red-700"
            >
              Emergency Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
