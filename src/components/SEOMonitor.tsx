'use client';

import React, { useState } from 'react';
import { useSEO } from '@/hooks/useSEO';

interface IssueDisplayProps {
  issue: {
    type: string;
    severity: 'low' | 'medium' | 'high';
    message: string;
  };
}

const IssueDisplay: React.FC<IssueDisplayProps> = ({ issue }) => {
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
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium capitalize">{issue.type.replace(/_/g, ' ')}</div>
          <div className="text-sm">{issue.message}</div>
        </div>
        <span className="text-sm font-medium capitalize">{issue.severity}</span>
      </div>
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

interface SEOMonitorProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const SEOMonitor: React.FC<SEOMonitorProps> = ({
  position = 'bottom-right'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(process.env.NODE_ENV === 'development');
  const [activeTab, setActiveTab] = useState<'current' | 'metrics' | 'tools'>('current');

  const {
    pageSEO,
    metrics,
    isLoading,
    analyzePage,
    generateSitemap,
    generateRobotsTxt,
    generateReport
  } = useSEO({
    onAnalysis: (page) => {
      console.log('Page analyzed:', page);
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
    tab: 'current' | 'metrics' | 'tools';
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

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'green';
    if (score >= 70) return 'yellow';
    return 'red';
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
        {isExpanded ? '×' : '🔍'}
      </button>

      {isExpanded && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">SEO Monitor</h2>
            {pageSEO && (
              <div className="text-sm text-gray-600 mt-1">
                Score: {pageSEO.metadata.score}/100
              </div>
            )}
          </div>

          <div className="border-b">
            <div className="flex">
              <TabButton tab="current" label="Current" />
              <TabButton tab="metrics" label="Metrics" />
              <TabButton tab="tools" label="Tools" />
            </div>
          </div>

          <div className="p-4 max-h-[60vh] overflow-auto">
            {activeTab === 'current' && pageSEO && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <MetricDisplay 
                    label="SEO Score" 
                    value={pageSEO.metadata.score || 0}
                    color={getScoreColor(pageSEO.metadata.score || 0)}
                  />
                  <MetricDisplay 
                    label="Issues" 
                    value={pageSEO.metadata.issues?.length || 0}
                    color="red"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Meta Tags</h3>
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-50 rounded">
                      <div className="font-medium">Title</div>
                      <div className="text-sm text-gray-600">{pageSEO.config.title}</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded">
                      <div className="font-medium">Description</div>
                      <div className="text-sm text-gray-600">{pageSEO.config.description}</div>
                    </div>
                  </div>
                </div>

                {pageSEO.metadata.issues && pageSEO.metadata.issues.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Issues</h3>
                    <div className="space-y-2">
                      {pageSEO.metadata.issues.map((issue, index) => (
                        <IssueDisplay key={index} issue={issue} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'metrics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <MetricDisplay 
                    label="Total Pages" 
                    value={metrics.totalPages}
                  />
                  <MetricDisplay 
                    label="Average Score" 
                    value={metrics.averageScore}
                    color={getScoreColor(metrics.averageScore)}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Issues by Severity</h3>
                  <div className="space-y-2">
                    {Object.entries(metrics.issuesBySeverity).map(([severity, count]) => (
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
                  <h3 className="text-lg font-semibold mb-3">Top Issues</h3>
                  <div className="space-y-2">
                    {metrics.topIssues.map((issue, index) => (
                      <div 
                        key={index}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                      >
                        <span className="font-medium capitalize">
                          {issue.type.replace(/_/g, ' ')}
                        </span>
                        <div className="text-sm">
                          <span className={`
                            px-2 py-1 rounded
                            ${issue.severity === 'high' ? 'bg-red-100 text-red-800' :
                              issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'}
                          `}>
                            {issue.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tools' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => analyzePage()}
                    disabled={isLoading}
                    className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                  >
                    <div className="font-medium">Analyze Page</div>
                    <div className="text-sm text-gray-600">Run SEO analysis</div>
                  </button>
                  <button
                    onClick={() => generateReport()}
                    disabled={isLoading}
                    className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                  >
                    <div className="font-medium">Generate Report</div>
                    <div className="text-sm text-gray-600">Create SEO report</div>
                  </button>
                  <button
                    onClick={() => generateSitemap()}
                    disabled={isLoading}
                    className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50"
                  >
                    <div className="font-medium">Generate Sitemap</div>
                    <div className="text-sm text-gray-600">Create sitemap.xml</div>
                  </button>
                  <button
                    onClick={() => generateRobotsTxt()}
                    disabled={isLoading}
                    className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors disabled:opacity-50"
                  >
                    <div className="font-medium">Generate Robots.txt</div>
                    <div className="text-sm text-gray-600">Create robots.txt</div>
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

export default SEOMonitor;
