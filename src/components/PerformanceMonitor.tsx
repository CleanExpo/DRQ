'use client';

import React, { useState } from 'react';
import { usePerformance } from '@/hooks/usePerformance';

interface IssueDisplayProps {
  issue: {
    type: string;
    severity: 'low' | 'medium' | 'high';
    message: string;
    suggestion: string;
    metadata: {
      metric?: string;
      threshold?: number;
      value?: number;
    };
  };
}

const IssueDisplay: React.FC<IssueDisplayProps> = ({ issue }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className={`p-3 rounded-lg ${getSeverityColor(issue.severity)}`}>
      <div 
        className="flex justify-between items-start cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <div className="font-medium capitalize">{issue.type.replace(/_/g, ' ')}</div>
          <div className="text-sm">{issue.message}</div>
        </div>
        <span className="text-sm font-medium capitalize">{issue.severity}</span>
      </div>
      
      {isExpanded && (
        <div className="mt-2 text-sm">
          <div className="font-medium">Suggestion:</div>
          <div>{issue.suggestion}</div>
          {issue.metadata.value && issue.metadata.threshold && (
            <div className="mt-1">
              <span className="font-medium">Current: </span>
              {issue.metadata.value.toFixed(2)}
              <span className="mx-2">|</span>
              <span className="font-medium">Threshold: </span>
              {issue.metadata.threshold.toFixed(2)}
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

interface PerformanceMonitorProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  position = 'bottom-right'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(process.env.NODE_ENV === 'development');
  const [activeTab, setActiveTab] = useState<'vitals' | 'resources' | 'issues'>('vitals');

  const {
    metrics,
    getScoreColor,
    getMetricScore,
    formatSize,
    formatDuration,
    generateReport
  } = usePerformance({
    onMetric: (metric) => {
      console.log('Performance metric:', metric);
    },
    onIssue: (issue) => {
      console.log('Performance issue:', issue);
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
    tab: 'vitals' | 'resources' | 'issues';
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
        {isExpanded ? '×' : '⚡'}
      </button>

      {isExpanded && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">Performance Monitor</h2>
            <div className="text-sm text-gray-600 mt-1">
              {metrics.issues.total} active issues
            </div>
          </div>

          <div className="border-b">
            <div className="flex">
              <TabButton tab="vitals" label="Core Web Vitals" />
              <TabButton tab="resources" label="Resources" />
              <TabButton tab="issues" label="Issues" />
            </div>
          </div>

          <div className="p-4 max-h-[60vh] overflow-auto">
            {activeTab === 'vitals' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <MetricDisplay 
                    label="First Contentful Paint" 
                    value={metrics.coreWebVitals.fcp}
                    color={getScoreColor(metrics.coreWebVitals.fcp, 1800)}
                    subValue={`Score: ${getMetricScore('fcp')}%`}
                  />
                  <MetricDisplay 
                    label="Largest Contentful Paint" 
                    value={metrics.coreWebVitals.lcp}
                    color={getScoreColor(metrics.coreWebVitals.lcp, 2500)}
                    subValue={`Score: ${getMetricScore('lcp')}%`}
                  />
                  <MetricDisplay 
                    label="Cumulative Layout Shift" 
                    value={metrics.coreWebVitals.cls}
                    color={getScoreColor(metrics.coreWebVitals.cls, 0.1)}
                    subValue={`Score: ${getMetricScore('cls')}%`}
                  />
                  <MetricDisplay 
                    label="First Input Delay" 
                    value={metrics.coreWebVitals.fid}
                    color={getScoreColor(metrics.coreWebVitals.fid, 100)}
                    subValue={`Score: ${getMetricScore('fid')}%`}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Performance Scores</h3>
                  <div className="space-y-4">
                    {Object.entries(metrics.coreWebVitals).map(([key, value]) => {
                      const score = getMetricScore(key as keyof typeof metrics.coreWebVitals);
                      return (
                        <div key={key} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium uppercase">{key}</span>
                            <span className={`text-${getScoreColor(value, key === 'cls' ? 0.1 : 1000)}-600`}>
                              {score.toFixed(0)}%
                            </span>
                          </div>
                          <div className="bg-gray-200 rounded-full h-2">
                            <div
                              className={`bg-${getScoreColor(value, key === 'cls' ? 0.1 : 1000)}-600 h-full rounded-full`}
                              style={{ width: `${score}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <MetricDisplay 
                    label="Total Size" 
                    value={formatSize(metrics.resources.totalSize)}
                  />
                  <MetricDisplay 
                    label="Total Duration" 
                    value={formatDuration(metrics.resources.totalDuration)}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Resources by Type</h3>
                  <div className="space-y-2">
                    {Object.entries(metrics.resources.byType).map(([type, data]) => (
                      <div 
                        key={type}
                        className="p-3 bg-gray-50 rounded"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium capitalize">{type}</span>
                          <span className="text-gray-600">{data.count} files</span>
                        </div>
                        <div className="mt-1 text-sm text-gray-600">
                          Size: {formatSize(data.size)} | 
                          Avg Duration: {formatDuration(data.duration / data.count)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'issues' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <MetricDisplay 
                    label="Total Issues" 
                    value={metrics.issues.total}
                    color="red"
                  />
                  <MetricDisplay 
                    label="High Severity" 
                    value={metrics.issues.bySeverity.high || 0}
                    color="red"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Issues by Severity</h3>
                  <div className="space-y-2">
                    {Object.entries(metrics.issues.bySeverity).map(([severity, count]) => (
                      <div 
                        key={severity}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                      >
                        <span className="font-medium capitalize">{severity}</span>
                        <span className="text-gray-600">{count} issues</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Issues by Type</h3>
                  <div className="space-y-2">
                    {Object.entries(metrics.issues.byType).map(([type, count]) => (
                      <div 
                        key={type}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                      >
                        <span className="font-medium capitalize">{type.replace(/_/g, ' ')}</span>
                        <span className="text-gray-600">{count} issues</span>
                      </div>
                    ))}
                  </div>
                </div>
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

export default PerformanceMonitor;
