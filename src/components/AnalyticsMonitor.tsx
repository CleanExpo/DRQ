'use client';

import React, { useState } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';

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

interface ChartDisplayProps {
  data: Record<string, number>;
  title: string;
}

const ChartDisplay: React.FC<ChartDisplayProps> = ({ data, title }) => {
  const total = Object.values(data).reduce((sum, value) => sum + value, 0);

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="space-y-2">
        {Object.entries(data).map(([key, value]) => {
          const percentage = total > 0 ? (value / total) * 100 : 0;
          return (
            <div key={key} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium capitalize">{key}</span>
                <span className="text-gray-600">{value} ({percentage.toFixed(1)}%)</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-full rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface AnalyticsMonitorProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const AnalyticsMonitor: React.FC<AnalyticsMonitorProps> = ({
  position = 'bottom-right'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(process.env.NODE_ENV === 'development');
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'test'>('overview');

  const {
    metrics,
    trackEvent,
    trackError,
    trackPerformanceMetric,
    generateReport
  } = useAnalytics({
    onEvent: (type, data) => {
      console.log('Analytics event:', type, data);
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
    tab: 'overview' | 'performance' | 'test';
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
        {isExpanded ? '×' : '📊'}
      </button>

      {isExpanded && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">Analytics Monitor</h2>
            <div className="text-sm text-gray-600 mt-1">
              {metrics.pageViews.total} page views
            </div>
          </div>

          <div className="border-b">
            <div className="flex">
              <TabButton tab="overview" label="Overview" />
              <TabButton tab="performance" label="Performance" />
              <TabButton tab="test" label="Test" />
            </div>
          </div>

          <div className="p-4 max-h-[60vh] overflow-auto">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <MetricDisplay 
                    label="Total Page Views" 
                    value={metrics.pageViews.total}
                  />
                  <MetricDisplay 
                    label="Unique Pages" 
                    value={metrics.pageViews.unique}
                  />
                  <MetricDisplay 
                    label="Total Events" 
                    value={metrics.events.total}
                    color="green"
                  />
                  <MetricDisplay 
                    label="Total Errors" 
                    value={metrics.errors.total}
                    color="red"
                  />
                </div>

                <ChartDisplay 
                  data={metrics.pageViews.byPath}
                  title="Page Views by Path"
                />

                <ChartDisplay 
                  data={metrics.pageViews.byDevice}
                  title="Page Views by Device"
                />

                <ChartDisplay 
                  data={metrics.events.byCategory}
                  title="Events by Category"
                />
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <MetricDisplay 
                    label="First Contentful Paint" 
                    value={`${metrics.performance.averageFCP.toFixed(0)}ms`}
                  />
                  <MetricDisplay 
                    label="Largest Contentful Paint" 
                    value={`${metrics.performance.averageLCP.toFixed(0)}ms`}
                  />
                  <MetricDisplay 
                    label="Cumulative Layout Shift" 
                    value={metrics.performance.averageCLS.toFixed(3)}
                  />
                  <MetricDisplay 
                    label="First Input Delay" 
                    value={`${metrics.performance.averageFID.toFixed(0)}ms`}
                  />
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">Performance Scores</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'FCP', value: metrics.performance.averageFCP, target: 1000 },
                      { label: 'LCP', value: metrics.performance.averageLCP, target: 2500 },
                      { label: 'CLS', value: metrics.performance.averageCLS, target: 0.1 },
                      { label: 'FID', value: metrics.performance.averageFID, target: 100 }
                    ].map(({ label, value, target }) => {
                      const score = Math.max(0, Math.min(100, (1 - value / target) * 100));
                      const color = score > 90 ? 'green' : score > 50 ? 'yellow' : 'red';
                      return (
                        <div key={label} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{label}</span>
                            <span className={`text-${color}-600`}>
                              {score.toFixed(0)}%
                            </span>
                          </div>
                          <div className="bg-gray-200 rounded-full h-2">
                            <div
                              className={`bg-${color}-600 h-full rounded-full`}
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

            {activeTab === 'test' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => trackEvent('test', 'button', 'click')}
                    className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <div className="font-medium">Track Event</div>
                    <div className="text-sm text-gray-600">Test event tracking</div>
                  </button>
                  <button
                    onClick={() => trackError(new Error('Test error'), 'AnalyticsMonitor')}
                    className="p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <div className="font-medium">Track Error</div>
                    <div className="text-sm text-gray-600">Test error tracking</div>
                  </button>
                  <button
                    onClick={() => trackPerformanceMetric('custom', Math.random() * 1000)}
                    className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <div className="font-medium">Track Performance</div>
                    <div className="text-sm text-gray-600">Test performance tracking</div>
                  </button>
                  <button
                    onClick={() => generateReport()}
                    className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <div className="font-medium">Generate Report</div>
                    <div className="text-sm text-gray-600">Create analytics report</div>
                  </button>
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

export default AnalyticsMonitor;
