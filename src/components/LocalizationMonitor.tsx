'use client';

import React, { useState } from 'react';
import { useLocalization } from '@/hooks/useLocalization';

interface MetricDisplayProps {
  label: string;
  value: number | string;
  color?: string;
}

const MetricDisplay: React.FC<MetricDisplayProps> = ({ 
  label, 
  value, 
  color = 'purple' 
}) => (
  <div className={`p-4 bg-${color}-50 rounded-lg`}>
    <div className="text-sm text-gray-600">{label}</div>
    <div className={`text-2xl font-bold text-${color}-600`}>
      {typeof value === 'number' ? value.toFixed(2) : value}
    </div>
  </div>
);

interface MissingKeyDisplayProps {
  locale: string;
  keys: string[];
}

const MissingKeyDisplay: React.FC<MissingKeyDisplayProps> = ({ locale, keys }) => (
  <div className="p-3 bg-gray-50 rounded mb-2">
    <div className="font-medium text-gray-700 mb-2">{locale}</div>
    <div className="space-y-1">
      {keys.map(key => (
        <div key={key} className="text-sm text-gray-600 bg-white p-2 rounded">
          {key}
        </div>
      ))}
    </div>
  </div>
);

interface LocalizationMonitorProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const LocalizationMonitor: React.FC<LocalizationMonitorProps> = ({
  position = 'bottom-left'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(process.env.NODE_ENV === 'development');
  const [activeTab, setActiveTab] = useState<'overview' | 'missing' | 'config'>('overview');

  const {
    metrics,
    isLoading,
    setLocale,
    getConfig,
    getCoverage,
    getMissingKeys,
    generateReport
  } = useLocalization({
    onMissingKey: (key, locale) => {
      console.warn(`Missing translation: ${key} (${locale})`);
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
    tab: 'overview' | 'missing' | 'config';
    label: string;
  }> = ({ tab, label }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
        activeTab === tab
          ? 'bg-white text-purple-600 border-b-2 border-purple-600'
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
        className="absolute top-2 right-2 z-10 p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
      >
        {isExpanded ? '×' : '🌐'}
      </button>

      {isExpanded && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">Localization Monitor</h2>
            <div className="text-sm text-gray-600 mt-1">
              Active Locale: {metrics.activeLocale}
            </div>
          </div>

          <div className="border-b">
            <div className="flex">
              <TabButton tab="overview" label="Overview" />
              <TabButton tab="missing" label="Missing Keys" />
              <TabButton tab="config" label="Configuration" />
            </div>
          </div>

          <div className="p-4 max-h-[60vh] overflow-auto">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <MetricDisplay 
                    label="Available Locales" 
                    value={metrics.availableLocales.length}
                  />
                  <MetricDisplay 
                    label="Coverage" 
                    value={`${getCoverage()}%`}
                    color="green"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Coverage by Locale</h3>
                  <div className="space-y-2">
                    {Object.entries(metrics.translationCoverage).map(([locale, coverage]) => (
                      <div 
                        key={locale}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                      >
                        <span className="font-medium">{locale}</span>
                        <span className="text-gray-600">{coverage.toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'missing' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">Missing Translations</h3>
                  <span className="text-sm text-gray-500">
                    Total: {Object.values(metrics.missingKeys)
                      .reduce((acc, keys) => acc + keys.length, 0)}
                  </span>
                </div>

                {Object.entries(metrics.missingKeys).map(([locale, keys]) => (
                  <MissingKeyDisplay 
                    key={locale}
                    locale={locale}
                    keys={keys}
                  />
                ))}
              </div>
            )}

            {activeTab === 'config' && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded">
                  <h3 className="font-semibold mb-2">Locale Configuration</h3>
                  <pre className="text-sm overflow-auto max-h-40">
                    {JSON.stringify(getConfig(), null, 2)}
                  </pre>
                </div>

                <div className="p-4 bg-blue-50 rounded">
                  <h3 className="font-semibold mb-2">Available Locales</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {metrics.availableLocales.map(locale => (
                      <button
                        key={locale}
                        onClick={() => setLocale(locale)}
                        className={`p-2 rounded text-sm ${
                          locale === metrics.activeLocale
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {locale}
                      </button>
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
                className="px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
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

export default LocalizationMonitor;
