'use client';

import React, { useState } from 'react';
import { useSearch } from '@/hooks/useSearch';

interface SearchResultDisplayProps {
  result: {
    id: string;
    type: string;
    title: string;
    description?: string;
    url: string;
    metadata: {
      score: number;
      matches: string[];
      category?: string;
      tags?: string[];
      lastUpdated: string;
    };
  };
}

const SearchResultDisplay: React.FC<SearchResultDisplayProps> = ({ result }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border rounded p-3 mb-2 bg-white">
      <div 
        className="flex justify-between items-start cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <div className="font-medium">{result.title}</div>
          <div className="text-sm text-gray-500">{result.type}</div>
        </div>
        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
          Score: {result.metadata.score.toFixed(2)}
        </span>
      </div>
      
      {isExpanded && (
        <div className="mt-2 space-y-2 text-sm">
          {result.description && (
            <div className="text-gray-600">{result.description}</div>
          )}
          <div>
            <span className="font-medium">URL: </span>
            <a 
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {result.url}
            </a>
          </div>
          {result.metadata.category && (
            <div>
              <span className="font-medium">Category: </span>
              <span className="text-gray-600">{result.metadata.category}</span>
            </div>
          )}
          {result.metadata.tags && result.metadata.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {result.metadata.tags.map(tag => (
                <span 
                  key={tag}
                  className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface MetricDisplayProps {
  label: string;
  value: number | string;
  color?: string;
}

const MetricDisplay: React.FC<MetricDisplayProps> = ({ 
  label, 
  value, 
  color = 'blue' 
}) => (
  <div className={`p-4 bg-${color}-50 rounded-lg`}>
    <div className="text-sm text-gray-600">{label}</div>
    <div className={`text-2xl font-bold text-${color}-600`}>
      {typeof value === 'number' ? value.toFixed(2) : value}
    </div>
  </div>
);

interface SearchMonitorProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const SearchMonitor: React.FC<SearchMonitorProps> = ({
  position = 'bottom-right'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(process.env.NODE_ENV === 'development');
  const [activeTab, setActiveTab] = useState<'search' | 'metrics' | 'popular'>('search');

  const {
    query,
    results,
    suggestions,
    isLoading,
    metrics,
    updateQuery,
    generateReport
  } = useSearch({
    onSearch: (query, results) => {
      console.log(`Found ${results.length} results for "${query}"`);
    }
  });

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  };

  if (!isVisible) return null;

  const TabButton: React.FC<{
    tab: 'search' | 'metrics' | 'popular';
    label: string;
  }> = ({ tab, label }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
        activeTab === tab
          ? 'bg-white text-blue-600 border-b-2 border-blue-600'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div 
      className={`fixed ${positionClasses[position]} z-50`}
      style={{ maxWidth: isExpanded ? '600px' : '50px' }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute top-2 right-2 z-10 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
      >
        {isExpanded ? '×' : '🔍'}
      </button>

      {isExpanded && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">Search Monitor</h2>
            <div className="mt-3">
              <input
                type="search"
                value={query}
                onChange={(e) => updateQuery(e.target.value)}
                placeholder="Search..."
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {suggestions.length > 0 && (
                <div className="mt-1 bg-white shadow-lg rounded border">
                  {suggestions.map(suggestion => (
                    <div
                      key={suggestion}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => updateQuery(suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="border-b">
            <div className="flex">
              <TabButton tab="search" label="Results" />
              <TabButton tab="metrics" label="Metrics" />
              <TabButton tab="popular" label="Popular" />
            </div>
          </div>

          <div className="p-4 max-h-[60vh] overflow-auto">
            {activeTab === 'search' && (
              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-4 text-gray-600">Searching...</div>
                ) : results.length > 0 ? (
                  results.map(result => (
                    <SearchResultDisplay key={result.id} result={result} />
                  ))
                ) : query ? (
                  <div className="text-center py-4 text-gray-600">No results found</div>
                ) : (
                  <div className="text-center py-4 text-gray-600">
                    Enter a search query above
                  </div>
                )}
              </div>
            )}

            {activeTab === 'metrics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <MetricDisplay 
                    label="Total Searches" 
                    value={metrics.totalSearches}
                  />
                  <MetricDisplay 
                    label="Average Results" 
                    value={metrics.averageResults}
                  />
                  <MetricDisplay 
                    label="Cache Hit Rate" 
                    value={`${(metrics.performance.cacheHitRate * 100).toFixed(1)}%`}
                    color="green"
                  />
                  <MetricDisplay 
                    label="Avg Response Time" 
                    value={`${metrics.performance.averageTime.toFixed(1)}ms`}
                    color="yellow"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Results by Type</h3>
                  <div className="space-y-2">
                    {Object.entries(metrics.resultsByType).map(([type, count]) => (
                      <div 
                        key={type}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                      >
                        <span className="font-medium capitalize">{type}</span>
                        <span className="text-gray-600">{count} results</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'popular' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-3">Popular Searches</h3>
                {metrics.popularQueries.map(({ query, count }, index) => (
                  <div 
                    key={query}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded"
                  >
                    <div className="flex items-center space-x-3">
                      <span className={`
                        w-6 h-6 flex items-center justify-center rounded-full
                        ${index < 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}
                      `}>
                        {index + 1}
                      </span>
                      <span className="font-medium">{query}</span>
                    </div>
                    <span className="text-gray-600">{count} searches</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Last Update: {new Date(metrics.lastUpdate).toLocaleTimeString()}
              </div>
              <button
                onClick={() => generateReport()}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
              >
                Generate Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchMonitor;
