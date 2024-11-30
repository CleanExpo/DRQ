import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '@/services/NotificationService';
import { logger } from '@/utils/logger';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  link?: {
    url: string;
    text: string;
  };
  metadata: {
    createdAt: string;
    expiresAt?: string;
    readAt?: string;
    dismissedAt?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    category?: string;
    tags?: string[];
    source: string;
  };
}

interface NotificationMetrics {
  totalNotifications: number;
  unreadCount: number;
  notificationsByType: Record<string, number>;
  notificationsByPriority: Record<string, number>;
  averageReadTime: number;
  dismissRate: number;
  lastUpdate: number;
}

interface UseNotificationOptions {
  autoMarkAsRead?: boolean;
  autoDismissAfter?: number;
  onNotification?: (notification: Notification) => void;
  onError?: (error: Error) => void;
}

export function useNotification(options: UseNotificationOptions = {}) {
  const {
    autoMarkAsRead = false,
    autoDismissAfter,
    onNotification,
    onError
  } = options;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [metrics, setMetrics] = useState<NotificationMetrics>(notificationService.getMetrics());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load initial notifications
    loadNotifications();

    // Subscribe to notification events
    const unsubscribe = notificationService.onNotificationEvent((type, data) => {
      switch (type) {
        case 'notification:created':
          handleNewNotification(data);
          break;
        case 'notification:read':
        case 'notification:dismissed':
          loadNotifications();
          break;
        case 'notifications:cleared':
          setNotifications([]);
          break;
      }
      setMetrics(notificationService.getMetrics());
    });

    return unsubscribe;
  }, []);

  const loadNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      const notifications = await notificationService.getNotifications();
      setNotifications(notifications);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to load notifications');
      onError?.(err);
      logger.error('Failed to load notifications', { error });
    } finally {
      setIsLoading(false);
    }
  }, [onError]);

  const handleNewNotification = useCallback((notification: Notification) => {
    setNotifications(prev => [...prev, notification]);
    onNotification?.(notification);

    if (autoMarkAsRead) {
      markAsRead(notification.id);
    }

    if (autoDismissAfter) {
      setTimeout(() => {
        dismiss(notification.id);
      }, autoDismissAfter);
    }
  }, [autoMarkAsRead, autoDismissAfter, onNotification]);

  const createNotification = useCallback(async (
    templateId: string,
    data: Record<string, any> = {}
  ): Promise<Notification> => {
    try {
      setIsLoading(true);
      const notification = await notificationService.createNotification(templateId, data);
      return notification;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to create notification');
      onError?.(err);
      logger.error('Failed to create notification', { templateId, error });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [onError]);

  const markAsRead = useCallback(async (id: string): Promise<void> => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev =>
        prev.map(n =>
          n.id === id
            ? { ...n, metadata: { ...n.metadata, readAt: new Date().toISOString() } }
            : n
        )
      );
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to mark as read');
      onError?.(err);
      logger.error('Failed to mark notification as read', { id, error });
    }
  }, [onError]);

  const dismiss = useCallback(async (id: string): Promise<void> => {
    try {
      await notificationService.dismiss(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to dismiss notification');
      onError?.(err);
      logger.error('Failed to dismiss notification', { id, error });
    }
  }, [onError]);

  const clearAll = useCallback(async (): Promise<void> => {
    try {
      await notificationService.clearAll();
      setNotifications([]);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to clear notifications');
      onError?.(err);
      logger.error('Failed to clear notifications', { error });
    }
  }, [onError]);

  const getUnreadCount = useCallback((): number => {
    return notifications.filter(n => !n.metadata.readAt).length;
  }, [notifications]);

  const getByPriority = useCallback((priority: string): Notification[] => {
    return notifications.filter(n => n.metadata.priority === priority);
  }, [notifications]);

  const getByType = useCallback((type: string): Notification[] => {
    return notifications.filter(n => n.type === type);
  }, [notifications]);

  const generateReport = useCallback(async () => {
    try {
      return await notificationService.generateReport();
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to generate report');
      onError?.(err);
      logger.error('Failed to generate report', { error });
      throw err;
    }
  }, [onError]);

  return {
    notifications,
    metrics,
    isLoading,
    createNotification,
    markAsRead,
    dismiss,
    clearAll,
    getUnreadCount,
    getByPriority,
    getByType,
    generateReport
  };
}

// Example usage:
/*
function NotificationComponent() {
  const {
    notifications,
    metrics,
    isLoading,
    createNotification,
    markAsRead,
    dismiss
  } = useNotification({
    autoMarkAsRead: true,
    autoDismissAfter: 5000, // 5 seconds
    onNotification: (notification) => {
      console.log('New notification:', notification);
    }
  });

  const handleNewNotification = async () => {
    try {
      await createNotification('auth:login', {
        device: 'Desktop',
        location: 'Brisbane'
      });
    } catch (error) {
      console.error('Failed to create notification:', error);
    }
  };

  return (
    <div>
      <div>Unread: {metrics.unreadCount}</div>
      {notifications.map(notification => (
        <div key={notification.id}>
          <h3>{notification.title}</h3>
          <p>{notification.message}</p>
          <button onClick={() => markAsRead(notification.id)}>
            Mark as Read
          </button>
          <button onClick={() => dismiss(notification.id)}>
            Dismiss
          </button>
        </div>
      ))}
      <button onClick={handleNewNotification}>
        Create Test Notification
      </button>
    </div>
  );
}
*/
