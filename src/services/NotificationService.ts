import { logger } from '@/utils/logger';
import { cacheService } from './CacheService';

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

interface NotificationTemplate {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  titleTemplate: string;
  messageTemplate: string;
  metadata: {
    priority: 'low' | 'medium' | 'high' | 'urgent';
    category?: string;
    expiryDuration?: number;
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

class NotificationService {
  private static instance: NotificationService;
  private notifications: Map<string, Notification> = new Map();
  private templates: Map<string, NotificationTemplate> = new Map();
  private metrics: NotificationMetrics;
  private observers: ((type: string, data: any) => void)[] = [];

  private constructor() {
    this.metrics = this.initializeMetrics();
    this.initializeTemplates();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private initializeMetrics(): NotificationMetrics {
    return {
      totalNotifications: 0,
      unreadCount: 0,
      notificationsByType: {},
      notificationsByPriority: {},
      averageReadTime: 0,
      dismissRate: 0,
      lastUpdate: Date.now()
    };
  }

  private initializeTemplates(): void {
    // Add default templates
    this.addTemplate({
      id: 'auth:login',
      type: 'info',
      titleTemplate: 'New Login',
      messageTemplate: 'New login from {{device}} in {{location}}',
      metadata: {
        priority: 'low',
        category: 'security'
      }
    });

    this.addTemplate({
      id: 'auth:password_reset',
      type: 'warning',
      titleTemplate: 'Password Reset Requested',
      messageTemplate: 'A password reset was requested for your account',
      metadata: {
        priority: 'high',
        category: 'security',
        expiryDuration: 3600000 // 1 hour
      }
    });
  }

  public addTemplate(template: NotificationTemplate): void {
    this.templates.set(template.id, template);
  }

  public async createNotification(
    templateId: string,
    data: Record<string, any> = {}
  ): Promise<Notification> {
    try {
      const template = this.templates.get(templateId);
      if (!template) {
        throw new Error(`Template not found: ${templateId}`);
      }

      const notification: Notification = {
        id: this.generateId(),
        type: template.type,
        title: this.interpolate(template.titleTemplate, data),
        message: this.interpolate(template.messageTemplate, data),
        metadata: {
          createdAt: new Date().toISOString(),
          priority: template.metadata.priority,
          category: template.metadata.category,
          source: templateId
        }
      };

      if (template.metadata.expiryDuration) {
        notification.metadata.expiresAt = new Date(
          Date.now() + template.metadata.expiryDuration
        ).toISOString();
      }

      this.notifications.set(notification.id, notification);
      this.updateMetrics();
      this.notifyObservers('notification:created', notification);

      // Cache notification
      await cacheService.set(`notification:${notification.id}`, notification, {
        ttl: template.metadata.expiryDuration || 86400000, // 24 hours default
        type: 'notification'
      });

      logger.debug('Notification created', { id: notification.id, type: notification.type });
      return notification;
    } catch (error) {
      logger.error('Failed to create notification', { templateId, error });
      throw error;
    }
  }

  private interpolate(template: string, data: Record<string, any>): string {
    return template.replace(/\{\{([^}]+)\}\}/g, (_, key) => {
      return data[key.trim()] || '';
    });
  }

  public async getNotifications(
    options: {
      unreadOnly?: boolean;
      type?: string;
      priority?: string;
      category?: string;
    } = {}
  ): Promise<Notification[]> {
    const notifications = Array.from(this.notifications.values());
    return notifications.filter(notification => {
      if (options.unreadOnly && notification.metadata.readAt) {
        return false;
      }
      if (options.type && notification.type !== options.type) {
        return false;
      }
      if (options.priority && notification.metadata.priority !== options.priority) {
        return false;
      }
      if (options.category && notification.metadata.category !== options.category) {
        return false;
      }
      return true;
    });
  }

  public async markAsRead(id: string): Promise<void> {
    try {
      const notification = this.notifications.get(id);
      if (!notification) {
        throw new Error(`Notification not found: ${id}`);
      }

      if (!notification.metadata.readAt) {
        notification.metadata.readAt = new Date().toISOString();
        this.updateMetrics();
        this.notifyObservers('notification:read', notification);

        // Update cache
        await cacheService.set(`notification:${id}`, notification, {
          ttl: 86400000, // 24 hours
          type: 'notification'
        });
      }

      logger.debug('Notification marked as read', { id });
    } catch (error) {
      logger.error('Failed to mark notification as read', { id, error });
      throw error;
    }
  }

  public async dismiss(id: string): Promise<void> {
    try {
      const notification = this.notifications.get(id);
      if (!notification) {
        throw new Error(`Notification not found: ${id}`);
      }

      notification.metadata.dismissedAt = new Date().toISOString();
      this.updateMetrics();
      this.notifyObservers('notification:dismissed', notification);

      // Remove from cache
      await cacheService.invalidate(`notification:${id}`);

      logger.debug('Notification dismissed', { id });
    } catch (error) {
      logger.error('Failed to dismiss notification', { id, error });
      throw error;
    }
  }

  public async clearAll(): Promise<void> {
    try {
      this.notifications.clear();
      this.updateMetrics();
      this.notifyObservers('notifications:cleared', {});

      // Clear cache
      // In production, this would use a more targeted approach
      logger.debug('All notifications cleared');
    } catch (error) {
      logger.error('Failed to clear notifications', { error });
      throw error;
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  public onNotificationEvent(callback: (type: string, data: any) => void): () => void {
    this.observers.push(callback);
    return () => {
      this.observers = this.observers.filter(cb => cb !== callback);
    };
  }

  private notifyObservers(type: string, data: any): void {
    this.observers.forEach(callback => {
      try {
        callback(type, data);
      } catch (error) {
        logger.error('Notification event callback failed', { error });
      }
    });
  }

  private updateMetrics(): void {
    const notifications = Array.from(this.notifications.values());
    const now = Date.now();

    this.metrics = {
      totalNotifications: notifications.length,
      unreadCount: notifications.filter(n => !n.metadata.readAt).length,
      notificationsByType: notifications.reduce((acc, n) => {
        acc[n.type] = (acc[n.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      notificationsByPriority: notifications.reduce((acc, n) => {
        acc[n.metadata.priority] = (acc[n.metadata.priority] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      averageReadTime: this.calculateAverageReadTime(notifications),
      dismissRate: this.calculateDismissRate(notifications),
      lastUpdate: now
    };
  }

  private calculateAverageReadTime(notifications: Notification[]): number {
    const readNotifications = notifications.filter(
      n => n.metadata.readAt && !n.metadata.dismissedAt
    );

    if (readNotifications.length === 0) return 0;

    const totalReadTime = readNotifications.reduce((sum, n) => {
      const readTime = new Date(n.metadata.readAt!).getTime() -
        new Date(n.metadata.createdAt).getTime();
      return sum + readTime;
    }, 0);

    return totalReadTime / readNotifications.length;
  }

  private calculateDismissRate(notifications: Notification[]): number {
    if (notifications.length === 0) return 0;
    const dismissedCount = notifications.filter(n => n.metadata.dismissedAt).length;
    return (dismissedCount / notifications.length) * 100;
  }

  public getMetrics(): NotificationMetrics {
    return { ...this.metrics };
  }

  public async generateReport(): Promise<string> {
    const report = {
      metrics: this.metrics,
      notifications: Array.from(this.notifications.values()).map(n => ({
        id: n.id,
        type: n.type,
        priority: n.metadata.priority,
        createdAt: n.metadata.createdAt,
        readAt: n.metadata.readAt,
        dismissedAt: n.metadata.dismissedAt
      })),
      templates: Array.from(this.templates.values()).map(t => ({
        id: t.id,
        type: t.type,
        priority: t.metadata.priority,
        category: t.metadata.category
      })),
      timestamp: new Date().toISOString()
    };

    return JSON.stringify(report, null, 2);
  }
}

export const notificationService = NotificationService.getInstance();
export default NotificationService;
