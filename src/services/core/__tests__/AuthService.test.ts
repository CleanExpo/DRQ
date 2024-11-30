import { AuthService } from '../AuthService';
import { CacheService } from '../CacheService';
import { ServiceStatus } from '../../types/IService';
import {
  UserRole,
  AuthEventType,
  AUTH_ERRORS
} from '../../types/IAuthService';

// Mock CacheService
jest.mock('../CacheService', () => {
  const mockCacheService = {
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
    clear: jest.fn(),
    getInstance: jest.fn()
  };
  return {
    CacheService: {
      getInstance: () => mockCacheService
    }
  };
});

// Mock fetch
global.fetch = jest.fn();

describe('AuthService', () => {
  let authService: AuthService;
  const mockCacheService = CacheService.getInstance();
  
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

  beforeEach(async () => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockReset();
    
    authService = AuthService.getInstance();
    await authService.initialize();
  });

  afterEach(async () => {
    await authService.dispose();
    jest.clearAllTimers();
  });

  describe('Initialization', () => {
    it('should be a singleton', () => {
      const instance1 = AuthService.getInstance();
      const instance2 = AuthService.getInstance();
      expect(instance1).toBe(instance2);
    });

    it('should initialize with correct status', () => {
      expect(authService.getStatus()).toBe(ServiceStatus.READY);
      expect(authService.isInitialized()).toBe(true);
    });

    it('should restore auth state from cache on initialization', async () => {
      (mockCacheService.get as jest.Mock)
        .mockResolvedValueOnce(mockTokens)
        .mockResolvedValueOnce(mockUser);

      const service = AuthService.getInstance();
      await service.initialize();

      expect(mockCacheService.get).toHaveBeenCalledTimes(2);
      expect(service.isAuthenticated()).toBe(true);
    });
  });

  describe('Authentication', () => {
    it('should handle login successfully', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password'
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ tokens: mockTokens, user: mockUser })
      });

      const tokens = await authService.login(credentials);

      expect(tokens).toEqual(mockTokens);
      expect(mockCacheService.set).toHaveBeenCalledTimes(2);
      expect(authService.isAuthenticated()).toBe(true);
    });

    it('should handle login failure', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'wrong-password'
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false
      });

      await expect(authService.login(credentials))
        .rejects.toThrow(AUTH_ERRORS.INVALID_CREDENTIALS);
    });

    it('should handle logout', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true
      });

      await authService.logout();

      expect(mockCacheService.clear).toHaveBeenCalled();
      expect(authService.isAuthenticated()).toBe(false);
    });
  });

  describe('Token Management', () => {
    it('should refresh token successfully', async () => {
      const newTokens = {
        ...mockTokens,
        accessToken: 'new-access-token'
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(newTokens)
      });

      const tokens = await authService.refreshToken(mockTokens.refreshToken);

      expect(tokens).toEqual(newTokens);
      expect(mockCacheService.set).toHaveBeenCalled();
    });

    it('should handle token refresh failure', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false
      });

      await expect(authService.refreshToken('invalid-token'))
        .rejects.toThrow(AUTH_ERRORS.INVALID_TOKEN);
    });
  });

  describe('User Management', () => {
    it('should get current user', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockUser)
      });

      // Set up authenticated state
      await authService['handleAuthSuccess'](mockTokens, mockUser);

      const user = await authService.getCurrentUser();
      expect(user).toEqual(mockUser);
    });

    it('should update user profile', async () => {
      const updatedUser = {
        ...mockUser,
        name: 'Updated Name'
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(updatedUser)
      });

      // Set up authenticated state
      await authService['handleAuthSuccess'](mockTokens, mockUser);

      const result = await authService.updateUserProfile({ name: 'Updated Name' });
      expect(result).toEqual(updatedUser);
      expect(mockCacheService.set).toHaveBeenCalled();
    });
  });

  describe('Permission and Role Checks', () => {
    beforeEach(async () => {
      await authService['handleAuthSuccess'](mockTokens, mockUser);
    });

    it('should check permissions correctly', () => {
      expect(authService.hasPermission('read:data')).toBe(true);
      expect(authService.hasPermission('write:data')).toBe(false);
    });

    it('should check roles correctly', () => {
      expect(authService.hasRole(UserRole.USER)).toBe(true);
      expect(authService.hasRole(UserRole.ADMIN)).toBe(false);
    });
  });

  describe('Event Handling', () => {
    it('should notify listeners of auth state changes', async () => {
      const listener = jest.fn();
      authService.onAuthStateChanged(listener);

      await authService['handleAuthSuccess'](mockTokens, mockUser);

      expect(listener).toHaveBeenCalledWith(mockUser);
    });

    it('should notify listeners of token expiry', () => {
      const listener = jest.fn();
      authService.onTokenExpired(listener);

      authService['emitAuthEvent'](
        AuthEventType.ERROR,
        null,
        { code: AUTH_ERRORS.TOKEN_EXPIRED } as any
      );

      expect(listener).toHaveBeenCalled();
    });
  });
});
