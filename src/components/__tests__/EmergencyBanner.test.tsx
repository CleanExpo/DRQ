import { render, screen, fireEvent, act } from '@testing-library/react';
import EmergencyBanner from '../EmergencyBanner';
import { useEmergency } from '../../hooks/useEmergency';
import { EmergencySeverity } from '../../services/types/IEmergencyService';

// Mock useEmergency hook
jest.mock('../../hooks/useEmergency');

describe('EmergencyBanner', () => {
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
      contactNumber: '1300 309 361'
    }
  ];

  const mockEmergencyContact = '1300 309 361';

  beforeEach(() => {
    jest.clearAllMocks();
    (useEmergency as jest.Mock).mockReturnValue({
      alerts: mockAlerts,
      hasCritical: true,
      emergencyContact: mockEmergencyContact,
      loading: false,
      error: null
    });
  });

  it('should render loading state', () => {
    (useEmergency as jest.Mock).mockReturnValue({
      loading: true,
      alerts: [],
      hasCritical: false,
      emergencyContact: ''
    });

    render(<EmergencyBanner />);
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it('should render nothing when there are no alerts', () => {
    (useEmergency as jest.Mock).mockReturnValue({
      alerts: [],
      hasCritical: false,
      emergencyContact: mockEmergencyContact,
      loading: false,
      error: null
    });

    const { container } = render(<EmergencyBanner />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should render current alert message', () => {
    render(<EmergencyBanner />);
    const alertMessage = screen.getByTestId('alert-message');
    expect(alertMessage).toHaveTextContent(mockAlerts[0].message);
  });

  it('should render emergency contact number', () => {
    render(<EmergencyBanner />);
    const contactNumber = screen.getByTestId('contact-number');
    expect(contactNumber).toHaveTextContent(mockEmergencyContact);
    expect(contactNumber).toHaveAttribute('href', `tel:${mockEmergencyContact}`);
  });

  it('should toggle expanded view', () => {
    render(<EmergencyBanner />);
    
    // Initially expanded due to critical alert
    expect(screen.getByTestId('expanded-content')).toBeInTheDocument();

    // Click to collapse
    fireEvent.click(screen.getByTestId('toggle-expand'));
    expect(screen.queryByTestId('expanded-content')).not.toBeInTheDocument();

    // Click to expand
    fireEvent.click(screen.getByTestId('toggle-expand'));
    expect(screen.getByTestId('expanded-content')).toBeInTheDocument();
  });

  it('should display alert location when available', () => {
    render(<EmergencyBanner />);
    const location = screen.getByTestId('alert-location');
    expect(location).toHaveTextContent(mockAlerts[0].location);
  });

  it('should display alert timestamp', () => {
    render(<EmergencyBanner />);
    const timestamp = screen.getByTestId('alert-timestamp');
    expect(timestamp).toHaveTextContent(
      `Posted: ${new Date(mockAlerts[0].timestamp).toLocaleString()}`
    );
  });

  it('should rotate through alerts automatically', () => {
    jest.useFakeTimers();
    render(<EmergencyBanner />);

    // Initially shows first alert
    expect(screen.getByTestId('alert-message')).toHaveTextContent(mockAlerts[0].message);

    // Advance timers
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    // Should show second alert
    expect(screen.getByTestId('alert-message')).toHaveTextContent(mockAlerts[1].message);

    jest.useRealTimers();
  });

  it('should allow manual navigation between alerts', () => {
    render(<EmergencyBanner />);

    // Initially shows first alert
    expect(screen.getByTestId('alert-message')).toHaveTextContent(mockAlerts[0].message);

    // Click second alert indicator
    fireEvent.click(screen.getByTestId('alert-indicator-1'));

    // Should show second alert
    expect(screen.getByTestId('alert-message')).toHaveTextContent(mockAlerts[1].message);
  });

  it('should apply correct severity styles', () => {
    render(<EmergencyBanner />);
    
    const banner = screen.getByTestId('emergency-banner');
    expect(banner.className).toContain('bg-red-600'); // Critical severity style

    // Test other severity styles
    const severities = [
      { severity: EmergencySeverity.HIGH, className: 'bg-orange-500' },
      { severity: EmergencySeverity.MEDIUM, className: 'bg-yellow-500' },
      { severity: EmergencySeverity.LOW, className: 'bg-blue-500' }
    ];

    severities.forEach(({ severity, className }) => {
      (useEmergency as jest.Mock).mockReturnValue({
        alerts: [{ ...mockAlerts[0], severity }],
        hasCritical: false,
        emergencyContact: mockEmergencyContact,
        loading: false,
        error: null
      });

      const { rerender } = render(<EmergencyBanner />);
      const updatedBanner = screen.getByTestId('emergency-banner');
      expect(updatedBanner.className).toContain(className);
      rerender(<></>);
    });
  });

  it('should render emergency call button in expanded view', () => {
    render(<EmergencyBanner />);
    
    const callButton = screen.getByTestId('emergency-call-button');
    expect(callButton).toBeInTheDocument();
    expect(callButton).toHaveAttribute('href', `tel:${mockEmergencyContact}`);
    expect(callButton).toHaveTextContent('Call Emergency Response');
  });

  it('should handle errors gracefully', () => {
    (useEmergency as jest.Mock).mockReturnValue({
      alerts: [],
      hasCritical: false,
      emergencyContact: '',
      loading: false,
      error: new Error('Test error')
    });

    const { container } = render(<EmergencyBanner />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should cleanup interval on unmount', () => {
    jest.useFakeTimers();
    const { unmount } = render(<EmergencyBanner />);
    
    const clearIntervalSpy = jest.spyOn(window, 'clearInterval');
    unmount();
    
    expect(clearIntervalSpy).toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('should not start rotation interval with single alert', () => {
    jest.useFakeTimers();
    (useEmergency as jest.Mock).mockReturnValue({
      alerts: [mockAlerts[0]],
      hasCritical: true,
      emergencyContact: mockEmergencyContact,
      loading: false,
      error: null
    });

    render(<EmergencyBanner />);
    const setIntervalSpy = jest.spyOn(window, 'setInterval');
    
    expect(setIntervalSpy).not.toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('should maintain expanded state when alerts change', () => {
    const { rerender } = render(<EmergencyBanner />);
    
    // Initially expanded due to critical alert
    expect(screen.getByTestId('expanded-content')).toBeInTheDocument();

    // Update alerts to non-critical
    (useEmergency as jest.Mock).mockReturnValue({
      alerts: [{ ...mockAlerts[0], severity: EmergencySeverity.LOW }],
      hasCritical: false,
      emergencyContact: mockEmergencyContact,
      loading: false,
      error: null
    });

    rerender(<EmergencyBanner />);
    
    // Should maintain expanded state
    expect(screen.getByTestId('expanded-content')).toBeInTheDocument();
  });
});
