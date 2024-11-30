'use client';

import React, { useState } from 'react';
import { useLogging } from '@/hooks/useLogging';

interface LogDisplayProps {
  log: {
    level: string;
    message: string;
    timestamp: string;
    context: {
      path: string;
      component?: string;
      action?: string;
    };
  };
}

const LogDisplay: React.FC<LogDisplayProps> = ({ log }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { getLevelColor, getLevelIcon } = useLogging();

  return (
    <div className={`p-3 rounded-lg bg-${getLevelColor(log.level)}-50`}>
      <div 
        className="flex justify-between items-start cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <div className="flex items-center space-x-2">
            <span>{getLevelIcon(log.level)}</span>
            <span className="font-medium">{log.message}</span>
          </div>
          <div className="text-sm text-gray-600">
            {new Date(log.timestamp).toLocaleTimeString()}
          </div>
        </div>
        <span className={`text-sm px-2 py-1 rounded bg-${getLevelColor(log.level)}-100 text-${getLevelColor(log.level)}-800`}>
          {log.level}
        </span>
      </div>
      
      {isExpanded && (
        <div className="mt-2 space-y-2 text-sm">
          {log.context.component && (
            <div>
              <span className="font-medium">Component: </span>
              <span className="text-gray-600">{log.context.component}</span>
            </div>
          )}
          {log.context.action && (
            <div>
              <span className="font-medium">Action: </span>
              <span className="text-gray-600">{log.context.action}</span>
            </div>
          )}
          <div>
            <span className="font-medium">Path: </span>
            <span className="text-gray-600">{log.context.path}</span>
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

interface LoggingMonitorProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const LoggingMonitor: React.FC<LoggingMonitorProps> = ({
  position = 'bottom-right'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(process.env.NODE_ENV === 'development');
  const [activeTab, setActiveTab] = useState<'logs' | 'metrics' | 'test'>('logs');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  const {
    metrics,
    recentLogs,
    debug,
    info,
    warn,
    error,
    getLevelColor,
    generateReport,
    exportLogs
  } = useLogging({
    component: 'LoggingMonitor',
    onLog: (log) => {
      console.log('New log:', log);
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
    tab: 'logs' | 'metrics' | 'test';
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

  const filteredLogs = selectedLevel === 'all'
    ? recentLogs
    : recentLogs.filter(log => log.level === selectedLevel);

  return (
    <div 
      className={`fixed ${positionClasses[position]} z-50`}
      style={{ maxWidth: isExpanded ? '600px' : '50px' }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute top-2 right-2 z-10 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
      >
        {isExpanded ? '×' : '📝'}
      </button>

      {isExpanded && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">Logging Monitor</h2>
            <div className="text-sm text-gray-600 mt-1">
              {metrics.logsPerMinute} logs/minute
            </div>
          </div>

          <div className="border-b">
            <div className="flex">
              <TabButton tab="logs" label="Logs" />
              <TabButton tab="metrics" label="Metrics" />
              <TabButton tab="test" label="Test" />
            </div>
          </div>

          <div className="p-4 max-h-[60vh] overflow-auto">
            {activeTab === 'logs' && (
              <div className="space-y-6">
                <div className="flex space-x-2">
                  {['all', 'debug', 'info', 'warn', 'error'].map(level => (
                    <button
                      key={level}
                      onClick={() => setSelectedLevel(level)}
                      className={`px-3 py-1 rounded text-sm ${
                        selectedLevel === level
                          ? `bg-${getLevelColor(level)}-100 text-${getLevelColor(level)}-800`
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  {filteredLogs.map(log => (
                    <LogDisplay key={log.id} log={log} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'metrics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <MetricDisplay 
                    label="Total Logs" 
                    value={metrics.totalLogs}
                  />
                  <MetricDisplay 
                    label="Logs per Minute" 
                    value={metrics.logsPerMinute}
                    color="green"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Logs by Level</h3>
                  <div className="space-y-2">
                    {Object.entries(metrics.logsByLevel).map(([level, count]) => (
                      <div 
                        key={level}
                        className={`flex justify-between items-center p-2 rounded bg-${getLevelColor(level)}-50`}
                      >
                        <span className="font-medium capitalize">{level}</span>
                        <span className="text-gray-600">{count} logs</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Top Messages</h3>
                  <div className="space-y-2">
                    {metrics.topMessages.map((message, index) => (
                      <div 
                        key={message.hash}
                        className={`p-2 rounded bg-${getLevelColor(message.level)}-50`}
                      >
                        <div className="font-medium">{message.message}</div>
                        <div className="text-sm text-gray-600">
                          {message.count} occurrences
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'test' && (
              <div className="space-y-4">
                <button
                  onClick={() => debug('Test debug message', 'test', { test: true })}
                  className="w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="font-medium">Test Debug Log</div>
                  <div className="text-sm text-gray-600">
                    Generate a debug level log
                  </div>
                </button>

                <button
                  onClick={() => info('Test info message', 'test', { test: true })}
                  className="w-full p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <div className="font-medium">Test Info Log</div>
                  <div className="text-sm text-gray-600">
                    Generate an info level log
                  </div>
                </button>

                <button
                  onClick={() => warn('Test warning message', 'test', { test: true })}
                  className="w-full p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
                >
                  <div className="font-medium">Test Warning Log</div>
                  <div className="text-sm text-gray-600">
                    Generate a warning level log
                  </div>
                </button>

                <button
                  onClick={() => error('Test error message', 'test', { test: true })}
                  className="w-full p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <div className="font-medium">Test Error Log</div>
                  <div className="text-sm text-gray-600">
                    Generate an error level log
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
              <div className="flex space-x-2">
                <button
                  onClick={() => exportLogs('csv')}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                >
                  Export CSV
                </button>
                <button
                  onClick={() => generateReport()}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoggingMonitor;
