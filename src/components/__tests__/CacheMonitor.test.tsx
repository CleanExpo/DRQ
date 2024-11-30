import { render, screen, fireEvent, act } from '@testing-library/react';
import CacheMonitor from '../CacheMonitor';
import { CacheService } from '../../services/core/CacheService';
import { ServiceStatus } from '../../services/types/IService';

// Mock CacheService
jest.mock('../../services/core/CacheService', () => {
  const mockStats = {
    size: 5,
    namespaces: {
      'auth': 2,
      'emergency': 3
    },
    status: 'READY'
  };

  const mockCacheService = {
    getStats: jest.fn().mockReturnValue(mockStats),
    clear: jest.fn(),
    getInstance: jest.fn()
  };

  return {
    CacheService: {
      getInstance: () => mockCacheService
    }
  };
});

describe('CacheMonitor', () => {
  const mockCacheService = CacheService.getInstance();
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    process.env.NODE_ENV = originalEnv;
  });

  it('should render cache monitor button', () => {
    render(<CacheMonitor />);
    expect(screen.getByTestId('cache-monitor-toggle')).toBeInTheDocument();
  });

  it('should not render in production mode', () => {
    process.env.NODE_ENV = 'production';
    render(<CacheMonitor />);
    expect(screen.queryByTestId('cache-monitor')).not.toBeInTheDocument();
  });

  it('should toggle stats panel visibility', () => {
    render(<CacheMonitor />);
    
    // Initially hidden
    expect(screen.queryByTestId('cache-stats-panel')).not.toBeInTheDocument();
    
    // Show panel
    fireEvent.click(screen.getByTestId('cache-monitor-toggle'));
    expect(screen.getByTestId('cache-stats-panel')).toBeInTheDocument();
    
    // Hide panel
    fireEvent.click(screen.getByTestId('cache-monitor-toggle'));
    expect(screen.queryByTestId('cache-stats-panel')).not.toBeInTheDocument();
  });

  it('should display cache statistics', () => {
    render(<CacheMonitor />);
    fireEvent.click(screen.getByTestId('cache-monitor-toggle'));

    expect(screen.getByText('Total Items')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    
    expect(screen.getByTestId('namespace-auth')).toHaveTextContent('auth2');
    expect(screen.getByTestId('namespace-emergency')).toHaveTextContent('emergency3');
  });

  it('should update stats periodically', () => {
    render(<CacheMonitor />);
    
    expect(mockCacheService.getStats).toHaveBeenCalledTimes(1);
    
    // Fast forward 5 seconds
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    
    expect(mockCacheService.getStats).toHaveBeenCalledTimes(2);
  });

  it('should clear cache when clear button is clicked', async () => {
    render(<CacheMonitor />);
    fireEvent.click(screen.getByTestId('cache-monitor-toggle'));
    
    const clearButton = screen.getByTestId('clear-cache-button');
    await fireEvent.click(clearButton);
    
    expect(mockCacheService.clear).toHaveBeenCalled();
    expect(mockCacheService.getStats).toHaveBeenCalled();
  });

  it('should display empty state when no namespaces exist', () => {
    (mockCacheService.getStats as jest.Mock).mockReturnValueOnce({
      size: 0,
      namespaces: {},
      status: ServiceStatus.READY
    });

    render(<CacheMonitor />);
    fireEvent.click(screen.getByTestId('cache-monitor-toggle'));
    
    expect(screen.getByText('No active namespaces')).toBeInTheDocument();
  });

  it('should maintain proper ARIA attributes', () => {
    render(<CacheMonitor />);
    const toggleButton = screen.getByTestId('cache-monitor-toggle');
    
    // Initial state
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    expect(toggleButton).toHaveAttribute('aria-controls', 'cache-stats-panel');
    
    // Open panel
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    
    const panel = screen.getByTestId('cache-stats-panel');
    expect(panel).toHaveAttribute('role', 'region');
    expect(panel).toHaveAttribute('aria-label', 'Cache statistics');
  });

  it('should cleanup interval on unmount', () => {
    const clearIntervalSpy = jest.spyOn(window, 'clearInterval');
    const { unmount } = render(<CacheMonitor />);
    
    unmount();
    expect(clearIntervalSpy).toHaveBeenCalled();
  });

  it('should handle different cache status states', () => {
    // Test READY state
    (mockCacheService.getStats as jest.Mock).mockReturnValueOnce({
      size: 5,
      namespaces: {},
      status: ServiceStatus.READY
    });

    const { rerender } = render(<CacheMonitor />);
    fireEvent.click(screen.getByTestId('cache-monitor-toggle'));
    expect(screen.getByText('READY')).toBeInTheDocument();

    // Test INITIALIZING state
    (mockCacheService.getStats as jest.Mock).mockReturnValueOnce({
      size: 0,
      namespaces: {},
      status: ServiceStatus.INITIALIZING
    });

    rerender(<CacheMonitor />);
    expect(screen.getByText('INITIALIZING')).toBeInTheDocument();
  });

  it('should handle errors gracefully', () => {
    (mockCacheService.getStats as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Failed to get stats');
    });

    render(<CacheMonitor />);
    expect(screen.queryByTestId('cache-monitor')).not.toBeInTheDocument();
  });
});
