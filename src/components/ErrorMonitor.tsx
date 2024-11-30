'use client';

import React, { useState } from 'react';
import { useError } from '@/hooks/useError';

interface ErrorDisplayProps {
  error: {
    type: string;
    name: string;
    message: string;
    severity: string;
    count: number;
    status: string;
    firstSeen: string;
    lastSeen: string;
    metadata: {
      affectedUsers: number;
      affectedSessions: number;
    };
  };
  onResolve: () => void;
  onIgnore: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  error,
  onResolve,
  onIgnore
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { getSeverityColor, getTypeIcon } = useError();

  return (
    <div className={`p-3 rounded-lg bg-${getSeverityColor(error.severity)}-50`}>
      <div 
        className="flex justify-between items-start cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <div className="flex items-center space-x-2">
            <span>{getTypeIcon(error.type)}</span>
            <span className="font-medium">{error.name}</span>
          </div>
          <div className="text-sm text-gray-600">{error.message}</div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`text-sm px-2 py-1 rounded bg-${getSeverityColor(error.severity)}-100 text-${getSeverityColor(error.severity)}-800`}>
            {error.severity}
          </span>
          <span className="text-sm bg-gray-100 px-2 py-1 rounded">
            {error.count}×
          </span>
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-3 space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">First Seen: </span>
              <span className="text-gray-600">
                {new Date(error.firstSeen).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="font-medium">Last Seen: </span>
              <span className="text-gray-600">
                {new Date(error.lastSeen).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="font-medium">Affected Users: </span>
              <span className="text-gray-600">{error.metadata.affectedUsers}</span>
            </div>
            <div>
              <span className="font-medium">Affected Sessions: </span>
              <span className="text-gray-600">{error.metadata.affectedSessions}</span>
            </div>
          </div>

          {error.status === 'active' && (
            <div className="flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onResolve();
                }}
                className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
              >
                Resolve
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onIgnore();
                }}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                Ignore
              </button>
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

interface ErrorMonitorProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const ErrorMonitor: React.FC<ErrorMonitorProps> = ({
  position = 'bottom-right'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(process.env.NODE_ENV === 'development');
  const [activeTab, setActiveTab] = useState<'active' | 'metrics' | 'test'>('active');

  const {
    metrics,
    trackError,
    resolveError,
    ignoreError,
    getSeverityColor,
    generateReport
  } = useError({
    onError: (error) => {
      console.log('Error tracked:', error);
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
    tab: 'active' | 'metrics' | 'test';
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
        {isExpanded ? '×' : '⚠️'}
      </button>

      {isExpanded && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">Error Monitor</h2>
            <div className="text-sm text-gray-600 mt-1">
              {metrics.activeErrors} active errors
            </div>
          </div>

          <div className="border-b">
            <div className="flex">
              <TabButton tab="active" label="Active" />
              <TabButton tab="metrics" label="Metrics" />
              <TabButton tab="test" label="Test" />
            </div>
          </div>

          <div className="p-4 max-h-[60vh] overflow-auto">
            {activeTab === 'active' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <MetricDisplay 
                    label="Active Errors" 
                    value={metrics.activeErrors}
                    color="red"
                  />
                  <MetricDisplay 
                    label="Error Rate" 
                    value={`${metrics.errorRate}/hr`}
                    color="yellow"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Top Errors</h3>
                  <div className="space-y-2">
                    {metrics.topErrors.map(error => (
                      <div 
                        key={error.hash}
                        className="p-3 bg-gray-50 rounded"
                      >
                        <div className="font-medium">{error.message}</div>
                        <div className="text-sm text-gray-600">
                          {error.count} occurrences
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'metrics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <MetricDisplay 
                    label="Total Errors" 
                    value={metrics.totalErrors}
                  />
                  <MetricDisplay 
                    label="Active Errors" 
                    value={metrics.activeErrors}
                    color="red"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Errors by Type</h3>
                  <div className="space-y-2">
                    {Object.entries(metrics.errorsByType).map(([type, count]) => (
                      <div 
                        key={type}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                      >
                        <span className="font-medium capitalize">{type}</span>
                        <span className="text-gray-600">{count} errors</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Errors by Severity</h3>
                  <div className="space-y-2">
                    {Object.entries(metrics.errorsBySeverity).map(([severity, count]) => (
                      <div 
                        key={severity}
                        className={`flex justify-between items-center p-2 rounded bg-${getSeverityColor(severity)}-50`}
                      >
                        <span className="font-medium capitalize">{severity}</span>
                        <span className="text-gray-600">{count} errors</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'test' && (
              <div className="space-y-4">
                <button
                  onClick={() => trackError(new Error('Test Runtime Error'), {
                    type: 'runtime',
                    severity: 'high'
                  })}
                  className="w-full p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <div className="font-medium">Test Runtime Error</div>
                  <div className="text-sm text-gray-600">
                    Simulate a high severity runtime error
                  </div>
                </button>

                <button
                  onClick={() => trackError(new Error('Test Network Error'), {
                    type: 'network',
                    severity: 'medium'
                  })}
                  className="w-full p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
                >
                  <div className="font-medium">Test Network Error</div>
                  <div className="text-sm text-gray-600">
                    Simulate a medium severity network error
                  </div>
                </button>

                <button
                  onClick={() => trackError(new Error('Test UI Error'), {
                    type: 'ui',
                    severity: 'low'
                  })}
                  className="w-full p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <div className="font-medium">Test UI Error</div>
                  <div className="text-sm text-gray-600">
                    Simulate a low severity UI error
                  </div>
                </button>
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

export default ErrorMonitor;
