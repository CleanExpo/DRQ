'use client';

import React from 'react';

interface StyleProviderProps {
  children: React.ReactNode;
}

export function StyleProvider({ children }: StyleProviderProps) {
  return (
    <div className="antialiased text-gray-900 selection:bg-red-500 selection:text-white">
      {children}
    </div>
  );
}
