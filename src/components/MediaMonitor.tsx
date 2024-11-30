'use client';

import React, { useState } from 'react';
import { useMedia } from '@/hooks/useMedia';

interface AssetDisplayProps {
  asset: {
    id: string;
    type: string;
    url: string;
    thumbnailUrl?: string;
    metadata: {
      filename: string;
      size: number;
      dimensions?: {
        width: number;
        height: number;
      };
      createdAt: string;
    };
    status: string;
    error?: string;
  };
}

const AssetDisplay: React.FC<AssetDisplayProps> = ({ asset }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'text-green-600';
      case 'processing': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const formatSize = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  };

  return (
    <div className="border rounded p-3 mb-2 bg-white">
      <div 
        className="flex justify-between items-start cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          {asset.thumbnailUrl && (
            <img 
              src={asset.thumbnailUrl} 
              alt={asset.metadata.filename}
              className="w-10 h-10 object-cover rounded"
            />
          )}
          <div>
            <div className="font-medium">{asset.metadata.filename}</div>
            <div className="text-sm text-gray-500">
              {formatSize(asset.metadata.size)}
            </div>
          </div>
        </div>
        <span className={`${getStatusColor(asset.status)}`}>
          {asset.status}
        </span>
      </div>
      
      {isExpanded && (
        <div className="mt-3 space-y-2 text-sm">
          {asset.metadata.dimensions && (
            <div>
              <span className="font-medium">Dimensions: </span>
              <span className="text-gray-600">
                {asset.metadata.dimensions.width} × {asset.metadata.dimensions.height}
              </span>
            </div>
          )}
          <div>
            <span className="font-medium">Created: </span>
            <span className="text-gray-600">
              {new Date(asset.metadata.createdAt).toLocaleString()}
            </span>
          </div>
          <div>
            <span className="font-medium">URL: </span>
            <a 
              href={asset.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {asset.url}
            </a>
          </div>
          {asset.error && (
            <div className="text-red-600">
              <span className="font-medium">Error: </span>
              {asset.error}
            </div>
          )}
        </div>
      )}
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

interface MediaMonitorProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const MediaMonitor: React.FC<MediaMonitorProps> = ({
  position = 'bottom-right'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(process.env.NODE_ENV === 'development');
  const [activeTab, setActiveTab] = useState<'assets' | 'metrics' | 'upload'>('assets');
  const [dragActive, setDragActive] = useState(false);

  const {
    metrics,
    isUploading,
    uploadAsset,
    generateReport
  } = useMedia({
    onAssetChange: (type, data) => {
      console.log('Asset event:', type, data);
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
    tab: 'assets' | 'metrics' | 'upload';
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

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    for (const file of files) {
      try {
        await uploadAsset(file);
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
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
        {isExpanded ? '×' : '🖼️'}
      </button>

      {isExpanded && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">Media Monitor</h2>
            <div className="text-sm text-gray-600 mt-1">
              Storage: {((metrics.storageUsage.used / metrics.storageUsage.total) * 100).toFixed(1)}% used
            </div>
          </div>

          <div className="border-b">
            <div className="flex">
              <TabButton tab="assets" label="Assets" />
              <TabButton tab="metrics" label="Metrics" />
              <TabButton tab="upload" label="Upload" />
            </div>
          </div>

          <div className="p-4 max-h-[60vh] overflow-auto">
            {activeTab === 'assets' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <MetricDisplay 
                    label="Total Assets" 
                    value={metrics.totalAssets}
                  />
                  <MetricDisplay 
                    label="Total Size" 
                    value={`${(metrics.totalSize / 1024 / 1024).toFixed(2)} MB`}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Recent Assets</h3>
                  {Object.entries(metrics.assetsByType).map(([type, count]) => (
                    <div 
                      key={type}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded mb-2"
                    >
                      <span className="font-medium capitalize">{type}</span>
                      <span className="text-gray-600">{count} assets</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'metrics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <MetricDisplay 
                    label="Processing Queue" 
                    value={metrics.processingQueue}
                    color={metrics.processingQueue > 0 ? 'yellow' : 'green'}
                  />
                  <MetricDisplay 
                    label="Storage Available" 
                    value={`${((metrics.storageUsage.available / metrics.storageUsage.total) * 100).toFixed(1)}%`}
                    color="green"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Storage Usage</h3>
                  <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full transition-all duration-500"
                      style={{ 
                        width: `${(metrics.storageUsage.used / metrics.storageUsage.total) * 100}%` 
                      }}
                    />
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    {(metrics.storageUsage.used / 1024 / 1024).toFixed(2)} MB used of{' '}
                    {(metrics.storageUsage.total / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'upload' && (
              <div 
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center
                  ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                  ${isUploading ? 'opacity-50' : ''}
                `}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <div className="text-4xl">📁</div>
                  <div className="text-gray-600">
                    {isUploading ? (
                      'Uploading...'
                    ) : (
                      <>
                        Drag and drop files here or{' '}
                        <label className="text-blue-600 hover:underline cursor-pointer">
                          browse
                          <input
                            type="file"
                            className="hidden"
                            multiple
                            onChange={(e) => {
                              const files = Array.from(e.target.files || []);
                              files.forEach(file => uploadAsset(file));
                            }}
                          />
                        </label>
                      </>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    Supported formats: JPG, PNG, GIF, MP4, WebM
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

export default MediaMonitor;
