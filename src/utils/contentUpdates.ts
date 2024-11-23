import { ServicePage, Location, DisasterEvent } from '../types/serviceTypes';
import { emergencyProtocol } from './emergencyProtocol';
import { trafficManager } from './trafficManagement';

interface EmergencyUpdate {
  type: 'flood' | 'fire' | 'storm' | 'other';
  severity: 1 | 2 | 3 | 4 | 5;
  location: Location;
  message: string;
  affectedAreas: string[];
  timestamp: number;
  expiresAt: number;
}

interface ContentUpdateQueue {
  priority: 'normal' | 'high' | 'emergency';
  updates: EmergencyUpdate[];
}

class ContentUpdateManager {
  private static instance: ContentUpdateManager;
  private updateQueue: ContentUpdateQueue = {
    priority: 'normal',
    updates: []
  };

  private activeEmergencies: Map<string, EmergencyUpdate> = new Map();
  private contentCache: Map<string, any> = new Map();

  private constructor() {
    this.initializeEmergencyListeners();
  }

  static getInstance(): ContentUpdateManager {
    if (!ContentUpdateManager.instance) {
      ContentUpdateManager.instance = new ContentUpdateManager();
    }
    return ContentUpdateManager.instance;
  }

  private initializeEmergencyListeners(): void {
    // Listen for traffic spikes that might indicate emergencies
    setInterval(() => {
      const stats = trafficManager.getTrafficStats();
      if (stats.requestsPerMinute > 2000) {
        this.elevateUpdatePriority('high');
      }
    }, 60000);
  }

  async addEmergencyUpdate(update: EmergencyUpdate): Promise<void> {
    const locationKey = `${update.location.slug}-${update.type}`;
    this.activeEmergencies.set(locationKey, update);
    
    // Clear expired updates
    this.cleanExpiredUpdates();

    // Add to queue with emergency priority
    this.updateQueue = {
      priority: 'emergency',
      updates: [...this.updateQueue.updates, update]
    };

    // Process emergency updates immediately
    await this.processEmergencyUpdates();
  }

  private async processEmergencyUpdates(): Promise<void> {
    const updates = this.updateQueue.updates;
    for (const update of updates) {
      // Generate emergency content
      const emergencyContent = await emergencyProtocol.updateEmergencyContent({
        type: update.type,
        severity: update.severity,
        location: update.location,
        description: update.message,
        timestamp: update.timestamp,
        affectedAreas: update.affectedAreas
      });

      // Update cache with emergency content
      this.updateContentCache(update.location.slug, emergencyContent);

      // Update affected service pages
      await this.updateAffectedPages(update);
    }

    // Clear processed updates
    this.updateQueue.updates = [];
  }

  private async updateAffectedPages(update: EmergencyUpdate): Promise<void> {
    const affectedPages = [
      `/services/${update.type}`,
      `/service-areas/${update.location.slug}`,
      '/'  // Update homepage with emergency banner
    ];

    for (const page of affectedPages) {
      const currentContent = this.contentCache.get(page) || {};
      const updatedContent = {
        ...currentContent,
        emergencyBanner: {
          visible: true,
          type: update.type,
          message: update.message,
          severity: update.severity,
          timestamp: update.timestamp
        },
        lastUpdated: Date.now()
      };

      this.contentCache.set(page, updatedContent);
    }
  }

  private updateContentCache(key: string, content: any): void {
    this.contentCache.set(key, {
      content,
      timestamp: Date.now(),
      priority: 'emergency'
    });
  }

  private cleanExpiredUpdates(): void {
    const now = Date.now();
    this.activeEmergencies.forEach((update, key) => {
      if (update.expiresAt < now) {
        this.activeEmergencies.delete(key);
      }
    });
  }

  private elevateUpdatePriority(priority: ContentUpdateQueue['priority']): void {
    this.updateQueue.priority = priority;
  }

  getActiveEmergencies(): EmergencyUpdate[] {
    return Array.from(this.activeEmergencies.values());
  }

  getEmergencyContent(locationSlug: string): any {
    return this.contentCache.get(locationSlug);
  }

  clearEmergencyStatus(locationSlug: string, type: string): void {
    const key = `${locationSlug}-${type}`;
    this.activeEmergencies.delete(key);
    this.contentCache.delete(locationSlug);
  }
}

export const contentUpdateManager = ContentUpdateManager.getInstance();
