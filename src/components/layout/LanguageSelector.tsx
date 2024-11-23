'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { languages, type Language } from '@/config/languages';

interface LanguageSelectorProps {
  currentLanguage: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  const handleLanguageChange = (language: Language) => {
    const newPath = pathname.replace(/^\/[^\/]+/, `/${language.code}`);
    router.push(newPath);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100"
        aria-expanded="false"
        aria-controls="language-dropdown"
        aria-haspopup="true"
        id="language-selector"
      >
        <span>{currentLang.nativeName}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
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

      {isOpen && (
        <div
          id="language-dropdown"
          className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="language-selector"
        >
          {languages.map((language) => (
            <button
              key={language.code}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                language.code === currentLanguage ? 'bg-gray-50 font-medium' : ''
              }`}
              onClick={() => handleLanguageChange(language)}
              role="menuitem"
              tabIndex={0}
            >
              <span className="block text-sm">{language.nativeName}</span>
              <span className="block text-xs text-gray-500">{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
