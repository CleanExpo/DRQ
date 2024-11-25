import React from 'react';
import { NavigationMenu } from './NavigationMenu';
import { LanguageSelector } from '../LanguageSelector';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  return (
    <header className={`w-full bg-white shadow-md ${className}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Logo placeholder */}
            <div className="text-2xl font-bold">DRQ</div>
            <NavigationMenu />
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            {/* Emergency contact button placeholder */}
            <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
              Emergency Contact
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
