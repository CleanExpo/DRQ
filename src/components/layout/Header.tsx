'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LanguageSelector } from './LanguageSelector';
import { EmergencyContact } from './EmergencyContact';
import { navigationItems } from '@/config/navigation';
import { type Locale } from '@/config/i18n.config';

interface HeaderProps {
  currentLanguage: Locale;
}

const Header = ({ currentLanguage }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Disaster Recovery QLD
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8" aria-label="Main navigation">
            {navigationItems.map((item) => (
              <div key={item.path} className="relative group">
                <Link
                  href={item.path}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium
                    ${pathname.startsWith(item.path)
                      ? 'text-gray-900 border-b-2 border-blue-500'
                      : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'
                    }`}
                >
                  {item.title}
                </Link>
                {item.subItems && (
                  <ul 
                    className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                    role="list"
                  >
                    {item.subItems.map((subItem) => (
                      <li key={subItem}>
                        <Link
                          href={`${item.path}#${subItem.toLowerCase().replace(/\s+/g, '-')}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {subItem}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </nav>

          {/* Right side items */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSelector currentLanguage={currentLanguage} />
            <EmergencyContact phone="1300309361" available={true} />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen ? "true" : "false"}
              aria-label={isMenuOpen ? 'Close main menu' : 'Open main menu'}
              data-state={isMenuOpen ? 'open' : 'closed'}
              type="button"
            >
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
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
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
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
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <nav 
        id="mobile-menu"
        className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}
        aria-label="Mobile navigation"
        role="navigation"
      >
        <ul className="pt-2 pb-3 space-y-1" role="list">
          {navigationItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`block pl-3 pr-4 py-2 text-base font-medium ${
                  pathname.startsWith(item.path)
                    ? 'text-blue-700 bg-blue-50 border-l-4 border-blue-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:border-l-4 hover:border-gray-300'
                }`}
              >
                {item.title}
              </Link>
              {item.subItems && (
                <ul className="pl-6 space-y-1" role="list">
                  {item.subItems.map((subItem) => (
                    <li key={subItem}>
                      <Link
                        href={`${item.path}#${subItem.toLowerCase().replace(/\s+/g, '-')}`}
                        className="block py-2 pl-3 pr-4 text-sm text-gray-500 hover:text-gray-700"
                      >
                        {subItem}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="space-y-3 px-4">
            <LanguageSelector currentLanguage={currentLanguage} />
            <EmergencyContact phone="1300309361" available={true} />
          </div>
        </div>
      </nav>
    </header>
  );
};

export { Header };
export default Header;
