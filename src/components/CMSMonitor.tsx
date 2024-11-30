'use client';

import React, { useState } from 'react';
import { useCMS } from '@/hooks/useCMS';

interface PageDisplayProps {
  page: {
    id: string;
    slug: string;
    title: string;
    metadata: {
      status: string;
      locale: string;
      updatedAt: string;
    };
  };
}

const PageDisplay: React.FC<PageDisplayProps> = ({ page }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-600';
      case 'draft': return 'text-yellow-600';
      case 'archived': return 'text-gray-600';
      default: return 'text-blue-600';
    }
  };

  return (
    <div className="border rounded p-3 mb-2 bg-white">
      <div 
        className="flex justify-between items-start cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <span className="font-medium">{page.title}</span>
          <span className="mx-2">•</span>
          <span className={`${getStatusColor(page.metadata.status)}`}>
            {page.metadata.status}
          </span>
        </div>
        <span className="text-sm text-gray-500">
          {new Date(page.metadata.updatedAt).toLocaleTimeString()}
        </span>
      </div>
      
      {isExpanded && (
        <div className="mt-2 space-y-2 text-sm">
          <div>
            <span className="font-medium">Slug: </span>
            <code className="bg-gray-100 px-1 rounded">{page.slug}</code>
          </div>
          <div>
            <span className="font-medium">Locale: </span>
            <span className="text-gray-700">{page.metadata.locale}</span>
          </div>
          <div>
            <span className="font-medium">ID: </span>
            <code className="bg-gray-100 px-1 rounded text-xs">{page.id}</code>
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

interface CMSMonitorProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const CMSMonitor: React.FC<CMSMonitorProps> = ({
  position = 'bottom-right'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(process.env.NODE_ENV === 'development');
  const [activeTab, setActiveTab] = useState<'pages' | 'blocks' | 'metrics'>('pages');

  const {
    currentPage,
    metrics,
    isLoading,
    getPagesByStatus,
    getBlocksByType,
    generateReport
  } = useCMS({
    onContentChange: (type, data) => {
      console.log('Content changed:', type, data);
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
    tab: 'pages' | 'blocks' | 'metrics';
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
        {isExpanded ? '×' : '📝'}
      </button>

      {isExpanded && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">CMS Monitor</h2>
            {currentPage && (
              <div className="text-sm text-gray-600 mt-1">
                Current Page: {currentPage.title}
              </div>
            )}
          </div>

          <div className="border-b">
            <div className="flex">
              <TabButton tab="pages" label="Pages" />
              <TabButton tab="blocks" label="Blocks" />
              <TabButton tab="metrics" label="Metrics" />
            </div>
          </div>

          <div className="p-4 max-h-[60vh] overflow-auto">
            {activeTab === 'pages' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Published Pages</h3>
                  {metrics.publishedPages > 0 ? (
                    getPagesByStatus('published').then(pages =>
                      pages.map(page => (
                        <PageDisplay key={page.id} page={page} />
                      ))
                    )
                  ) : (
                    <div className="text-gray-500">No published pages</div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Draft Pages</h3>
                  {metrics.draftPages > 0 ? (
                    getPagesByStatus('draft').then(pages =>
                      pages.map(page => (
                        <PageDisplay key={page.id} page={page} />
                      ))
                    )
                  ) : (
                    <div className="text-gray-500">No draft pages</div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'blocks' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(metrics.contentByType).map(([type, count]) => (
                    <MetricDisplay 
                      key={type}
                      label={`${type} blocks`}
                      value={count}
                    />
                  ))}
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Content Distribution</h3>
                  <div className="space-y-2">
                    {Object.entries(metrics.contentByLocale).map(([locale, count]) => (
                      <div 
                        key={locale}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                      >
                        <span className="font-medium">{locale}</span>
                        <span className="text-gray-600">{count} items</span>
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
                    label="Total Pages" 
                    value={metrics.totalPages}
                  />
                  <MetricDisplay 
                    label="Total Blocks" 
                    value={metrics.totalBlocks}
                  />
                  <MetricDisplay 
                    label="Published Pages" 
                    value={metrics.publishedPages}
                    color="green"
                  />
                  <MetricDisplay 
                    label="Draft Pages" 
                    value={metrics.draftPages}
                    color="yellow"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Content Types</h3>
                  <div className="space-y-2">
                    {Object.entries(metrics.contentByType).map(([type, count]) => (
                      <div 
                        key={type}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                      >
                        <span className="font-medium">{type}</span>
                        <span className="text-gray-600">{count} blocks</span>
                      </div>
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

export default CMSMonitor;
