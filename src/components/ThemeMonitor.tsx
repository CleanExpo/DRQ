'use client';

import React, { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';

interface ColorSwatchProps {
  color: string;
  name: string;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ color, name }) => (
  <div className="flex items-center space-x-2">
    <div 
      className="w-8 h-8 rounded border"
      style={{ backgroundColor: color }}
    />
    <div>
      <div className="text-sm font-medium">{name}</div>
      <div className="text-xs text-gray-500">{color}</div>
    </div>
  </div>
);

interface MetricDisplayProps {
  label: string;
  value: number | string;
  color?: string;
}

const MetricDisplay: React.FC<MetricDisplayProps> = ({ 
  label, 
  value, 
  color = 'teal' 
}) => (
  <div className={`p-4 bg-${color}-50 rounded-lg`}>
    <div className="text-sm text-gray-600">{label}</div>
    <div className={`text-2xl font-bold text-${color}-600`}>
      {typeof value === 'number' ? value.toFixed(2) : value}
    </div>
  </div>
);

interface ThemeMonitorProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const ThemeMonitor: React.FC<ThemeMonitorProps> = ({
  position = 'bottom-right'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(process.env.NODE_ENV === 'development');
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'metrics'>('colors');

  const {
    theme,
    metrics,
    isLoading,
    switchTheme,
    getThemeConfig,
    generateReport
  } = useTheme({
    onChange: (theme) => {
      console.log('Theme changed:', theme);
    }
  });

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  };

  if (!isVisible) return null;

  const currentTheme = getThemeConfig();

  const TabButton: React.FC<{
    tab: 'colors' | 'typography' | 'metrics';
    label: string;
  }> = ({ tab, label }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
        activeTab === tab
          ? 'bg-white text-teal-600 border-b-2 border-teal-600'
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
        className="absolute top-2 right-2 z-10 p-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors"
      >
        {isExpanded ? '×' : '🎨'}
      </button>

      {isExpanded && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">Theme Monitor</h2>
            <div className="text-sm text-gray-600 mt-1">
              Active Theme: {theme}
            </div>
          </div>

          <div className="border-b">
            <div className="flex">
              <TabButton tab="colors" label="Colors" />
              <TabButton tab="typography" label="Typography" />
              <TabButton tab="metrics" label="Metrics" />
            </div>
          </div>

          <div className="p-4 max-h-[60vh] overflow-auto">
            {activeTab === 'colors' && (
              <div className="space-y-6">
                <div className="grid gap-4">
                  {Object.entries(currentTheme.colors).map(([name, color]) => (
                    <ColorSwatch 
                      key={name}
                      color={color}
                      name={name}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'typography' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Font Sizes</h3>
                  <div className="space-y-2">
                    {Object.entries(currentTheme.typography.fontSize).map(([size, value]) => (
                      <div 
                        key={size}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                      >
                        <span className="font-medium">{size}</span>
                        <span className="text-gray-600">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Font Weights</h3>
                  <div className="space-y-2">
                    {Object.entries(currentTheme.typography.fontWeight).map(([weight, value]) => (
                      <div 
                        key={weight}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                      >
                        <span className="font-medium">{weight}</span>
                        <span className="text-gray-600">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'metrics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <MetricDisplay 
                    label="Available Themes" 
                    value={metrics.availableThemes.length}
                  />
                  <MetricDisplay 
                    label="Custom Properties" 
                    value={metrics.customProperties}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Theme Switcher</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {metrics.availableThemes.map(themeName => (
                      <button
                        key={themeName}
                        onClick={() => switchTheme(themeName)}
                        disabled={isLoading}
                        className={`p-2 rounded text-sm ${
                          themeName === theme
                            ? 'bg-teal-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {themeName}
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
                className="px-3 py-1 bg-teal-100 text-teal-700 rounded hover:bg-teal-200 transition-colors"
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

export default ThemeMonitor;
