'use client';

import React, { useState, useEffect } from 'react';
import { useDiagnostic } from '../hooks/useDiagnostic';
import { DiagnosticScheduler } from './DiagnosticScheduler';
import { DiagnosticAlert } from './DiagnosticAlert';
import { DiagnosticAnalytics } from './DiagnosticAnalytics';

interface DiagnosticDisplayProps {
  result: {
    type: 'error' | 'warning' | 'info';
    code: string;
    message: string;
    details?: Record<string, any>;
    timestamp: number;
  };
}

const DiagnosticDisplay: React.FC<DiagnosticDisplayProps> = ({ result }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { formatTimestamp, getErrorSeverity } = useDiagnostic();

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'red';
      case 'warning':
        return 'yellow';
      case 'info':
        return 'blue';
      default:
        return 'gray';
    }
  };

  return (
    <div className={`p-4 bg-${getTypeColor(result.type)}-50 rounded-lg`}>
      <div 
        className="flex justify-between items-start cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        aria-expanded="false"
        data-expanded={isExpanded}
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsExpanded(!isExpanded);
          }
        }}
      >
        <div>
          <div className="font-medium">{result.code}</div>
          <div className="text-sm text-gray-600">{result.message}</div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`text-sm px-2 py-1 rounded bg-${getTypeColor(result.type)}-100 text-${getTypeColor(result.type)}-800`}>
            {getErrorSeverity(result)}
          </span>
        </div>
      </div>
      
      {isExpanded && result.details && (
        <div className="mt-4 space-y-2">
          <div className="text-sm">
            <div className="font-medium">Details:</div>
            <pre className="mt-1 p-2 bg-gray-100 rounded overflow-auto">
              {JSON.stringify(result.details, null, 2)}
            </pre>
          </div>
          <div className="text-sm text-gray-600">
            Timestamp: {formatTimestamp(result.timestamp)}
          </div>
        </div>
      )}
    </div>
  );
};

interface MetricDisplayProps {
  label: string;
  value: number | string;
  threshold?: {
    warning: number;
    error: number;
  };
  unit?: string;
  color?: string;
  subValue?: string;
}

const MetricDisplay: React.FC<MetricDisplayProps> = ({ 
  label, 
  value, 
  threshold,
  unit = '',
  color = 'blue',
  subValue
}) => {
  const getMetricColor = () => {
    if (!threshold || typeof value !== 'number') return color;
    if (value >= threshold.error) return 'red';
    if (value >= threshold.warning) return 'yellow';
    return 'green';
  };

  const metricColor = getMetricColor();
  const ariaLabel = `${label}: ${value}${unit}${subValue ? `, ${subValue}` : ''}`;

  return (
    <div className={`p-4 bg-${metricColor}-50 rounded-lg`} role="status" aria-label={ariaLabel}>
      <div className="text-sm text-gray-600">{label}</div>
      <div className={`text-2xl font-bold text-${metricColor}-600`}>
        {typeof value === 'number' ? value.toFixed(0) : value}
        {unit && <span className="text-sm ml-1">{unit}</span>}
      </div>
      {subValue && (
        <div className="text-sm text-gray-500 mt-1">{subValue}</div>
      )}
      {threshold && typeof value === 'number' && (
        <div className="mt-2 text-xs text-gray-500">
          Threshold: {threshold.warning}{unit} / {threshold.error}{unit}
        </div>
      )}
    </div>
  );
};

