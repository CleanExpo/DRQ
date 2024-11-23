'use client';

import React from 'react';

interface SearchTypeFilterProps {
  selectedType: 'all' | 'service' | 'location';
  onChange: (type: 'all' | 'service' | 'location') => void;
}

export const SearchTypeFilter: React.FC<SearchTypeFilterProps> = ({
  selectedType,
  onChange
}) => {
  return (
    <div className="flex gap-2 mb-4">
      <button
        onClick={() => onChange('all')}
        className={`px-3 py-1 rounded-full text-sm ${
          selectedType === 'all'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        All
      </button>
      <button
        onClick={() => onChange('service')}
        className={`px-3 py-1 rounded-full text-sm ${
          selectedType === 'service'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Services
      </button>
      <button
        onClick={() => onChange('location')}
        className={`px-3 py-1 rounded-full text-sm ${
          selectedType === 'location'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Locations
      </button>
    </div>
  );
};
