'use client';

import React, { useState } from 'react';
import { useAccessibility } from '@/hooks/useAccessibility';

interface IssueDisplayProps {
  issue: {
    type: string;
    severity: string;
    message: string;
    impact: string;
    wcag?: {
      principle: string;
      guideline: string;
      level: string;
    };
    metadata: {
      suggestion: string;
    };
  };
}

const IssueDisplay: React.FC<IssueDisplayProps> = ({ issue }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { getIssueColor, getImpactColor } = useAccessibility();

  return (
    <div className={`p-3 rounded-lg bg-${getIssueColor(issue.severity)}-50`}>
      <div 
        className="flex justify-between items-start cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <div className="font-medium capitalize">{issue.type.replace(/_/g, ' ')}</div>
          <div className="text-sm">{issue.message}</div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`text-sm px-2 py-1 rounded bg-${getIssueColor(issue.severity)}-100 text-${getIssueColor(issue.severity)}-800`}>
            {issue.severity}
          </span>
          <span className={`text-sm px-2 py-1 rounded bg-${getImpactColor(issue.impact)}-100 text-${getImpactColor(issue.impact)}-800`}>
            {issue.impact}
          </span>
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-2 space-y-2 text-sm">
          {issue.wcag && (
            <div>
              <span className="font-medium">WCAG: </span>
              <span className="text-gray-600">
                {issue.wcag.principle}.{issue.wcag.guideline} (Level {issue.wcag.level})
              </span>
            </div>
          )}
          <div>
            <span className="font-medium">Suggestion: </span>
            <span className="text-gray-600">{issue.metadata.suggestion}</span>
          </div>
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

interface AccessibilityMonitorProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const AccessibilityMonitor: React.FC<AccessibilityMonitorProps> = ({
  position = 'bottom-right'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(process.env.NODE_ENV === 'development');
  const [activeTab, setActiveTab] = useState<'issues' | 'compliance' | 'test'>('issues');

  const {
    issues,
    metrics,
    isAnalyzing,
    analyzePage,
    getComplianceColor,
    getComplianceLabel,
    generateReport
  } = useAccessibility({
    onIssueDetected: (issue) => {
      console.log('Accessibility issue detected:', issue);
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
    tab: 'issues' | 'compliance' | 'test';
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
        {isExpanded ? '×' : '♿'}
      </button>

      {isExpanded && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">Accessibility Monitor</h2>
            <div className="text-sm text-gray-600 mt-1">
              {metrics.totalIssues} active issues
            </div>
          </div>

          <div className="border-b">
            <div className="flex">
              <TabButton tab="issues" label="Issues" />
              <TabButton tab="compliance" label="Compliance" />
              <TabButton tab="test" label="Test" />
            </div>
          </div>

          <div className="p-4 max-h-[60vh] overflow-auto">
            {activeTab === 'issues' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <MetricDisplay 
                    label="Total Issues" 
                    value={metrics.totalIssues}
                    color="red"
                  />
                  <MetricDisplay 
                    label="High Severity" 
                    value={metrics.issuesBySeverity.high || 0}
                    color="red"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Active Issues</h3>
                  <div className="space-y-2">
                    {issues.map(issue => (
                      <IssueDisplay key={issue.id} issue={issue} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'compliance' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  {(['a', 'aa', 'aaa'] as const).map(level => (
                    <MetricDisplay 
                      key={level}
                      label={`WCAG Level ${level.toUpperCase()}`}
                      value={`${metrics.complianceLevel[level]}%`}
                      color={getComplianceColor(metrics.complianceLevel[level])}
                      subValue={getComplianceLabel(metrics.complianceLevel[level])}
                    />
                  ))}
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Issues by WCAG Guideline</h3>
                  <div className="space-y-2">
                    {Object.entries(metrics.issuesByWCAG).map(([guideline, count]) => (
                      <div 
                        key={guideline}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                      >
                        <span className="font-medium">
                          Guideline {guideline}
                        </span>
                        <span className="text-gray-600">{count} issues</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'test' && (
              <div className="space-y-4">
                <button
                  onClick={() => analyzePage()}
                  disabled={isAnalyzing}
                  className="w-full p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                >
                  <div className="font-medium">
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Page'}
                  </div>
                  <div className="text-sm text-gray-600">
                    Run accessibility tests on current page
                  </div>
                </button>

                <button
                  onClick={() => generateReport()}
                  disabled={isAnalyzing}
                  className="w-full p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                >
                  <div className="font-medium">Generate Report</div>
                  <div className="text-sm text-gray-600">
                    Create detailed accessibility report
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

export default AccessibilityMonitor;
