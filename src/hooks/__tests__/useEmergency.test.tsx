import { renderHook, act } from '@testing-library/react';
import { useEmergency } from '../useEmergency';
import { EmergencyService } from '@/services/core/EmergencyService';
import { EmergencySeverity } from '@/services/types/IEmergencyService';

// Mock EmergencyService
jest.mock('@/services/core/EmergencyService', () => {
  const mockEmergencyService = {
    getCurrentAlerts: jest.fn(),
    hasCriticalAlerts: jest.fn(),
    getEmergencyContact: jest.fn(),
    getServiceAreas: jest.fn(),
    subscribeToAlerts: jest.fn(),
    getInstance: jest.fn()
  };
  return {
    EmergencyService: {
      getInstance: () => mockEmergencyService
    }
  };
});

describe('useEmergency', () => {
  const mockAlerts = [
    {
      id: '1',
      message: 'Flash flooding in Brisbane CBD',
      severity: EmergencySeverity.CRITICAL,
      location: 'Brisbane CBD',
      timestamp: new Date('2024-01-01T10:00:00'),
      contactNumber: '1300 309 361'
    }
  ];

  const mockServiceAreas = [
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
    }
  ];

  const mockEmergencyContact = '1300 309 361';

  const mockEmergencyService = EmergencyService.getInstance();

  beforeEach(() => {
    jest.clearAllMocks();
    (mockEmergencyService.getCurrentAlerts as jest.Mock).mockReturnValue(mockAlerts);
    (mockEmergencyService.hasCriticalAlerts as jest.Mock).mockReturnValue(true);
    (mockEmergencyService.getEmergencyContact as jest.Mock).mockReturnValue(mockEmergencyContact);
    (mockEmergencyService.getServiceAreas as jest.Mock).mockReturnValue(mockServiceAreas);
    (mockEmergencyService.subscribeToAlerts as jest.Mock).mockImplementation(cb => {
      cb(mockAlerts);
      return () => {};
    });
  });

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useEmergency());

    expect(result.current.loading).toBe(true);
    expect(result.current.alerts).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should load emergency data', async () => {
    const { result } = renderHook(() => useEmergency());

    // Wait for initialization
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.alerts).toEqual(mockAlerts);
    expect(result.current.hasCritical).toBe(true);
    expect(result.current.emergencyContact).toBe(mockEmergencyContact);
    expect(result.current.serviceAreas).toEqual(mockServiceAreas);
  });

  it('should handle alert updates', async () => {
    const { result } = renderHook(() => useEmergency());

    // Wait for initialization
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const newAlerts = [
      {
        ...mockAlerts[0],
        message: 'Updated alert'
      }
    ];

    // Simulate alert update
    act(() => {
      const subscribeCallback = (mockEmergencyService.subscribeToAlerts as jest.Mock).mock.calls[0][0];
      subscribeCallback(newAlerts);
    });

    expect(result.current.alerts[0].message).toBe('Updated alert');
  });

  it('should check if location is in service area', async () => {
    const { result } = renderHook(() => useEmergency());

    // Wait for initialization
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.isInServiceArea('Brisbane')).toBe(true);
    expect(result.current.isInServiceArea('Sydney')).toBe(false);
  });

  it('should get response time for location', async () => {
    const { result } = renderHook(() => useEmergency());

    // Wait for initialization
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.getResponseTime('Brisbane')).toBe('30-60 minutes');
    expect(result.current.getResponseTime('Sydney')).toBeNull();
  });

  it('should get nearest service area', async () => {
    const { result } = renderHook(() => useEmergency());

    // Wait for initialization
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const area = result.current.getNearestServiceArea(-27.4698, 153.0251); // Brisbane coordinates
    expect(area).toEqual(mockServiceAreas[0]);
  });

  it('should handle errors gracefully', async () => {
    const error = new Error('Test error');
    (mockEmergencyService.getCurrentAlerts as jest.Mock).mockImplementation(() => {
      throw error;
    });

    const { result } = renderHook(() => useEmergency());

    // Wait for initialization
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toEqual(error);
  });

  it('should cleanup subscription on unmount', () => {
    const unsubscribe = jest.fn();
    (mockEmergencyService.subscribeToAlerts as jest.Mock).mockReturnValue(unsubscribe);

    const { unmount } = renderHook(() => useEmergency());
    unmount();

    expect(unsubscribe).toHaveBeenCalled();
  });
});
