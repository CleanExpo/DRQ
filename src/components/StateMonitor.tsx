'use client';

import React, { useState } from 'react';
import { useState as useAppState, useStateMetrics } from '@/hooks/useState';

interface StateDisplayProps {
  stateKey: string;
  scope: string;
  updateFrequency: number;
  persistent: boolean;
  lastUpdated: string;
}

const StateDisplay: React.FC<StateDisplayProps> = ({
  stateKey,
  scope,
  updateFrequency,
  persistent,
  lastUpdated
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { formatUpdateFrequency } = useStateMetrics();
  const { value, deleteState } = useAppState(stateKey);

  return (
    <div className="p-3 rounded-lg bg-gray-50">
      <div 
        className="flex justify-between items-start cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <div className="font-medium">{stateKey}</div>
          <div className="text-sm text-gray-600">
            Scope: {scope} | Updates: {formatUpdateFrequency(updateFrequency)}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {persistent && (
            <span className="text-sm px-2 py-1 rounded bg-blue-100 text-blue-800">
              Persistent
            </span>
          )}
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-3 space-y-2">
          <div className="text-sm">
            <div className="font-medium">Current Value:</div>
            <pre className="mt-1 p-2 bg-gray-100 rounded overflow-auto">
              {JSON.stringify(value, null, 2)}
            </pre>
          </div>
          <div className="text-sm text-gray-600">
            Last Updated: {new Date(lastUpdated).toLocaleString()}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteState();
            }}
            className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
          >
            Delete State
          </button>
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

interface StateMonitorProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const StateMonitor: React.FC<StateMonitorProps> = ({
  position = 'bottom-right'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(process.env.NODE_ENV === 'development');
  const [activeTab, setActiveTab] = useState<'states' | 'metrics' | 'test'>('states');
  const [selectedScope, setSelectedScope] = useState<string>('all');
  const [testKey, setTestKey] = useState('');
  const [testValue, setTestValue] = useState('');

  const {
    metrics,
    formatUpdateFrequency,
    generateReport
  } = useStateMetrics();

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  };

  if (!isVisible) return null;

  const TabButton: React.FC<{
    tab: 'states' | 'metrics' | 'test';
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

  const handleTestState = () => {
    if (!testKey || !testValue) return;
    const { setValue } = useAppState(testKey, undefined, {
      scope: 'test',
      persistent: true
    });
    try {
      setValue(JSON.parse(testValue));
    } catch {
      setValue(testValue);
    }
    setTestKey('');
    setTestValue('');
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
        {isExpanded ? '×' : '🔄'}
      </button>

      {isExpanded && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">State Monitor</h2>
            <div className="text-sm text-gray-600 mt-1">
              {metrics.totalStates} states ({metrics.persistentStates} persistent)
            </div>
          </div>

          <div className="border-b">
            <div className="flex">
              <TabButton tab="states" label="States" />
              <TabButton tab="metrics" label="Metrics" />
              <TabButton tab="test" label="Test" />
            </div>
          </div>

          <div className="p-4 max-h-[60vh] overflow-auto">
            {activeTab === 'states' && (
              <div className="space-y-6">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedScope('all')}
                    className={`px-3 py-1 rounded text-sm ${
                      selectedScope === 'all'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  {Object.keys(metrics.statesByScope).map(scope => (
                    <button
                      key={scope}
                      onClick={() => setSelectedScope(scope)}
                      className={`px-3 py-1 rounded text-sm ${
                        selectedScope === scope
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {scope}
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  {Object.entries(metrics.updateFrequency)
                    .filter(([key]) => 
                      selectedScope === 'all' || 
                      metrics.statesByScope[selectedScope]
                    )
                    .map(([key, frequency]) => (
                      <StateDisplay
                        key={key}
                        stateKey={key}
                        scope={metrics.statesByScope[key] || 'global'}
                        updateFrequency={frequency}
                        persistent={false}
                        lastUpdated={new Date().toISOString()}
                      />
                    ))}
                </div>
              </div>
            )}

            {activeTab === 'metrics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <MetricDisplay 
                    label="Total States" 
                    value={metrics.totalStates}
                  />
                  <MetricDisplay 
                    label="Persistent States" 
                    value={metrics.persistentStates}
                    color="green"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">States by Scope</h3>
                  <div className="space-y-2">
                    {Object.entries(metrics.statesByScope).map(([scope, count]) => (
                      <div 
                        key={scope}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                      >
                        <span className="font-medium">{scope}</span>
                        <span className="text-gray-600">{count} states</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'test' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Key</label>
                    <input
                      type="text"
                      value={testKey}
                      onChange={(e) => setTestKey(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="State key"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Value</label>
                    <textarea
                      value={testValue}
                      onChange={(e) => setTestValue(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="State value (JSON or string)"
                      rows={3}
                    />
                  </div>
                  <button
                    onClick={handleTestState}
                    disabled={!testKey || !testValue}
                    className="w-full p-3 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors disabled:opacity-50"
                  >
                    Set Test State
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

export default StateMonitor;
