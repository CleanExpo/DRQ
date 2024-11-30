'use client';

import React, { useState } from 'react';
import { useNotification } from '@/hooks/useNotification';

interface NotificationDisplayProps {
  notification: {
    id: string;
    type: string;
    title: string;
    message: string;
    metadata: {
      priority: string;
      createdAt: string;
      readAt?: string;
      dismissedAt?: string;
      category?: string;
      source: string;
    };
  };
  onRead: (id: string) => void;
  onDismiss: (id: string) => void;
}

const NotificationDisplay: React.FC<NotificationDisplayProps> = ({ 
  notification,
  onRead,
  onDismiss
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="border rounded p-3 mb-2 bg-white">
      <div 
        className="flex justify-between items-start cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <div className="font-medium">{notification.title}</div>
          <div className="text-sm text-gray-500">{notification.message}</div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`text-sm ${getTypeColor(notification.type)}`}>
            {notification.type}
          </span>
          <span className={`text-sm px-2 py-1 rounded ${getPriorityColor(notification.metadata.priority)}`}>
            {notification.metadata.priority}
          </span>
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-2 space-y-2 text-sm">
          <div>
            <span className="font-medium">Created: </span>
            <span className="text-gray-600">
              {new Date(notification.metadata.createdAt).toLocaleString()}
            </span>
          </div>
          {notification.metadata.category && (
            <div>
              <span className="font-medium">Category: </span>
              <span className="text-gray-600">{notification.metadata.category}</span>
            </div>
          )}
          <div>
            <span className="font-medium">Source: </span>
            <span className="text-gray-600">{notification.metadata.source}</span>
          </div>
          <div>
            <span className="font-medium">Status: </span>
            <span className="text-gray-600">
              {notification.metadata.dismissedAt ? 'Dismissed' :
                notification.metadata.readAt ? 'Read' : 'Unread'}
            </span>
          </div>
          <div className="flex space-x-2 mt-3">
            {!notification.metadata.readAt && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRead(notification.id);
                }}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
              >
                Mark as Read
              </button>
            )}
            {!notification.metadata.dismissedAt && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDismiss(notification.id);
                }}
                className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
              >
                Dismiss
              </button>
            )}
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

interface NotificationMonitorProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const NotificationMonitor: React.FC<NotificationMonitorProps> = ({
  position = 'bottom-right'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(process.env.NODE_ENV === 'development');
  const [activeTab, setActiveTab] = useState<'current' | 'metrics' | 'test'>('current');

  const {
    notifications,
    metrics,
    isLoading,
    createNotification,
    markAsRead,
    dismiss,
    clearAll,
    generateReport
  } = useNotification({
    onNotification: (notification) => {
      console.log('New notification:', notification);
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
    tab: 'current' | 'metrics' | 'test';
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
        {isExpanded ? '×' : '🔔'}
      </button>

      {isExpanded && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">Notification Monitor</h2>
            <div className="text-sm text-gray-600 mt-1">
              {metrics.unreadCount} unread notifications
            </div>
          </div>

          <div className="border-b">
            <div className="flex">
              <TabButton tab="current" label="Current" />
              <TabButton tab="metrics" label="Metrics" />
              <TabButton tab="test" label="Test" />
            </div>
          </div>

          <div className="p-4 max-h-[60vh] overflow-auto">
            {activeTab === 'current' && (
              <div className="space-y-4">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <NotificationDisplay
                      key={notification.id}
                      notification={notification}
                      onRead={markAsRead}
                      onDismiss={dismiss}
                    />
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-600">
                    No notifications
                  </div>
                )}

                {notifications.length > 0 && (
                  <div className="flex justify-end">
                    <button
                      onClick={clearAll}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'metrics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <MetricDisplay 
                    label="Total Notifications" 
                    value={metrics.totalNotifications}
                  />
                  <MetricDisplay 
                    label="Unread" 
                    value={metrics.unreadCount}
                    color="yellow"
                  />
                  <MetricDisplay 
                    label="Dismiss Rate" 
                    value={`${metrics.dismissRate.toFixed(1)}%`}
                    color="red"
                  />
                  <MetricDisplay 
                    label="Avg Read Time" 
                    value={`${(metrics.averageReadTime / 1000).toFixed(1)}s`}
                    color="green"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">By Type</h3>
                  <div className="space-y-2">
                    {Object.entries(metrics.notificationsByType).map(([type, count]) => (
                      <div 
                        key={type}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                      >
                        <span className="font-medium capitalize">{type}</span>
                        <span className="text-gray-600">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">By Priority</h3>
                  <div className="space-y-2">
                    {Object.entries(metrics.notificationsByPriority).map(([priority, count]) => (
                      <div 
                        key={priority}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                      >
                        <span className="font-medium capitalize">{priority}</span>
                        <span className="text-gray-600">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'test' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => createNotification('auth:login', {
                      device: 'Desktop',
                      location: 'Brisbane'
                    })}
                    className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <div className="font-medium">Test Login</div>
                    <div className="text-sm text-gray-600">Create login notification</div>
                  </button>
                  <button
                    onClick={() => createNotification('auth:password_reset', {})}
                    className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
                  >
                    <div className="font-medium">Test Password Reset</div>
                    <div className="text-sm text-gray-600">Create reset notification</div>
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

export default NotificationMonitor;
