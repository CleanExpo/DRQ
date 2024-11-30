'use client';

import React, { useState } from 'react';
import { useSecurity } from '@/hooks/useSecurity';

interface SecurityCheckDisplayProps {
  check: {
    type: 'ssl' | 'csp' | 'mixed-content' | 'headers' | 'malware';
    status: 'pass' | 'fail' | 'warning';
    message: string;
    details?: Record<string, any>;
    timestamp: number;
  };
}

const SecurityCheckDisplay: React.FC<SecurityCheckDisplayProps> = ({ check }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { formatTimestamp, getStatusColor } = useSecurity();

  return (
    <div className={`p-4 bg-${getStatusColor(check.status)}-50 rounded-lg`}>
      <div 
        className="flex justify-between items-start cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <div className="font-medium">{check.type}</div>
          <div className="text-sm text-gray-600">{check.message}</div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`text-sm px-2 py-1 rounded bg-${getStatusColor(check.status)}-100 text-${getStatusColor(check.status)}-800`}>
            {check.status}
          </span>
        </div>
      </div>
      
      {isExpanded && check.details && (
        <div className="mt-4 space-y-2">
          <div className="text-sm">
            <div className="font-medium">Details:</div>
            <pre className="mt-1 p-2 bg-gray-100 rounded overflow-auto">
              {JSON.stringify(check.details, null, 2)}
            </pre>
          </div>
          <div className="text-sm text-gray-600">
            Timestamp: {formatTimestamp(check.timestamp)}
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
      {typeof value === 'number' ? value.toFixed(0) : value}
    </div>
    {subValue && (
      <div className="text-sm text-gray-500 mt-1">{subValue}</div>
    )}
  </div>
);

interface SecurityMonitorProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const SecurityMonitor: React.FC<SecurityMonitorProps> = ({
  position = 'bottom-right'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(process.env.NODE_ENV === 'development');
  const [activeTab, setActiveTab] = useState<'checks' | 'metrics' | 'analyze'>('checks');

  const {
    checks,
    metrics,
    isAnalyzing,
    analyzePage,
    generateReport,
    clearChecks,
    getSummary
  } = useSecurity({
    onSecurityCheck: (check) => {
      console.log('Security check completed:', check);
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
    tab: 'checks' | 'metrics' | 'analyze';
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

  const handleAnalyze = async () => {
    await analyzePage(
      window.location.href,
      document.documentElement.outerHTML,
      {
        'content-security-policy': document.head.querySelector('meta[http-equiv="Content-Security-Policy"]')?.getAttribute('content') || '',
        'strict-transport-security': document.head.querySelector('meta[http-equiv="Strict-Transport-Security"]')?.getAttribute('content') || ''
      }
    );
  };

  const summary = getSummary();

  return (
    <div 
      className={`fixed ${positionClasses[position]} z-50`}
      style={{ maxWidth: isExpanded ? '600px' : '50px' }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute top-2 right-2 z-10 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
      >
        {isExpanded ? '×' : '🔒'}
      </button>

      {isExpanded && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">Security Monitor</h2>
            <div className="text-sm text-gray-600 mt-1">
              {checks.length} security checks
            </div>
          </div>

          <div className="border-b">
            <div className="flex">
              <TabButton tab="checks" label="Checks" />
              <TabButton tab="metrics" label="Metrics" />
              <TabButton tab="analyze" label="Analyze" />
            </div>
          </div>

          <div className="p-4 max-h-[60vh] overflow-auto">
            {activeTab === 'checks' && (
              <div className="space-y-4">
                {checks.map((check, index) => (
                  <SecurityCheckDisplay key={index} check={check} />
                ))}
                {checks.length === 0 && (
                  <div className="text-center text-gray-500">
                    No security checks yet
                  </div>
                )}
              </div>
            )}

            {activeTab === 'metrics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <MetricDisplay 
                    label="Total Checks" 
                    value={summary.totalChecks}
                  />
                  <MetricDisplay 
                    label="Failed Checks" 
                    value={summary.failedChecks}
                    color="red"
                  />
                  <MetricDisplay 
                    label="Warning Checks" 
                    value={summary.warningChecks}
                    color="yellow"
                  />
                  <MetricDisplay 
                    label="Passed Checks" 
                    value={summary.passedChecks}
                    color="green"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Checks by Type</h3>
                  <div className="space-y-2">
                    {Object.entries(metrics.checksByType).map(([type, count]) => (
                      <div 
                        key={type}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                      >
                        <span className="font-medium capitalize">{type}</span>
                        <span className="text-gray-600">{count} checks</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analyze' && (
              <div className="space-y-4">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="w-full p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                >
                  <div className="font-medium">
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Current Page'}
                  </div>
                  <div className="text-sm text-gray-600">
                    Run security checks on the current page
                  </div>
                </button>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">What We Check</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• SSL Certificate Configuration</li>
                    <li>• Content Security Policy</li>
                    <li>• Mixed Content Issues</li>
                    <li>• Security Headers</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t bg-gray-50">
            <div className="flex justify-between items-center">
              <button
                onClick={() => clearChecks()}
                className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
              >
                Clear Checks
              </button>
              <button
                onClick={() => generateReport()}
                className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
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

export default SecurityMonitor;
