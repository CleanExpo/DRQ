'use client';

import React, { useState } from 'react';
import { useDiagnosticAlert } from '../hooks/useDiagnosticAlert';

interface AlertConfig {
  type: 'performance' | 'security' | 'error';
  severity: 'info' | 'warning' | 'error';
  threshold?: number;
  message: string;
  enabled: boolean;
}

interface Alert {
  id: string;
  type: 'performance' | 'security' | 'error';
  severity: 'info' | 'warning' | 'error';
  message: string;
  timestamp: number;
  details?: Record<string, any>;
}

const AlertDisplay: React.FC<{ alert: Alert }> = ({ alert }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { formatAlertTimestamp } = useDiagnosticAlert();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
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

  const color = getSeverityColor(alert.severity);

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
          <div className="font-medium">{alert.message}</div>
          <div className="text-sm text-gray-600">
            {formatAlertTimestamp(alert.timestamp)}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`text-sm px-2 py-1 rounded bg-${color}-100 text-${color}-800`}>
            {alert.type}
          </span>
          <span className={`text-sm px-2 py-1 rounded bg-${color}-100 text-${color}-800`}>
            {alert.severity}
          </span>
        </div>
      </div>
      
      {isExpanded && alert.details && (
        <div className="mt-4 space-y-2">
          <div className="text-sm">
            <div className="font-medium">Details:</div>
            <pre className="mt-1 p-2 bg-gray-100 rounded overflow-auto">
              {JSON.stringify(alert.details, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

interface AlertConfigFormProps {
  onSubmit: (config: Omit<AlertConfig, 'enabled'>) => void;
}

const AlertConfigForm: React.FC<AlertConfigFormProps> = ({ onSubmit }) => {
  const [type, setType] = useState<'performance' | 'security' | 'error'>('performance');
  const [severity, setSeverity] = useState<'info' | 'warning' | 'error'>('warning');
  const [threshold, setThreshold] = useState<string>('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type,
      severity,
      threshold: threshold ? Number(threshold) : undefined,
      message
    });
    setMessage('');
    setThreshold('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow">
      <div className="space-y-4">
        <div>
          <label htmlFor="alert-type" className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <select
            id="alert-type"
            value={type}
            onChange={(e) => setType(e.target.value as 'performance' | 'security' | 'error')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="performance">Performance</option>
            <option value="security">Security</option>
            <option value="error">Error</option>
          </select>
        </div>

        <div>
          <label htmlFor="alert-severity" className="block text-sm font-medium text-gray-700">
            Severity
          </label>
          <select
            id="alert-severity"
            value={severity}
            onChange={(e) => setSeverity(e.target.value as 'info' | 'warning' | 'error')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
        </div>

        {type === 'performance' && (
          <div>
            <label htmlFor="alert-threshold" className="block text-sm font-medium text-gray-700">
              Threshold (ms)
            </label>
            <input
              id="alert-threshold"
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter threshold in milliseconds"
            />
          </div>
        )}

        <div>
          <label htmlFor="alert-message" className="block text-sm font-medium text-gray-700">
            Message
          </label>
          <input
            id="alert-message"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            placeholder="Enter alert message"
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Alert Configuration
        </button>
      </div>
    </form>
  );
};

interface ConfigDisplayProps {
  config: AlertConfig & { id: string };
  onUpdate: (id: string, config: Partial<AlertConfig>) => void;
  onRemove: (id: string) => void;
}

const ConfigDisplay: React.FC<ConfigDisplayProps> = ({ config, onUpdate, onRemove }) => {
  const color = config.enabled ? 'green' : 'gray';

  return (
    <div className={`p-4 bg-${color}-50 rounded-lg border border-${color}-200`}>
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium">{config.message}</div>
          <div className="text-sm text-gray-600">
            Type: {config.type}, Severity: {config.severity}
            {config.threshold && `, Threshold: ${config.threshold}ms`}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onUpdate(config.id, { enabled: !config.enabled })}
            className={`px-3 py-1 rounded text-sm ${
              config.enabled
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {config.enabled ? 'Disable' : 'Enable'}
          </button>
          <button
            onClick={() => onRemove(config.id)}
            className="p-1 text-gray-500 hover:text-red-500"
            aria-label="Remove configuration"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export const DiagnosticAlert: React.FC = () => {
  const [showConfigForm, setShowConfigForm] = useState(false);
  const {
    alerts,
    addAlertConfig,
    removeAlertConfig,
    updateAlertConfig,
    clearAlerts,
    getActiveConfigs
  } = useDiagnosticAlert({
    onAlert: (alert) => {
      console.log('New alert:', alert);
    },
    onError: (error) => {
      console.error('Alert error:', error);
    }
  });

  const activeConfigs = getActiveConfigs();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Diagnostic Alerts</h2>
        <div className="space-x-2">
          <button
            onClick={() => setShowConfigForm(!showConfigForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {showConfigForm ? 'Cancel' : 'New Configuration'}
          </button>
          <button
            onClick={clearAlerts}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Clear Alerts
          </button>
        </div>
      </div>

      {showConfigForm && (
        <div className="mb-6">
          <AlertConfigForm
            onSubmit={(config) => {
              addAlertConfig({ ...config, enabled: true });
              setShowConfigForm(false);
            }}
          />
        </div>
      )}

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Alert Configurations</h3>
          <div className="space-y-4">
            {activeConfigs.map(config => (
              <ConfigDisplay
                key={config.id}
                config={config}
                onUpdate={updateAlertConfig}
                onRemove={removeAlertConfig}
              />
            ))}
            {activeConfigs.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No alert configurations
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Recent Alerts</h3>
          <div className="space-y-4">
            {alerts.map(alert => (
              <AlertDisplay key={alert.id} alert={alert} />
            ))}
            {alerts.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No alerts
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticAlert;
