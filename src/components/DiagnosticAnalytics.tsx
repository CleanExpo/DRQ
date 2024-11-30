'use client';

import React, { useState } from 'react';
import { useDiagnosticAnalytics } from '../hooks/useDiagnosticAnalytics';

interface InsightDisplayProps {
  insight: {
    type: string;
    title: string;
    description: string;
    severity: string;
    timestamp: number;
    recommendations: string[];
    data: any;
  };
}

const InsightDisplay: React.FC<InsightDisplayProps> = ({ insight }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { formatTimestamp } = useDiagnosticAnalytics();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'red';
      case 'warning':
        return 'yellow';
      case 'info':
        return 'blue';
      default:
        return 'gray';
    }
  };

  const color = getSeverityColor(insight.severity);

  return (
    <div className={`p-4 bg-${color}-50 rounded-lg border border-${color}-200`}>
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
          <div className="font-medium">{insight.title}</div>
          <div className="text-sm text-gray-600">{insight.description}</div>
          <div className="text-xs text-gray-500 mt-1">
            {formatTimestamp(insight.timestamp)}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`text-sm px-2 py-1 rounded bg-${color}-100 text-${color}-800`}>
            {insight.type}
          </span>
          <span className={`text-sm px-2 py-1 rounded bg-${color}-100 text-${color}-800`}>
            {insight.severity}
          </span>
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-4 space-y-4">
          {insight.recommendations.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Recommendations:</h4>
              <ul className="list-disc list-inside space-y-1">
                {insight.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-gray-600">{rec}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="text-sm">
            <h4 className="font-medium mb-2">Details:</h4>
            <pre className="p-2 bg-gray-100 rounded overflow-auto">
              {JSON.stringify(insight.data, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

interface AnalyticResultDisplayProps {
  result: {
    type: string;
    category: string;
    value: number;
    confidence: number;
    timestamp: number;
    metadata?: Record<string, any>;
  };
}

const AnalyticResultDisplay: React.FC<AnalyticResultDisplayProps> = ({ result }) => {
  const { formatTimestamp } = useDiagnosticAnalytics();

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.7) return 'green';
    if (confidence >= 0.4) return 'yellow';
    return 'red';
  };

  const confidenceColor = getConfidenceColor(result.confidence);

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium">{result.type}</div>
          <div className="text-sm text-gray-600">{result.category}</div>
          <div className="text-xs text-gray-500 mt-1">
            {formatTimestamp(result.timestamp)}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            Value: {result.value.toFixed(2)}
          </span>
          <span className={`text-sm px-2 py-1 rounded bg-${confidenceColor}-100 text-${confidenceColor}-800`}>
            {(result.confidence * 100).toFixed(0)}% confidence
          </span>
        </div>
      </div>
      
      {result.metadata && (
        <div className="mt-2 text-sm text-gray-600">
          <pre className="p-2 bg-gray-50 rounded overflow-auto">
            {JSON.stringify(result.metadata, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export const DiagnosticAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'insights' | 'results'>('insights');
  const {
    insights,
    analyticResults,
    isAnalyzing,
    getInsightsByType,
    getInsightsBySeverity,
    getAnalyticResultsByType
  } = useDiagnosticAnalytics({
    onInsight: (insight) => {
      console.log('New insight:', insight);
    },
    onError: (error) => {
      console.error('Analytics error:', error);
    }
  });

  const criticalInsights = getInsightsBySeverity('critical');
  const warningInsights = getInsightsBySeverity('warning');
  const infoInsights = getInsightsBySeverity('info');

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Diagnostic Analytics</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('insights')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'insights'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Insights
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'results'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Results
          </button>
        </div>
      </div>

      {isAnalyzing && (
        <div className="mb-4 p-4 bg-blue-50 text-blue-700 rounded-lg">
          Analyzing diagnostic data...
        </div>
      )}

      {activeTab === 'insights' ? (
        <div className="space-y-6">
          {criticalInsights.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-red-600">Critical Insights</h3>
              <div className="space-y-4">
                {criticalInsights.map((insight) => (
                  <InsightDisplay key={insight.id} insight={insight} />
                ))}
              </div>
            </div>
          )}

          {warningInsights.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-yellow-600">Warnings</h3>
              <div className="space-y-4">
                {warningInsights.map((insight) => (
                  <InsightDisplay key={insight.id} insight={insight} />
                ))}
              </div>
            </div>
          )}

          {infoInsights.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-blue-600">Information</h3>
              <div className="space-y-4">
                {infoInsights.map((insight) => (
                  <InsightDisplay key={insight.id} insight={insight} />
                ))}
              </div>
            </div>
          )}

          {insights.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No insights available
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {['trend', 'pattern', 'correlation', 'prediction'].map((type) => {
            const results = getAnalyticResultsByType(type);
            if (results.length === 0) return null;

            return (
              <div key={type}>
                <h3 className="text-lg font-semibold mb-3 capitalize">{type} Analysis</h3>
                <div className="space-y-4">
                  {results.map((result) => (
                    <AnalyticResultDisplay key={result.id} result={result} />
                  ))}
                </div>
              </div>
            );
          })}

          {analyticResults.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No analytic results available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DiagnosticAnalytics;
