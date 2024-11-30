'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { services } from '@/config/services';

const DEFAULT_LOCALE = 'en-AU';

export function Navigation() {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isLocationsOpen, setIsLocationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const servicesButtonRef = useRef<HTMLButtonElement>(null);
  const locationsButtonRef = useRef<HTMLButtonElement>(null);
  const servicesMenuRef = useRef<HTMLDivElement>(null);
  const locationsMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (servicesMenuRef.current && !servicesMenuRef.current.contains(event.target as Node)) {
        setIsServicesOpen(false);
      }
      if (locationsMenuRef.current && !locationsMenuRef.current.contains(event.target as Node)) {
        setIsLocationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleServices = () => {
    setIsServicesOpen(!isServicesOpen);
    setIsLocationsOpen(false);
    setIsMobileMenuOpen(false);
  };

  const toggleLocations = () => {
    setIsLocationsOpen(!isLocationsOpen);
    setIsServicesOpen(false);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsServicesOpen(false);
    setIsLocationsOpen(false);
  };

  const getCurrentLocale = (): string => {
    if (!pathname) return DEFAULT_LOCALE;
    const segments = pathname.split('/');
    return segments[1] || DEFAULT_LOCALE;
  };

  const getServiceUrl = (serviceId: string) => {
    const locale = getCurrentLocale();
    return `/${locale}/services/${serviceId}`;
  };

  const getLocationUrl = (location: string) => {
    const locale = getCurrentLocale();
    return `/${locale}/locations/${location.toLowerCase().replace(' ', '-')}`;
  };

  return (
    <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main">
      <div className="flex justify-between h-20">
        <div className="flex items-center">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-3" aria-label="Home">
            <img
              className="h-10 w-auto"
              src="/icon.svg"
              alt="Disaster Recovery QLD Logo"
            />
            <span className="text-xl font-bold text-gray-900">DRQ</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
            {/* Services Dropdown */}
            <div className="relative">
              <button
                ref={servicesButtonRef}
                onClick={toggleServices}
                className="inline-flex items-center px-1 pt-1 text-base font-medium text-gray-900 border-b-2 border-transparent hover:border-red-500 transition-colors duration-200"
                aria-expanded="false"
                {...(isServicesOpen && { 'aria-expanded': 'true' })}
                aria-haspopup="menu"
                aria-controls="services-menu"
                aria-label="Services navigation"
              >
                Services
                <svg
                  className={`ml-2 h-5 w-5 transform transition-transform duration-200 ${
                    isServicesOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isServicesOpen && (
                <div
                  ref={servicesMenuRef}
                  id="services-menu"
                  className="absolute z-10 -ml-4 mt-3 transform px-2 w-screen max-w-md sm:px-0 lg:ml-0 lg:left-1/2 lg:-translate-x-1/2"
                >
                  <div className="rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden backdrop-blur-lg">
                    <div className="relative grid gap-6 bg-white/90 px-5 py-6 sm:gap-8 sm:p-8">
                      {services.map((service) => (
                        <Link
                          key={service.id}
                          href={getServiceUrl(service.id)}
                          className="-m-3 p-3 flex items-start rounded-lg hover:bg-gradient-to-r hover:from-red-50 hover:to-transparent transition-colors duration-200"
                          onClick={() => setIsServicesOpen(false)}
                        >
                          <div className="ml-4">
                            <p className="text-base font-medium text-gray-900">
                              {service.name}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              {service.shortDescription}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Locations Dropdown */}
            <div className="relative">
              <button
                ref={locationsButtonRef}
                onClick={toggleLocations}
                className="inline-flex items-center px-1 pt-1 text-base font-medium text-gray-900 border-b-2 border-transparent hover:border-red-500 transition-colors duration-200"
                aria-expanded="false"
                {...(isLocationsOpen && { 'aria-expanded': 'true' })}
                aria-haspopup="menu"
                aria-controls="locations-menu"
                aria-label="Locations navigation"
              >
                Locations
                <svg
                  className={`ml-2 h-5 w-5 transform transition-transform duration-200 ${
                    isLocationsOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isLocationsOpen && (
                <div
                  ref={locationsMenuRef}
                  id="locations-menu"
                  className="absolute z-10 -ml-4 mt-3 transform px-2 w-screen max-w-md sm:px-0 lg:ml-0 lg:left-1/2 lg:-translate-x-1/2"
                >
                  <div className="rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden backdrop-blur-lg">
                    <div className="relative grid gap-6 bg-white/90 px-5 py-6 sm:gap-8 sm:p-8">
                      {['Brisbane', 'Gold Coast', 'Ipswich', 'Logan', 'Redland Shire'].map((location) => (
                        <Link
                          key={location}
                          href={getLocationUrl(location)}
                          className="-m-3 p-3 flex items-start rounded-lg hover:bg-gradient-to-r hover:from-red-50 hover:to-transparent transition-colors duration-200"
                          onClick={() => setIsLocationsOpen(false)}
                        >
                          <div className="ml-4">
                            <p className="text-base font-medium text-gray-900">
                              {location}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              href={`/${getCurrentLocale()}/emergency`}
              className="inline-flex items-center px-1 pt-1 text-base font-medium text-gray-900 border-b-2 border-transparent hover:border-red-500 transition-colors duration-200"
            >
              Emergency
            </Link>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="hidden sm:ml-6 sm:flex sm:items-center">
          <a
            href="tel:1300309361"
            className="inline-flex items-center px-6 py-2.5 text-base font-medium rounded-lg shadow-lg text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transform hover:scale-105 transition-all duration-200"
          >
            24/7 Emergency: 1300 309 361
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center sm:hidden">
          <button
            onClick={toggleMobileMenu}
            className="inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
            aria-expanded="false"
            {...(isMobileMenuOpen && { 'aria-expanded': 'true' })}
            aria-controls="mobile-menu"
            aria-label="Toggle mobile menu"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className={`h-6 w-6 transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div id="mobile-menu" className="sm:hidden bg-white/95 backdrop-blur-lg">
          <div className="pt-2 pb-3 space-y-1 border-t border-gray-200">
            {services.map((service) => (
              <Link
                key={service.id}
                href={getServiceUrl(service.id)}
                className="block pl-3 pr-4 py-2 text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gradient-to-r hover:from-red-50 hover:to-transparent border-l-4 border-transparent hover:border-red-500 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {service.name}
              </Link>
            ))}
            <Link
              href={`/${getCurrentLocale()}/emergency`}
              className="block pl-3 pr-4 py-2 text-base font-medium text-red-700 bg-gradient-to-r from-red-50 to-transparent border-l-4 border-red-500"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Emergency Contact
            </Link>
            <div className="px-4 py-3">
              <a
                href="tel:1300309361"
                className="block w-full text-center px-4 py-2 text-base font-medium rounded-lg shadow-lg text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-colors duration-200"
              >
                Call Now: 1300 309 361
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
