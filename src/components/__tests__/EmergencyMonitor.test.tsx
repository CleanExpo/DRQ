import { render, screen, fireEvent, act } from '@testing-library/react';
import EmergencyMonitor from '../EmergencyMonitor';
import { EmergencyService } from '../../services/core/EmergencyService';
import { EmergencySeverity } from '../../services/types/IEmergencyService';

// Mock EmergencyService
jest.mock('../../services/core/EmergencyService', () => {
  const mockAlerts = [
    {
      id: '1',
      message: 'Flash flooding in Brisbane CBD',
      severity: EmergencySeverity.CRITICAL,
      location: 'Brisbane CBD',
      timestamp: new Date('2024-01-01T10:00:00').toISOString(),
      contactNumber: '1300 309 361'
    },
    {
      id: '2',
      message: 'Storm damage reported',
      severity: EmergencySeverity.HIGH,
      location: 'Gold Coast',
      timestamp: new Date('2024-01-01T09:00:00').toISOString(),
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

  const mockEmergencyService = {
    getCurrentAlerts: jest.fn().mockReturnValue(mockAlerts),
    hasCriticalAlerts: jest.fn().mockReturnValue(true),
    getServiceAreas: jest.fn().mockReturnValue(mockServiceAreas),
    getEmergencyContact: jest.fn().mockReturnValue('1300 309 361'),
    subscribeToAlerts: jest.fn(),
    getInstance: jest.fn()
  };

  return {
    EmergencyService: {
      getInstance: () => mockEmergencyService
    }
  };
});

describe('EmergencyMonitor', () => {
  const mockEmergencyService = EmergencyService.getInstance();
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it('should render emergency monitor button', () => {
    render(<EmergencyMonitor />);
    expect(screen.getByTestId('emergency-monitor-toggle')).toBeInTheDocument();
  });

  it('should not render in production mode', () => {
    process.env.NODE_ENV = 'production';
    render(<EmergencyMonitor />);
    expect(screen.queryByTestId('emergency-monitor')).not.toBeInTheDocument();
  });

  it('should toggle stats panel visibility', () => {
    render(<EmergencyMonitor />);
    
    // Initially hidden
    expect(screen.queryByTestId('emergency-stats-panel')).not.toBeInTheDocument();
    
    // Show panel
    fireEvent.click(screen.getByTestId('emergency-monitor-toggle'));
    expect(screen.getByTestId('emergency-stats-panel')).toBeInTheDocument();
    
    // Hide panel
    fireEvent.click(screen.getByTestId('emergency-monitor-toggle'));
    expect(screen.queryByTestId('emergency-stats-panel')).not.toBeInTheDocument();
  });

  it('should display active alerts', () => {
    render(<EmergencyMonitor />);
    fireEvent.click(screen.getByTestId('emergency-monitor-toggle'));

    expect(screen.getByTestId('alert-1')).toHaveTextContent('Flash flooding');
    expect(screen.getByTestId('alert-2')).toHaveTextContent('Storm damage');
  });

  it('should display service areas', () => {
    render(<EmergencyMonitor />);
    fireEvent.click(screen.getByTestId('emergency-monitor-toggle'));

    expect(screen.getByTestId('service-area-brisbane')).toHaveTextContent('30-60 minutes');
    expect(screen.getByTestId('service-area-gold-coast')).toHaveTextContent('30-60 minutes');
  });

  it('should handle alert updates', () => {
    let alertCallback: (alerts: any[]) => void;
    (mockEmergencyService.subscribeToAlerts as jest.Mock).mockImplementation(cb => {
      alertCallback = cb;
      return () => {};
    });

    render(<EmergencyMonitor />);
    fireEvent.click(screen.getByTestId('emergency-monitor-toggle'));

    // Simulate new alert
    const newAlerts = [
      {
        id: '3',
        message: 'New emergency alert',
        severity: EmergencySeverity.CRITICAL,
        timestamp: new Date().toISOString()
      }
    ];

    act(() => {
      alertCallback(newAlerts);
    });

    expect(screen.getByTestId('alert-3')).toHaveTextContent('New emergency alert');
  });

  it('should display emergency contact', () => {
    render(<EmergencyMonitor />);
    fireEvent.click(screen.getByTestId('emergency-monitor-toggle'));

    const contactButton = screen.getByTestId('emergency-contact-button');
    expect(contactButton).toHaveAttribute('href', 'tel:1300 309 361');
    expect(contactButton).toHaveTextContent('1300 309 361');
  });

  it('should handle critical alerts with appropriate styling', () => {
    render(<EmergencyMonitor />);
    fireEvent.click(screen.getByTestId('emergency-monitor-toggle'));

    const criticalAlert = screen.getByText(EmergencySeverity.CRITICAL);
    expect(criticalAlert).toHaveClass('bg-red-500');
  });

  it('should maintain proper ARIA attributes', () => {
    render(<EmergencyMonitor />);
    const toggleButton = screen.getByTestId('emergency-monitor-toggle');
    
    // Initial state
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    expect(toggleButton).toHaveAttribute('aria-controls', 'emergency-stats-panel');
    
    // Open panel
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    
    const panel = screen.getByTestId('emergency-stats-panel');
    expect(panel).toHaveAttribute('role', 'region');
    expect(panel).toHaveAttribute('aria-label', 'Emergency status');
  });

  it('should handle initialization errors gracefully', () => {
    (mockEmergencyService.getCurrentAlerts as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Failed to get alerts');
    });

    render(<EmergencyMonitor />);
    expect(screen.queryByTestId('emergency-monitor')).not.toBeInTheDocument();
  });

  it('should cleanup alert subscription on unmount', () => {
    const unsubscribe = jest.fn();
    (mockEmergencyService.subscribeToAlerts as jest.Mock).mockReturnValue(unsubscribe);

    const { unmount } = render(<EmergencyMonitor />);
    unmount();
    
    expect(unsubscribe).toHaveBeenCalled();
  });

  it('should display empty state when no alerts', () => {
    (mockEmergencyService.getCurrentAlerts as jest.Mock).mockReturnValueOnce([]);
    render(<EmergencyMonitor />);
    fireEvent.click(screen.getByTestId('emergency-monitor-toggle'));

    expect(screen.getByText('No active alerts')).toBeInTheDocument();
  });

  it('should handle different severity levels with appropriate styling', () => {
    const alerts = [
      { id: '1', severity: EmergencySeverity.CRITICAL, message: 'Critical alert' },
      { id: '2', severity: EmergencySeverity.HIGH, message: 'High alert' },
      { id: '3', severity: EmergencySeverity.MEDIUM, message: 'Medium alert' },
      { id: '4', severity: EmergencySeverity.LOW, message: 'Low alert' }
    ];

    (mockEmergencyService.getCurrentAlerts as jest.Mock).mockReturnValueOnce(alerts);
    render(<EmergencyMonitor />);
    fireEvent.click(screen.getByTestId('emergency-monitor-toggle'));

    expect(screen.getByText(EmergencySeverity.CRITICAL)).toHaveClass('bg-red-500');
    expect(screen.getByText(EmergencySeverity.HIGH)).toHaveClass('bg-orange-500');
    expect(screen.getByText(EmergencySeverity.MEDIUM)).toHaveClass('bg-yellow-500');
    expect(screen.getByText(EmergencySeverity.LOW)).toHaveClass('bg-blue-500');
  });

  it('should handle inactive service areas', () => {
    const areasWithInactive = [
      { name: 'Brisbane', isActive: true, responseTime: '30-60 minutes' },
      { name: 'Gold Coast', isActive: false, responseTime: '30-60 minutes' }
    ];

    (mockEmergencyService.getServiceAreas as jest.Mock).mockReturnValueOnce(areasWithInactive);
    render(<EmergencyMonitor />);
    fireEvent.click(screen.getByTestId('emergency-monitor-toggle'));

    const brisbaneArea = screen.getByTestId('service-area-brisbane');
    const goldCoastArea = screen.getByTestId('service-area-gold-coast');

    expect(brisbaneArea.querySelector('.bg-green-500')).toBeInTheDocument();
    expect(goldCoastArea.querySelector('.bg-gray-300')).toBeInTheDocument();
  });
});
