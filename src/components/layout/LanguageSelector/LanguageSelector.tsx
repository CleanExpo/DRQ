'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Locale, 
  getLanguageName, 
  getSupportedLocales, 
  getDirectionalStyles,
  getLanguageDirection
} from '../../../config/i18n.config';

interface LanguageSelectorProps {
  currentLocale: Locale;
}

type DirectionalStyles = {
  direction: 'rtl' | 'ltr';
  textAlign: 'right' | 'left';
};

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ currentLocale }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const supportedLocales = getSupportedLocales();
  const isRTL = getLanguageDirection(currentLocale) === 'rtl';

  // Filter languages based on search query
  const filteredLocales = supportedLocales.filter(locale => 
    getLanguageName(locale).toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (locale: Locale) => {
    const newPath = pathname.replace(/^\/[^/]+/, '');
    router.push(`/${locale}${newPath}`);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < filteredLocales.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        if (focusedIndex >= 0 && focusedIndex < filteredLocales.length) {
          handleLanguageChange(filteredLocales[focusedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchQuery('');
        break;
    }
  };

  const dirStyles: DirectionalStyles = {
    direction: isRTL ? 'rtl' : 'ltr',
    textAlign: isRTL ? 'right' : 'left'
  };

  const menuId = "language-menu";
  const searchId = "language-search";
  const listboxId = "language-listbox";

  return (
    <div className="relative" ref={dropdownRef} style={dirStyles}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            // Set explicit ARIA attributes when opening
            const button = dropdownRef.current?.querySelector('button');
            if (button) {
              button.setAttribute('aria-expanded', 'true');
            }
          } else {
            // Set explicit ARIA attributes when closing
            const button = dropdownRef.current?.querySelector('button');
            if (button) {
              button.setAttribute('aria-expanded', 'false');
            }
          }
        }}
        className={`
          flex items-center space-x-2 px-4 py-2 text-sm font-medium 
          text-gray-700 hover:text-gray-900 focus:outline-none 
          focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md
          ${isRTL ? 'flex-row-reverse' : ''}
        `}
        aria-expanded="false"
        aria-controls={menuId}
        aria-label="Select language"
        aria-haspopup="true"
      >
        <span className="flex items-center">
          {/* Language code badge */}
          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 text-xs font-medium text-gray-800 mr-2">
            {currentLocale}
          </span>
          {getLanguageName(currentLocale)}
        </span>
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
        <div
          id={menuId}
          className="absolute mt-2 w-72 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
          onKeyDown={handleKeyDown}
          style={{
            [isRTL ? 'right' : 'left']: '0',
          }}
        >
          {/* Search input */}
          <div className="p-2 border-b">
            <label htmlFor={searchId} className="sr-only">
              Search languages
            </label>
            <input
              id={searchId}
              ref={searchInputRef}
              type="text"
              className={`
                w-full px-3 py-2 text-sm border rounded-md
                focus:outline-none focus:ring-2 focus:ring-blue-500
                ${isRTL ? 'text-right' : 'text-left'}
              `}
              placeholder="Search language..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setFocusedIndex(0);
              }}
              style={dirStyles}
            />
          </div>

          {/* Language list */}
          <ul
            id={listboxId}
            className="max-h-60 overflow-auto py-1"
            role="listbox"
            aria-label="Languages"
          >
            {filteredLocales.map((locale, index) => {
              const isSelected = currentLocale === locale;
              return (
                <li
                  key={locale}
                  role="option"
                  {...(isSelected ? { 'aria-selected': 'true' } : { 'aria-selected': 'false' })}
                  className={`
                    ${isSelected ? 'bg-gray-100' : ''}
                    ${focusedIndex === index ? 'bg-blue-50' : ''}
                    cursor-pointer
                  `}
                >
                  <button
                    type="button"
                    className={`
                      w-full px-4 py-2 text-sm flex items-center
                      ${isSelected
                        ? 'text-gray-900 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                      ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}
                    `}
                    onClick={() => handleLanguageChange(locale)}
                  >
                    {/* Language code badge */}
                    <span className={`
                      inline-flex items-center justify-center 
                      h-6 w-6 rounded-full bg-gray-100 
                      text-xs font-medium text-gray-800
                      ${isRTL ? 'ml-2' : 'mr-2'}
                    `}>
                      {locale}
                    </span>
                    {getLanguageName(locale)}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
