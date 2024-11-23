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
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = 'search-listbox';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string) => {
    try {
      const trimmedQuery = searchQuery.trim();
      if (trimmedQuery) {
        const searchPath = `/search?q=${encodeURIComponent(trimmedQuery)}`;
        router.push(searchPath);
        onSearch?.(trimmedQuery);
        setIsOpen(false);
      }
    } catch (error) {
      reportError(error as Error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setIsOpen(Boolean(newQuery.trim()));
  };

  const inputProps: InputProps = {
    ref: inputRef,
    type: 'text',
    value: query,
    onChange: handleInputChange,
    onKeyDown: handleKeyDown,
    onFocus: () => setIsOpen(Boolean(query.trim())),
    placeholder,
    className: "w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500",
    'data-testid': 'search-input',
    'aria-label': 'Search input',
    role: 'combobox',
    'aria-expanded': isOpen,
    'aria-controls': listboxId,
    'aria-owns': listboxId,
    'aria-haspopup': 'listbox',
    'aria-autocomplete': 'list'
  };

  return (
    <div 
      className={`relative ${className}`} 
      data-testid="search-bar"
      role="search"
    >
      <form 
        onSubmit={handleSubmit} 
        className="relative"
        role="search"
      >
        <div className="relative">
          <input {...inputProps} />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
            data-testid="search-button"
            aria-label="Submit search"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
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

      {isOpen && query.trim() && (
        <ul 
          id={listboxId}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg"
          data-testid="search-suggestions"
          role="listbox"
          aria-label="Search suggestions"
        >
          <li 
            role="option"
            aria-selected="false"
            className="p-2 text-sm text-gray-500 cursor-pointer hover:bg-gray-100 rounded"
            onClick={() => handleSearch(query)}
            data-testid="search-suggestion-current"
            id="search-current"
          >
            Search for &quot;{query.trim()}&quot;
          </li>
          <li 
            role="option"
            aria-selected="false"
            className="p-2 text-sm text-gray-500 cursor-pointer hover:bg-gray-100"
            onClick={() => handleSearch("Water Damage Services")}
            id="search-water-damage"
          >
            Water Damage Services
          </li>
          <li 
            role="option"
            aria-selected="false"
            className="p-2 text-sm text-gray-500 cursor-pointer hover:bg-gray-100"
            onClick={() => handleSearch("Fire Damage Restoration")}
            id="search-fire-damage"
          >
            Fire Damage Restoration
          </li>
          <li 
            role="option"
            aria-selected="false"
            className="p-2 text-sm text-gray-500 cursor-pointer hover:bg-gray-100"
            onClick={() => handleSearch("Mould Remediation")}
            id="search-mould"
          >
            Mould Remediation
          </li>
        </ul>
      )}
    </div>
  );
};
