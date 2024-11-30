'use client';

import { useState, useEffect } from 'react';
import { CacheService } from '../services/core/CacheService';
import { useAriaExpanded } from '../hooks/useAriaExpanded';

interface CacheStats {
  size: number;
  namespaces: { [key: string]: number };
  status: string;
}

export default function CacheMonitor() {
  const [stats, setStats] = useState<CacheStats | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const ariaProps = useAriaExpanded(isVisible);

  useEffect(() => {
    const updateStats = () => {
      const cacheService = CacheService.getInstance();
      setStats(cacheService.getStats());
    };

    // Initial update
    updateStats();

    // Update every 5 seconds
    const interval = setInterval(updateStats, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!stats || process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div 
      className="fixed bottom-4 right-4 z-50"
      data-testid="cache-monitor"
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-700 transition-colors"
        aria-controls="cache-stats-panel"
        data-testid="cache-monitor-toggle"
        {...ariaProps}
      >
        Cache Monitor {isVisible ? '▼' : '▲'}
      </button>

      {/* Stats Panel */}
      {isVisible && (
        <div
          id="cache-stats-panel"
          className="mt-2 p-4 bg-white rounded-lg shadow-lg border border-gray-200 w-80"
          role="region"
          aria-label="Cache statistics"
          data-testid="cache-stats-panel"
        >
          {/* Cache Status */}
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-500">Status</div>
            <div className="flex items-center mt-1">
              <span 
                className={`w-2 h-2 rounded-full mr-2 ${
                  stats.status === 'READY' ? 'bg-green-500' : 'bg-yellow-500'
                }`}
                aria-hidden="true"
              />
              <span className="font-medium">{stats.status}</span>
            </div>
          </div>

          {/* Cache Size */}
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-500">Total Items</div>
            <div className="mt-1 font-medium">{stats.size}</div>
          </div>

          {/* Namespaces */}
          <div>
            <div className="text-sm font-medium text-gray-500 mb-2">Namespaces</div>
            {Object.entries(stats.namespaces).length > 0 ? (
              <ul className="space-y-2" role="list">
                {Object.entries(stats.namespaces).map(([namespace, count]) => (
                  <li 
                    key={namespace}
                    className="flex justify-between items-center text-sm"
                    data-testid={`namespace-${namespace}`}
                  >
                    <span className="text-gray-600">{namespace}</span>
                    <span className="font-medium">{count}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-gray-500">No active namespaces</div>
            )}
          </div>

          {/* Clear Cache Button */}
          <button
            onClick={async () => {
              const cacheService = CacheService.getInstance();
              await cacheService.clear();
              setStats(cacheService.getStats());
            }}
            className="mt-4 w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            data-testid="clear-cache-button"
          >
            Clear Cache
          </button>
        </div>
      )}
    </div>
  );
}
