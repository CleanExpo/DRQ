'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { CONTACT } from '../../constants/contact';

interface NavItem {
  href: string;
  label: string;
}

const navItems: NavItem[] = [
  { href: '/en-AU/services/water-damage', label: 'Water Damage' },
  { href: '/en-AU/services/flood-recovery', label: 'Flood Recovery' },
  { href: '/en-AU/services/mould-remediation', label: 'Mould Remediation' },
  { href: '/en-AU/services/fire-damage', label: 'Fire Damage' },
  { href: '/en-AU/services/sewage-cleanup', label: 'Sewage Cleanup' },
  { href: '/en-AU/services/commercial', label: 'Commercial' },
  { href: '/en-AU/about', label: 'About' },
  { href: '/en-AU/contact', label: 'Contact' },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/en-AU" className="flex-shrink-0 flex items-center">
              <img
                className="h-8 w-auto"
                src="/images/logo.png"
                alt="Disaster Recovery QLD"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium',
                  pathname === item.href && 'text-blue-600 font-semibold'
                )}
              >
                {item.label}
              </Link>
            ))}
            <Button
              as="a"
              href={`tel:${CONTACT.phone}`}
              variant="primary"
              className="ml-4"
            >
              {CONTACT.phone}
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                  pathname === item.href && 'text-blue-600 bg-blue-50'
                )}
              >
                {item.label}
              </Link>
            ))}
            <Button
              as="a"
              href={`tel:${CONTACT.phone}`}
              variant="primary"
              className="w-full mt-4"
            >
              {CONTACT.phone}
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
