import { render, screen, fireEvent, act } from '@testing-library/react';
import AuthMonitor from '../AuthMonitor';
import { AuthService } from '../../services/core/AuthService';
import { UserRole, AuthEventType } from '../../services/types/IAuthService';

// Mock AuthService
jest.mock('../../services/core/AuthService', () => {
  const mockUser = {
    id: '123',
    email: 'test@example.com',
    role: 'ADMIN' as UserRole,
    permissions: ['read', 'write'],
    lastLogin: new Date('2024-01-01T10:00:00').toISOString()
  };

  const mockAuthService = {
    getCurrentUser: jest.fn().mockResolvedValue(mockUser),
    getAccessToken: jest.fn().mockReturnValue('mock.jwt.token'),
    isAuthenticated: jest.fn().mockReturnValue(true),
    logout: jest.fn(),
    onAuthStateChanged: jest.fn(),
    getInstance: jest.fn()
  };

  return {
    AuthService: {
      getInstance: () => mockAuthService
    }
  };
});

describe('AuthMonitor', () => {
  const mockAuthService = AuthService.getInstance();
  const originalEnv = process.env.NODE_ENV;
  
  // Mock JWT token with expiry
  const mockJwtToken = `header.${btoa(JSON.stringify({
    exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
  }))}.signature`;

  beforeEach(() => {
    jest.clearAllMocks();
    (mockAuthService.getAccessToken as jest.Mock).mockReturnValue(mockJwtToken);
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it('should render auth monitor button', async () => {
    await act(async () => {
      render(<AuthMonitor />);
    });
    expect(screen.getByTestId('auth-monitor-toggle')).toBeInTheDocument();
  });

  it('should not render in production mode', async () => {
    process.env.NODE_ENV = 'production';
    await act(async () => {
      render(<AuthMonitor />);
    });
    expect(screen.queryByTestId('auth-monitor')).not.toBeInTheDocument();
  });

  it('should toggle stats panel visibility', async () => {
    await act(async () => {
      render(<AuthMonitor />);
    });
    
    // Initially hidden
    expect(screen.queryByTestId('auth-stats-panel')).not.toBeInTheDocument();
    
    // Show panel
    fireEvent.click(screen.getByTestId('auth-monitor-toggle'));
    expect(screen.getByTestId('auth-stats-panel')).toBeInTheDocument();
    
    // Hide panel
    fireEvent.click(screen.getByTestId('auth-monitor-toggle'));
    expect(screen.queryByTestId('auth-stats-panel')).not.toBeInTheDocument();
  });

  it('should display authentication status', async () => {
    await act(async () => {
      render(<AuthMonitor />);
    });
    fireEvent.click(screen.getByTestId('auth-monitor-toggle'));

    expect(screen.getByText('Authenticated')).toBeInTheDocument();
    
    // Test unauthenticated state
    (mockAuthService.isAuthenticated as jest.Mock).mockReturnValue(false);
    await act(async () => {
      render(<AuthMonitor />);
    });
    fireEvent.click(screen.getByTestId('auth-monitor-toggle'));
    expect(screen.getByText('Not Authenticated')).toBeInTheDocument();
  });

  it('should display user information', async () => {
    await act(async () => {
      render(<AuthMonitor />);
    });
    fireEvent.click(screen.getByTestId('auth-monitor-toggle'));

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('ADMIN')).toBeInTheDocument();
    expect(screen.getByText(/Jan 1, 2024/)).toBeInTheDocument();
  });

  it('should display session expiry', async () => {
    await act(async () => {
      render(<AuthMonitor />);
    });
    fireEvent.click(screen.getByTestId('auth-monitor-toggle'));

    expect(screen.getByText(/Expires:/)).toBeInTheDocument();
  });

  it('should handle auth state changes', async () => {
    let authStateCallback: (user: any) => void;
    (mockAuthService.onAuthStateChanged as jest.Mock).mockImplementation(cb => {
      authStateCallback = cb;
      return () => {};
    });

    await act(async () => {
      render(<AuthMonitor />);
    });
    fireEvent.click(screen.getByTestId('auth-monitor-toggle'));

    // Simulate sign out
    await act(async () => {
      authStateCallback(null);
    });

    expect(screen.getByText('Not Authenticated')).toBeInTheDocument();
    expect(screen.queryByText('test@example.com')).not.toBeInTheDocument();
  });

  it('should handle sign out', async () => {
    await act(async () => {
      render(<AuthMonitor />);
    });
    fireEvent.click(screen.getByTestId('auth-monitor-toggle'));

    const signOutButton = screen.getByTestId('sign-out-button');
    await act(async () => {
      fireEvent.click(signOutButton);
    });

    expect(mockAuthService.logout).toHaveBeenCalled();
  });

  it('should maintain proper ARIA attributes', async () => {
    await act(async () => {
      render(<AuthMonitor />);
    });
    const toggleButton = screen.getByTestId('auth-monitor-toggle');
    
    // Initial state
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    expect(toggleButton).toHaveAttribute('aria-controls', 'auth-stats-panel');
    
    // Open panel
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    
    const panel = screen.getByTestId('auth-stats-panel');
    expect(panel).toHaveAttribute('role', 'region');
    expect(panel).toHaveAttribute('aria-label', 'Authentication status');
  });

  it('should handle initialization errors gracefully', async () => {
    (mockAuthService.getCurrentUser as jest.Mock).mockRejectedValueOnce(
      new Error('Failed to get user')
    );

    await act(async () => {
      render(<AuthMonitor />);
    });

    expect(screen.queryByTestId('auth-monitor')).not.toBeInTheDocument();
  });

  it('should cleanup auth subscription on unmount', async () => {
    const unsubscribe = jest.fn();
    (mockAuthService.onAuthStateChanged as jest.Mock).mockReturnValue(unsubscribe);

    const { unmount } = render(<AuthMonitor />);
    
    unmount();
    expect(unsubscribe).toHaveBeenCalled();
  });

  it('should track auth events', async () => {
    let authStateCallback: (user: any) => void;
    (mockAuthService.onAuthStateChanged as jest.Mock).mockImplementation(cb => {
      authStateCallback = cb;
      return () => {};
    });

    await act(async () => {
      render(<AuthMonitor />);
    });
    fireEvent.click(screen.getByTestId('auth-monitor-toggle'));

    // Simulate auth event
    const mockUser = {
      id: '123',
      email: 'new@example.com',
      role: UserRole.USER
    };

    await act(async () => {
      authStateCallback(mockUser);
    });

    expect(screen.getByText(AuthEventType.SIGNED_IN)).toBeInTheDocument();
    expect(screen.getByText('new@example.com')).toBeInTheDocument();
  });

  it('should handle different user roles with appropriate styling', async () => {
    const roles = [UserRole.ADMIN, UserRole.STAFF, UserRole.USER];
    
    for (const role of roles) {
      (mockAuthService.getCurrentUser as jest.Mock).mockResolvedValueOnce({
        ...mockAuthService.getCurrentUser(),
        role
      });

      await act(async () => {
        const { rerender } = render(<AuthMonitor />);
        rerender(<AuthMonitor />);
      });
      
      fireEvent.click(screen.getByTestId('auth-monitor-toggle'));
      const roleElement = screen.getByText(role);
      
      // Verify role-specific styling
      const parent = roleElement.parentElement;
      expect(parent).toHaveClass(
        role === UserRole.ADMIN ? 'bg-red-500' :
        role === UserRole.STAFF ? 'bg-blue-500' :
        'bg-green-500'
      );
    }
  });
});
