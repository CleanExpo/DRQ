'use client';

import { useState } from 'react';
import { useClient } from '@/components/providers/ClientProvider';

export const NavigationMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { navigate } = useClient();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="hidden md:flex space-x-8">
        <button 
          onClick={() => handleNavigation('/water-damage')}
          className="text-gray-700 hover:text-gray-900 bg-transparent border-none cursor-pointer"
        >
          Water Damage
        </button>
        <button 
          onClick={() => handleNavigation('/fire-damage')}
          className="text-gray-700 hover:text-gray-900 bg-transparent border-none cursor-pointer"
        >
          Fire Damage
        </button>
        <button 
          onClick={() => handleNavigation('/mould')}
          className="text-gray-700 hover:text-gray-900 bg-transparent border-none cursor-pointer"
        >
          Mould Remediation
        </button>
      </nav>

      <div className="md:hidden">
        <button
          className="p-2"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white shadow-md py-4 px-4">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => handleNavigation('/water-damage')}
                className="text-left text-gray-700 hover:text-gray-900 bg-transparent border-none cursor-pointer"
              >
                Water Damage
              </button>
              <button 
                onClick={() => handleNavigation('/fire-damage')}
                className="text-left text-gray-700 hover:text-gray-900 bg-transparent border-none cursor-pointer"
              >
                Fire Damage
              </button>
              <button 
                onClick={() => handleNavigation('/mould')}
                className="text-left text-gray-700 hover:text-gray-900 bg-transparent border-none cursor-pointer"
              >
                Mould Remediation
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
