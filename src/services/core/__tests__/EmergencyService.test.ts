import { EmergencyService } from '../EmergencyService';
import { CacheService } from '../CacheService';
import { EmergencySeverity } from '../../types/IEmergencyService';
import { ServiceStatus } from '../../types/IService';

// Mock CacheService
jest.mock('../CacheService', () => {
  const mockCacheService = {
    get: jest.fn(),
    set: jest.fn(),
    clear: jest.fn(),
    getInstance: jest.fn()
  };
  return {
    CacheService: {
      getInstance: () => mockCacheService
    }
  };
});

describe('EmergencyService', () => {
  let emergencyService: EmergencyService;
  const mockCacheService = CacheService.getInstance();

  const mockAlerts = [
    {
      id: '1',
      message: 'Flash flooding in Brisbane CBD',
      severity: EmergencySeverity.CRITICAL,
      location: 'Brisbane CBD',
      timestamp: new Date('2024-01-01T10:00:00'),
      contactNumber: '1300 309 361'
    },
    {
      id: '2',
      message: 'Storm damage reported in Gold Coast',
      severity: EmergencySeverity.HIGH,
      location: 'Gold Coast',
      timestamp: new Date('2024-01-01T09:00:00'),
      contactNumber: '1300 309 361',
      expiresAt: new Date(Date.now() + 3600000) // Expires in 1 hour
    }
  ];

  beforeEach(async () => {
    jest.clearAllMocks();
    emergencyService = EmergencyService.getInstance();
    await emergencyService.initialize();
  });

  afterEach(async () => {
    await emergencyService.dispose();
    jest.clearAllTimers();
  });

  describe('Initialization', () => {
    it('should be a singleton', () => {
      const instance1 = EmergencyService.getInstance();
      const instance2 = EmergencyService.getInstance();
      expect(instance1).toBe(instance2);
    });

    it('should initialize with correct status', () => {
      expect(emergencyService.getStatus()).toBe(ServiceStatus.READY);
      expect(emergencyService.isInitialized()).toBe(true);
    });

    it('should restore alerts from cache', async () => {
      (mockCacheService.get as jest.Mock).mockResolvedValue(mockAlerts);

      const service = EmergencyService.getInstance();
      await service.initialize();

      expect(mockCacheService.get).toHaveBeenCalled();
      expect(service.getCurrentAlerts()).toHaveLength(mockAlerts.length);
    });
  });

  describe('Alert Management', () => {
    it('should get current alerts', () => {
      const alerts = emergencyService.getCurrentAlerts();
      expect(Array.isArray(alerts)).toBe(true);
    });

    it('should filter out expired alerts', () => {
      const expiredAlert = {
        ...mockAlerts[0],
        expiresAt: new Date(Date.now() - 1000) // Expired 1 second ago
      };

      const alerts = [expiredAlert, mockAlerts[1]];
      (mockCacheService.get as jest.Mock).mockResolvedValue(alerts);

      const currentAlerts = emergencyService.getCurrentAlerts();
      expect(currentAlerts).not.toContainEqual(expiredAlert);
    });

    it('should sort alerts by severity and timestamp', () => {
      const alerts = emergencyService.getCurrentAlerts();
      expect(alerts[0]?.severity).toBe(EmergencySeverity.CRITICAL);
    });

    it('should detect critical alerts', () => {
      expect(emergencyService.hasCriticalAlerts()).toBe(true);
    });
  });

  describe('Service Areas', () => {
    it('should get service areas', () => {
      const areas = emergencyService.getServiceAreas();
      expect(areas.length).toBeGreaterThan(0);
      expect(areas[0]).toHaveProperty('name');
      expect(areas[0]).toHaveProperty('isActive');
      expect(areas[0]).toHaveProperty('responseTime');
    });
  });

  describe('Emergency Contact', () => {
    it('should get emergency contact number', () => {
      const contact = emergencyService.getEmergencyContact();
      expect(contact).toBe('1300 309 361');
    });
  });

  describe('Alert Subscriptions', () => {
    it('should handle alert subscriptions', () => {
      const mockCallback = jest.fn();
      const unsubscribe = emergencyService.subscribeToAlerts(mockCallback);

      expect(mockCallback).toHaveBeenCalledWith(emergencyService.getCurrentAlerts());
      expect(typeof unsubscribe).toBe('function');
    });

    it('should cleanup subscriptions on dispose', async () => {
      const mockCallback = jest.fn();
      emergencyService.subscribeToAlerts(mockCallback);

      await emergencyService.dispose();
      expect(mockCacheService.clear).toHaveBeenCalled();
    });
  });

  describe('Cache Management', () => {
    it('should update cache when alerts change', async () => {
      const alerts = emergencyService.getCurrentAlerts();
      expect(mockCacheService.set).toHaveBeenCalledWith(
        expect.any(String),
        alerts,
        expect.any(Object)
      );
    });

    it('should clear cache on dispose', async () => {
      await emergencyService.dispose();
      expect(mockCacheService.clear).toHaveBeenCalled();
    });
  });

  describe('Cleanup', () => {
    it('should cleanup expired alerts periodically', () => {
      jest.useFakeTimers();

      const expiredAlert = {
        ...mockAlerts[0],
        expiresAt: new Date(Date.now() + 500) // Expires in 500ms
      };

      (mockCacheService.get as jest.Mock).mockResolvedValue([expiredAlert]);

      // Fast forward past expiration
      jest.advanceTimersByTime(60000);

      const currentAlerts = emergencyService.getCurrentAlerts();
      expect(currentAlerts).not.toContainEqual(expiredAlert);

      jest.useRealTimers();
    });
  });
});
