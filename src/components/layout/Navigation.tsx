'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAnalytics } from '../../hooks/useAnalytics';
import ServiceAreaDropdown from '../navigation/ServiceAreaDropdown';

interface NavigationItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
  children?: Array<{
    name: string;
    href: string;
  }>;
}

const navigationItems: NavigationItem[] = [
  {
    name: 'Home',
    href: '/en-AU',
    icon: '🏠'
  },
  {
    name: 'Services',
    href: '#',
    icon: '🔧',
    children: [
      { name: 'Water Damage', href: '/en-AU/services/water-damage' },
      { name: 'Flood Recovery', href: '/en-AU/services/flood-recovery' },
      { name: 'Mould Remediation', href: '/en-AU/services/mould-remediation' },
      { name: 'Fire Damage', href: '/en-AU/services/fire-damage' },
      { name: 'Sewage Cleanup', href: '/en-AU/services/sewage-cleanup' },
      { name: 'Commercial', href: '/en-AU/services/commercial' }
    ]
  },
  {
    name: 'About',
    href: '/en-AU/about',
    icon: 'ℹ️'
  },
  {
    name: 'Contact',
    href: '/en-AU/contact',
    icon: '📞'
  }
];

export const Navigation: React.FC = () => {
  const pathname = usePathname();
  const { trackEvent } = useAnalytics();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '#') return false;
    return pathname === href;
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    trackEvent('navigation', 'mobile_menu', isMobileMenuOpen ? 'close' : 'open');
  };

  return (
    <nav className="bg-gray-800" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/en-AU" className="text-white font-bold text-xl">
              DRQ
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive(item.href)
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                onClick={() => trackEvent('navigation', 'click', 'link', { item: item.name })}
              >
                {item.icon && <span className="mr-2" aria-hidden="true">{item.icon}</span>}
                {item.name}
              </Link>
            ))}
            <ServiceAreaDropdown />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={handleMobileMenuToggle}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              aria-controls="mobile-menu"
              {...{ 'aria-expanded': isMobileMenuOpen ? 'true' : 'false' }}
            >
              <span className="sr-only">
                {isMobileMenuOpen ? 'Close main menu' : 'Open main menu'}
              </span>
              {isMobileMenuOpen ? (
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
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(item.href)
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  trackEvent('navigation', 'click', 'mobile_link', {
                    item: item.name
                  });
                }}
              >
                <div className="flex items-center">
                  {item.icon && <span className="mr-2" aria-hidden="true">{item.icon}</span>}
                  {item.name}
                </div>
              </Link>
            ))}
            <div className="mt-4">
              <ServiceAreaDropdown />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
