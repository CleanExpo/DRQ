import { BaseService, RegisterService } from '../types/IService';
import {
  IEmergencyService,
  EmergencyAlert,
  EmergencySeverity,
  ServiceArea
} from '../types/IEmergencyService';
import { CacheService } from './CacheService';
import { logger } from '@/utils/logger';

const CACHE_NAMESPACE = 'emergency';
const ALERTS_CACHE_KEY = 'current-alerts';
const SERVICE_AREAS_CACHE_KEY = 'service-areas';

type AlertCallback = (alerts: EmergencyAlert[]) => void;

@RegisterService({
  name: 'EmergencyService',
  dependencies: ['CacheService']
})
export class EmergencyService extends BaseService implements IEmergencyService {
  private static instance: EmergencyService;
  private cacheService: CacheService;
  private currentAlerts: EmergencyAlert[] = [];
  private subscribers: Set<AlertCallback> = new Set();
  private readonly defaultContact = '1300 309 361';
  private serviceAreas: ServiceArea[] = [
    {
      name: 'Brisbane',
      isActive: true,
      responseTime: '30-60 minutes',
      contactNumber: '1300 309 361'
    },
    {
      name: 'Gold Coast',
      isActive: true,
      responseTime: '30-60 minutes',
      contactNumber: '1300 309 361'
    },
    {
      name: 'Sunshine Coast',
      isActive: true,
      responseTime: '45-90 minutes',
      contactNumber: '1300 309 361'
    }
  ];

  private constructor() {
    super('EmergencyService');
    this.cacheService = CacheService.getInstance();
  }

  public static getInstance(): EmergencyService {
    if (!EmergencyService.instance) {
      EmergencyService.instance = new EmergencyService();
    }
    return EmergencyService.instance;
  }

  protected async onInitialize(): Promise<void> {
    try {
      // Restore alerts from cache
      const cachedAlerts = await this.cacheService.get<EmergencyAlert[]>(
        ALERTS_CACHE_KEY,
        CACHE_NAMESPACE
      );

      if (cachedAlerts) {
        // Filter out expired alerts
        this.currentAlerts = cachedAlerts.filter(alert => 
          !alert.expiresAt || new Date(alert.expiresAt) > new Date()
        );
      }

      // Start periodic cleanup of expired alerts
      this.startCleanupInterval();
      
      logger.info('EmergencyService initialized');
    } catch (error) {
      logger.error('Failed to initialize EmergencyService:', error);
      throw error;
    }
  }

  protected async onDispose(): Promise<void> {
    this.subscribers.clear();
    await this.cacheService.clear(CACHE_NAMESPACE);
  }

  public getCurrentAlerts(): EmergencyAlert[] {
    return this.currentAlerts
      .filter(alert => !alert.expiresAt || new Date(alert.expiresAt) > new Date())
      .sort((a, b) => {
        // Sort by severity first
        const severityOrder = {
          [EmergencySeverity.CRITICAL]: 0,
          [EmergencySeverity.HIGH]: 1,
          [EmergencySeverity.MEDIUM]: 2,
          [EmergencySeverity.LOW]: 3
        };
        
        const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
        if (severityDiff !== 0) return severityDiff;
        
        // Then by timestamp (newest first)
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });
  }

  public getEmergencyContact(): string {
    return this.defaultContact;
  }

  public hasCriticalAlerts(): boolean {
    return this.currentAlerts.some(
      alert => 
        alert.severity === EmergencySeverity.CRITICAL &&
        (!alert.expiresAt || new Date(alert.expiresAt) > new Date())
    );
  }

  public subscribeToAlerts(callback: AlertCallback): () => void {
    this.subscribers.add(callback);
    // Immediately notify of current alerts
    callback(this.getCurrentAlerts());
    
    return () => {
      this.subscribers.delete(callback);
    };
  }

  public getServiceAreas(): ServiceArea[] {
    return this.serviceAreas;
  }

  private notifySubscribers(): void {
    const alerts = this.getCurrentAlerts();
    this.subscribers.forEach(callback => {
      try {
        callback(alerts);
      } catch (error) {
        logger.error('Error in emergency alert subscriber:', error);
      }
    });
  }

  private startCleanupInterval(): void {
    setInterval(() => {
      const now = new Date();
      const initialCount = this.currentAlerts.length;
      
      this.currentAlerts = this.currentAlerts.filter(
        alert => !alert.expiresAt || new Date(alert.expiresAt) > now
      );

      if (this.currentAlerts.length !== initialCount) {
        this.notifySubscribers();
        this.updateCache();
      }
    }, 60000); // Check every minute
  }

  private async updateCache(): Promise<void> {
    try {
      await this.cacheService.set(
        ALERTS_CACHE_KEY,
        this.currentAlerts,
        { namespace: CACHE_NAMESPACE }
      );
    } catch (error) {
      logger.error('Failed to update emergency alerts cache:', error);
    }
  }
}
