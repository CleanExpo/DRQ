'use client';

import React from 'react';
import { LanguageSelector } from '../LanguageSelector/LanguageSelector';
import { Locale } from '../../../config/i18n.config';
import { EmergencyContact } from './EmergencyContact';

interface HeaderProps {
  currentLanguage: Locale;
  availableLanguages: readonly Locale[];
  emergency: {
    phone: string;
    available: boolean;
  };
}

interface NavigationItem {
  title: string;
  path: string;
  color: string;
  subItems?: string[];
}

const navigationItems: NavigationItem[] = [
  {
    title: "Water Damage",
    path: "/services/water-damage",
    color: "#4285F4",
    subItems: [
      "Emergency Response",
      "Commercial Services",
      "Residential Services"
    ]
  },
  {
    title: "Fire Damage",
    path: "/services/fire-damage",
    color: "#EA4335",
    subItems: [
      "Fire Restoration",
      "Smoke Damage",
      "Odor Removal"
    ]
  },
  {
    title: "Mould Remediation",
    path: "/services/mould-remediation",
    color: "#34A853",
    subItems: [
      "Mould Inspection",
      "Mould Removal",
      "Prevention"
    ]
  }
];

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  availableLanguages,
  emergency
}) => {
  return (
    <header className="fixed w-full top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="text-2xl font-bold text-gray-900">
              Disaster Recovery QLD
            </a>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigationItems.map((item) => (
              <div key={item.path} className="relative group">
                <a
                  href={item.path}
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  style={{ borderBottom: `2px solid ${item.color}` }}
                >
                  {item.title}
                </a>
                {item.subItems && (
                  <div className="absolute hidden group-hover:block w-48 bg-white shadow-lg rounded-md mt-2">
                    {item.subItems.map((subItem) => (
                      <a
                        key={subItem}
                        href={`${item.path}/${subItem.toLowerCase().replace(/\s+/g, '-')}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {subItem}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Section: Language Selector and Emergency Contact */}
          <div className="flex items-center space-x-4">
            <LanguageSelector currentLocale={currentLanguage} />
            {emergency.available && (
              <EmergencyContact phone={emergency.phone} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