interface DiagnosticMonitorProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const DiagnosticMonitor: React.FC<DiagnosticMonitorProps> = ({
  position = 'bottom-right'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(process.env.NODE_ENV === 'development');
  const [activeTab, setActiveTab] = useState<'results' | 'metrics' | 'info' | 'scheduler' | 'alerts' | 'analytics'>('results');

  const {
    currentInfo,
    results,
    performanceMetrics,
    isAnalyzing,
    isCollectingMetrics,
    analyzeLighthouseError,
    collectPerformanceMetrics,
    generateReport,
    clearDiagnostics,
    getSummary,
    setDiagnosticInfo
  } = useDiagnostic({
    onDiagnosticResult: (result) => {
      console.log('New diagnostic result:', result);
    },
    onPerformanceMetrics: (metrics) => {
      console.log('Performance metrics collected:', metrics);
    },
    autoCollectMetrics: true
  });

  useEffect(() => {
    if (!currentInfo) {
      const info = {
        version: '12.2.2',
        url: window.location.href,
        error: '',
        userAgent: navigator.userAgent,
        benchmarkIndex: 4496,
        timestamp: Date.now()
      };
      setDiagnosticInfo(info);
    }
  }, [currentInfo, setDiagnosticInfo]);

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  };

  if (!isVisible) return null;

  const summary = getSummary();

  const tabs = ['results', 'metrics', 'info', 'scheduler', 'alerts', 'analytics'] as const;

  return (
    <div 
      className={`fixed ${positionClasses[position]} z-50`}
      style={{ maxWidth: isExpanded ? '800px' : '50px' }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute top-2 right-2 z-10 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
        aria-label={isExpanded ? 'Collapse diagnostic monitor' : 'Expand diagnostic monitor'}
        aria-expanded="false"
        data-expanded={isExpanded}
      >
        {isExpanded ? '×' : '🔍'}
      </button>

      {isExpanded && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden" role="dialog" aria-label="Diagnostic Monitor">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold" id="monitor-title">Diagnostic Monitor</h2>
            <div className="text-sm text-gray-600 mt-1">
              {results.length} diagnostic results
            </div>
          </div>

          <div className="border-b" role="tablist" aria-label="Diagnostic sections">
            {tabs.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  role="tab"
                  aria-selected="false"
                  data-selected={isActive}
                  aria-controls={`panel-${tab}`}
                  id={`tab-${tab}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                    isActive
                      ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              );
            })}
          </div>

          <div 
            className="p-4 max-h-[60vh] overflow-auto"
            role="tabpanel"
            id={`panel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
            tabIndex={0}
          >
            {activeTab === 'scheduler' ? (
              <DiagnosticScheduler />
            ) : activeTab === 'alerts' ? (
              <DiagnosticAlert />
            ) : activeTab === 'analytics' ? (
              <DiagnosticAnalytics />
            ) : activeTab === 'results' ? (
              <div className="space-y-4">
                {results.map((result, index) => (
                  <DiagnosticDisplay key={index} result={result} />
                ))}
                {results.length === 0 && (
                  <div className="text-center text-gray-500">
                    No diagnostic results yet
                  </div>
                )}
              </div>
            ) : activeTab === 'metrics' ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <MetricDisplay 
                    label="Total Results" 
                    value={results.length}
                  />
                  <MetricDisplay 
                    label="Errors" 
                    value={summary.totalErrors}
                    color="red"
                  />
                  <MetricDisplay 
                    label="Warnings" 
                    value={summary.totalWarnings}
                    color="yellow"
                  />
                  <MetricDisplay 
                    label="Info" 
                    value={summary.totalInfos}
                    color="blue"
                  />
                </div>

                {performanceMetrics && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Performance Metrics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <MetricDisplay 
                        label="Time to First Byte" 
                        value={performanceMetrics.timeToFirstByte}
                        unit="ms"
                        threshold={{ warning: 400, error: 600 }}
                      />
                      <MetricDisplay 
                        label="First Contentful Paint" 
                        value={performanceMetrics.firstContentfulPaint}
                        unit="ms"
                        threshold={{ warning: 1800, error: 3000 }}
                      />
                      <MetricDisplay 
                        label="Largest Contentful Paint" 
                        value={performanceMetrics.largestContentfulPaint}
                        unit="ms"
                        threshold={{ warning: 2500, error: 4000 }}
                      />
                      <MetricDisplay 
                        label="Cumulative Layout Shift" 
                        value={performanceMetrics.cumulativeLayoutShift}
                        threshold={{ warning: 0.1, error: 0.25 }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {currentInfo && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3">Diagnostic Info</h3>
                    <div className="space-y-2">
                      <div>
                        <div className="text-sm text-gray-600">URL</div>
                        <div className="font-medium">{currentInfo.url}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Error</div>
                        <div className="font-medium">{currentInfo.error || 'None'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">User Agent</div>
                        <div className="font-medium truncate">{currentInfo.userAgent}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {!['scheduler', 'alerts', 'analytics'].includes(activeTab) && (
            <div className="p-4 border-t bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="space-x-2">
                  <button
                    onClick={() => analyzeLighthouseError()}
                    disabled={isAnalyzing}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors disabled:opacity-50"
                    aria-label={isAnalyzing ? 'Analyzing diagnostics...' : 'Analyze diagnostics'}
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                  </button>
                  <button
                    onClick={() => collectPerformanceMetrics()}
                    disabled={isCollectingMetrics}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
                    aria-label={isCollectingMetrics ? 'Collecting metrics...' : 'Collect metrics'}
                  >
                    {isCollectingMetrics ? 'Collecting...' : 'Collect Metrics'}
                  </button>
                  <button
                    onClick={() => clearDiagnostics()}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                    aria-label="Clear all diagnostics"
                  >
                    Clear
                  </button>
                </div>
                <button
                  onClick={() => generateReport()}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                  aria-label="Generate diagnostic report"
                >
                  Generate Report
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DiagnosticMonitor;
