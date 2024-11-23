'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Locale, getLanguageName, getSupportedLocales } from '../../../config/i18n.config';

interface LanguageSelectorProps {
  currentLocale: Locale;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ currentLocale }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supportedLocales = getSupportedLocales();

  const handleLanguageChange = (locale: Locale) => {
    // Get the path without the current locale prefix
    const newPath = pathname.replace(/^\/[^/]+/, '');
    // Navigate to the new locale path
    router.push(`/${locale}${newPath}`);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md"
        aria-expanded={isOpen ? 'true' : 'false'}
        aria-controls="language-menu"
        id="language-selector"
      >
        <span>{getLanguageName(currentLocale)}</span>
        <svg
          className={`h-5 w-5 text-gray-400 transform transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <ul
          id="language-menu"
          className="absolute right-0 mt-2 py-1 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="language-selector"
        >
          {supportedLocales.map((locale) => (
            <li
              key={locale}
              role="menuitem"
              className="block"
            >
              <button
                type="button"
                className={`
                  w-full text-left px-4 py-2 text-sm
                  ${currentLocale === locale
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
                onClick={() => handleLanguageChange(locale)}
              >
                {getLanguageName(locale)}
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Backdrop for closing the dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default LanguageSelector;
