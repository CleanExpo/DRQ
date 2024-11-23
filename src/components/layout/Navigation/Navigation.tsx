'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const navigationItems = [
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
    color: "#34A853",
    subItems: [
      "Emergency Response",
      "Smoke Damage",
      "Property Restoration"
    ]
  },
  {
    title: "Mould Remediation",
    path: "/services/mould",
    color: "#FBBC05",
    subItems: [
      "Inspection",
      "Treatment",
      "Prevention"
    ]
  }
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <div key={item.path} className="relative group">
                <Link 
                  href={item.path}
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                  style={{ color: item.color }}
                >
                  {item.title}
                </Link>
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem}
                      href={`${item.path}/${subItem.toLowerCase().replace(/\s+/g, '-')}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {subItem}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center">
            <a
              href="tel:1300309361"
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
            >
              Call 1300 309 361
            </a>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-gray-900"
            >
              <span className="sr-only">Open menu</span>
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden py-2">
            {navigationItems.map((item) => (
              <div key={item.path} className="space-y-1">
                <Link
                  href={item.path}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  style={{ color: item.color }}
                >
                  {item.title}
                </Link>
                {item.subItems.map((subItem) => (
                  <Link
                    key={subItem}
                    href={`${item.path}/${subItem.toLowerCase().replace(/\s+/g, '-')}`}
                    className="block pl-6 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  >
                    {subItem}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
