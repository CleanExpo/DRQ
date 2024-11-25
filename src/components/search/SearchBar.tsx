// src/components/search/SearchBar.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { reportError } from '../../utils/errorHandler';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
}

type AriaAttributes = {
  'aria-expanded': boolean;
  'aria-controls'?: string;
  'aria-owns'?: string;
  'aria-haspopup': 'listbox';
  'aria-autocomplete': 'list';
  'aria-label': string;
  role: 'combobox';
};

type TestAttributes = {
  'data-testid'?: string;
};

type InputProps = React.ComponentPropsWithRef<'input'> & AriaAttributes & TestAttributes;

export const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = 'Search for services...', 
  className = '',
  onSearch
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    try {
      if (onSearch) {
        onSearch(trimmedQuery);
      } else {
        await router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      }
    } catch (error) {
      reportError(error as Error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  const inputProps: InputProps = {
    ref: inputRef,
    type: 'search',
    value: query,
    onChange: (e) => setQuery(e.target.value),
    onKeyDown: handleKeyDown,
    placeholder,
    'aria-expanded': false,
    'aria-haspopup': 'listbox',
    'aria-autocomplete': 'list',
    'aria-label': 'Search services',
    role: 'combobox',
    'data-testid': 'search-input'
  };

  return (
    <form 
      role="search" 
      onSubmit={handleSubmit}
      className={`relative ${className}`}
    >
      <div className="relative">
        <input
          {...inputProps}
          className="w-full px-4 py-2 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="absolute right-0 top-0 mt-2 mr-2"
          aria-label="Submit search"
        >
          <svg 
            className="w-6 h-6 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </button>
      </div>
    </form>
  );
};