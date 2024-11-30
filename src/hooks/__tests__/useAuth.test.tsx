import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth';
import { AuthService } from '@/services/core/AuthService';
import { UserRole, AUTH_ERRORS } from '@/services/types/IAuthService';

// Mock AuthService
jest.mock('@/services/core/AuthService', () => {
  const mockAuthService = {
    getCurrentUser: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    updateUserProfile: jest.fn(),
    hasPermission: jest.fn(),
    hasRole: jest.fn(),
    getAccessToken: jest.fn(),
    onAuthStateChanged: jest.fn(),
    getInstance: jest.fn()
  };
  return {
    AuthService: {
      getInstance: () => mockAuthService
    }
  };
});

describe('useAuth', () => {
  const mockAuthService = AuthService.getInstance();
  
  const mockUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    role: UserRole.USER,
    permissions: ['read:data'],
    lastLogin: new Date()
  };

  const mockTokens = {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    expiresIn: 3600
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (mockAuthService.getCurrentUser as jest.Mock).mockResolvedValue(null);
    (mockAuthService.onAuthStateChanged as jest.Mock).mockImplementation(() => () => {});
  });

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should load current user on mount', async () => {
    (mockAuthService.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth());

    // Wait for initial load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should handle login successfully', async () => {
    (mockAuthService.login as jest.Mock).mockResolvedValue(mockTokens);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password'
      });
    });

    expect(mockAuthService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password'
    });
  });

  it('should handle login failure', async () => {
    const error = new Error('Invalid credentials');
    (mockAuthService.login as jest.Mock).mockRejectedValue(error);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      try {
        await result.current.login({
          email: 'test@example.com',
          password: 'wrong-password'
        });
      } catch {}
    });

    expect(result.current.error).toEqual(error);
    expect(result.current.loading).toBe(false);
  });

  it('should handle logout', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.logout();
    });

    expect(mockAuthService.logout).toHaveBeenCalled();
  });

  it('should update user profile', async () => {
    const updatedUser = { ...mockUser, name: 'Updated Name' };
    (mockAuthService.updateUserProfile as jest.Mock).mockResolvedValue(updatedUser);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.updateProfile({ name: 'Updated Name' });
    });

    expect(mockAuthService.updateUserProfile).toHaveBeenCalledWith({
      name: 'Updated Name'
    });
    expect(result.current.user).toEqual(updatedUser);
  });

  it('should check permissions', async () => {
    (mockAuthService.hasPermission as jest.Mock).mockReturnValue(true);

    const { result } = renderHook(() => useAuth());

    expect(result.current.hasPermission('read:data')).toBe(true);
    expect(mockAuthService.hasPermission).toHaveBeenCalledWith('read:data');
  });

  it('should check roles', async () => {
    (mockAuthService.hasRole as jest.Mock).mockReturnValue(true);

    const { result } = renderHook(() => useAuth());

    expect(result.current.hasRole(UserRole.USER)).toBe(true);
    expect(mockAuthService.hasRole).toHaveBeenCalledWith(UserRole.USER);
  });

  it('should get access token', async () => {
    (mockAuthService.getAccessToken as jest.Mock).mockReturnValue(mockTokens.accessToken);

    const { result } = renderHook(() => useAuth());

    expect(result.current.getAccessToken()).toBe(mockTokens.accessToken);
    expect(mockAuthService.getAccessToken).toHaveBeenCalled();
  });

  it('should handle auth state changes', async () => {
    let authStateCallback: (user: typeof mockUser | null) => void;
    (mockAuthService.onAuthStateChanged as jest.Mock).mockImplementation(cb => {
      authStateCallback = cb;
      return () => {};
    });

    const { result } = renderHook(() => useAuth());

    // Simulate auth state change
    act(() => {
      authStateCallback(mockUser);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should cleanup auth state listener on unmount', () => {
    const unsubscribe = jest.fn();
    (mockAuthService.onAuthStateChanged as jest.Mock).mockReturnValue(unsubscribe);

    const { unmount } = renderHook(() => useAuth());
    unmount();

    expect(unsubscribe).toHaveBeenCalled();
  });

  it('should handle errors in auth state changes', async () => {
    let authStateCallback: (user: typeof mockUser | null) => void;
    (mockAuthService.onAuthStateChanged as jest.Mock).mockImplementation(cb => {
      authStateCallback = cb;
      return () => {};
    });

    const { result } = renderHook(() => useAuth());

    // Simulate error in auth state change
    act(() => {
      authStateCallback(null);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});
