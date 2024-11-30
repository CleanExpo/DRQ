'use client';

import React, { useState } from 'react';
import { useRouting } from '@/hooks/useRouting';

interface RouteDisplayProps {
  route: {
    path: string;
    name: string;
    type: string;
    hits: number;
  };
}

const RouteDisplay: React.FC<RouteDisplayProps> = ({ route }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="p-3 rounded-lg bg-gray-50">
      <div 
        className="flex justify-between items-start cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <div className="font-medium">{route.name}</div>
          <div className="text-sm text-gray-600">{route.path}</div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`text-sm px-2 py-1 rounded ${
            route.type === 'protected'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-green-100 text-green-800'
          }`}>
            {route.type}
          </span>
          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {route.hits} hits
          </span>
        </div>
      </div>
    </div>
  );
};

interface MetricDisplayProps {
  label: string;
  value: number | string;
  color?: string;
  subValue?: string;
}

const MetricDisplay: React.FC<MetricDisplayProps> = ({ 
  label, 
  value, 
  color = 'blue',
  subValue
}) => (
  <div className={`p-4 bg-${color}-50 rounded-lg`}>
    <div className="text-sm text-gray-600">{label}</div>
    <div className={`text-2xl font-bold text-${color}-600`}>
      {typeof value === 'number' ? value.toFixed(2) : value}
    </div>
    {subValue && (
      <div className="text-sm text-gray-500 mt-1">{subValue}</div>
    )}
  </div>
);

interface RoutingMonitorProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const RoutingMonitor: React.FC<RoutingMonitorProps> = ({
  position = 'bottom-right'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(process.env.NODE_ENV === 'development');
  const [activeTab, setActiveTab] = useState<'routes' | 'metrics' | 'test'>('routes');
  const [selectedType, setSelectedType] = useState<string>('all');

  const {
    currentRoute,
    metrics,
    navigate,
    registerRoute,
    generateReport
  } = useRouting({
    onRouteChange: (match) => {
      console.log('Route changed:', match);
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
    tab: 'routes' | 'metrics' | 'test';
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

  const handleTestRoute = () => {
    const testRoute = {
      id: 'test-route',
      path: '/test/:id',
      name: 'Test Route',
      meta: {
        auth: true
      }
    };
    registerRoute(testRoute);
    navigate(testRoute, { id: '123' }, { tab: 'test' });
  };

  return (
    <div 
      className={`fixed ${positionClasses[position]} z-50`}
      style={{ maxWidth: isExpanded ? '600px' : '50px' }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute top-2 right-2 z-10 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
      >
        {isExpanded ? '×' : '🔀'}
      </button>

      {isExpanded && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">Routing Monitor</h2>
            <div className="text-sm text-gray-600 mt-1">
              {metrics.activeRoutes} active routes
            </div>
          </div>

          <div className="border-b">
            <div className="flex">
              <TabButton tab="routes" label="Routes" />
              <TabButton tab="metrics" label="Metrics" />
              <TabButton tab="test" label="Test" />
            </div>
          </div>

          <div className="p-4 max-h-[60vh] overflow-auto">
            {activeTab === 'routes' && (
              <div className="space-y-6">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedType('all')}
                    className={`px-3 py-1 rounded text-sm ${
                      selectedType === 'all'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  {Object.keys(metrics.routesByType).map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-3 py-1 rounded text-sm ${
                        selectedType === type
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  {Object.entries(metrics.routeHits)
                    .filter(([path]) => 
                      selectedType === 'all' || 
                      metrics.routesByType[selectedType]
                    )
                    .map(([path, hits]) => (
                      <RouteDisplay
                        key={path}
                        route={{
                          path,
                          name: path.split('/').pop() || path,
                          type: path.includes('auth') ? 'protected' : 'public',
                          hits
                        }}
                      />
                    ))}
                </div>
              </div>
            )}

            {activeTab === 'metrics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <MetricDisplay 
                    label="Total Routes" 
                    value={metrics.totalRoutes}
                  />
                  <MetricDisplay 
                    label="Active Routes" 
                    value={metrics.activeRoutes}
                    color="green"
                  />
                  <MetricDisplay 
                    label="Average Load Time" 
                    value={`${metrics.averageLoadTime.toFixed(2)}ms`}
                    color="yellow"
                  />
                  <MetricDisplay 
                    label="Protected Routes" 
                    value={metrics.routesByType['protected'] || 0}
                    color="purple"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Routes by Type</h3>
                  <div className="space-y-2">
                    {Object.entries(metrics.routesByType).map(([type, count]) => (
                      <div 
                        key={type}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                      >
                        <span className="font-medium capitalize">{type}</span>
                        <span className="text-gray-600">{count} routes</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'test' && (
              <div className="space-y-4">
                <button
                  onClick={handleTestRoute}
                  className="w-full p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <div className="font-medium">Test Route Navigation</div>
                  <div className="text-sm text-gray-600">
                    Navigate to test route with parameters
                  </div>
                </button>

                {currentRoute && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="font-medium">Current Route</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Path: {currentRoute.route.path}
                    </div>
                    <div className="text-sm text-gray-600">
                      Params: {JSON.stringify(currentRoute.params)}
                    </div>
                    <div className="text-sm text-gray-600">
                      Query: {JSON.stringify(currentRoute.query)}
                    </div>
                  </div>
                )}
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

export default RoutingMonitor;
