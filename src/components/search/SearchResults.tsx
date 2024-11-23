'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface SearchResult {
  type: 'service' | 'location' | 'article';
  title: string;
  description: string;
  url: string;
  priority: number;
  relevance: number;
}

interface SearchResultsProps {
  results: SearchResult[];
  isLoading?: boolean;
  error?: string;
  isCached?: boolean;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  isLoading,
  error,
  isCached
}) => {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        <p>{error}</p>
        <a
          href="tel:1300309361"
          className="mt-4 inline-flex items-center text-red-600 hover:text-red-800"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          Call Emergency: 1300 309 361
        </a>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">No results found</p>
        <div className="bg-blue-50 rounded-lg p-6 max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold text-blue-900 mb-2">
            Need Immediate Assistance?
          </h3>
          <p className="text-blue-800 mb-4">
            Our emergency response team is available 24/7.
          </p>
          <a
            href="tel:1300309361"
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-full
                     hover:bg-red-700 transition-colors duration-300 font-semibold"
          >
            Call 1300 309 361
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isCached && (
        <div className="text-sm text-gray-500 mb-2 flex items-center">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Results loaded from cache
        </div>
      )}
      {results.map((result, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
        >
          <button
            onClick={() => router.push(result.url)}
            className="w-full text-left p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {result.title}
                </h3>
                <p className="text-gray-600">{result.description}</p>
              </div>
              <span
                className={`ml-4 px-3 py-1 rounded-full text-sm font-medium ${
                  result.type === 'service'
                    ? 'bg-blue-100 text-blue-800'
                    : result.type === 'location'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {result.type}
              </span>
            </div>
            {result.type === 'service' && (
              <div className="mt-4 flex items-center text-blue-600">
                <span className="text-sm font-medium">Learn more</span>
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            )}
          </button>
        </div>
      ))}
    </div>
  );
};
