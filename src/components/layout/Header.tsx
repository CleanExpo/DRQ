'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Phone } from 'lucide-react';
import { Navigation } from './Navigation';

export default function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-blue-900 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <p className="text-sm">24/7 Emergency Response Available</p>
          <a 
            href="tel:1300309361" 
            className="flex items-center gap-2 hover:text-blue-200 transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span className="text-sm font-semibold">1300 309 361</span>
          </a>
        </div>
      </div>

      {/* Main Navigation */}
      <Navigation />
    </header>
  );
}
