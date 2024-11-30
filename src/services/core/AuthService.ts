import { BaseService, RegisterService, ServiceStatus } from '../types/IService';
import {
  IAuthService,
  AuthCredentials,
  AuthTokens,
  IUser,
  UserRole,
  AuthError,
  AUTH_ERRORS,
  AuthEventType,
  AuthEvent
} from '../types/IAuthService';
import { CacheService } from './CacheService';
import { logger } from '@/utils/logger';

const AUTH_CACHE_NAMESPACE = 'auth';
const TOKEN_CACHE_KEY = 'tokens';
const USER_CACHE_KEY = 'user';

type AuthEventCallback = (event: AuthEvent) => void;

@RegisterService({
  name: 'AuthService',
  dependencies: ['CacheService']
})
export class AuthService extends BaseService implements IAuthService {
  private static instance: AuthService;
  private cacheService: CacheService;
  private currentUser: IUser | null = null;
  private tokens: AuthTokens | null = null;
  private refreshTokenTimeout?: NodeJS.Timeout;
  private eventListeners: Set<AuthEventCallback> = new Set();

  private constructor() {
    super('AuthService');
    this.cacheService = CacheService.getInstance();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  protected async onInitialize(): Promise<void> {
    try {
      // Restore auth state from cache
      await this.restoreAuthState();
      
      // Set up token refresh if we have a valid session
      if (this.tokens) {
        this.setupTokenRefresh();
      }
    } catch (error) {
      logger.error('Failed to initialize AuthService:', error);
      throw error;
    }
  }

  protected async onDispose(): Promise<void> {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }
    this.eventListeners.clear();
    await this.clearAuthState();
  }

  public async login(credentials: AuthCredentials): Promise<AuthTokens> {
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        throw this.createAuthError(AUTH_ERRORS.INVALID_CREDENTIALS);
      }

      const { tokens, user } = await response.json();

      await this.handleAuthSuccess(tokens, user);
      return tokens;
    } catch (error) {
      logger.error('Login failed:', error);
      throw this.handleAuthError(error);
    }
  }

  public async logout(): Promise<void> {
    try {
      if (this.tokens) {
        // TODO: Replace with actual API call
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.tokens.accessToken}`
          }
        });
      }

      await this.clearAuthState();
      this.emitAuthEvent(AuthEventType.SIGNED_OUT);
    } catch (error) {
      logger.error('Logout failed:', error);
      // Clear state anyway to prevent being stuck in invalid state
      await this.clearAuthState();
      throw this.handleAuthError(error);
    }
  }

  public async refreshToken(token: string): Promise<AuthTokens> {
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: token })
      });

      if (!response.ok) {
        throw this.createAuthError(AUTH_ERRORS.INVALID_TOKEN);
      }

      const tokens = await response.json();
      await this.handleTokenRefresh(tokens);
      return tokens;
    } catch (error) {
      logger.error('Token refresh failed:', error);
      await this.clearAuthState();
      throw this.handleAuthError(error);
    }
  }

  public async getCurrentUser(): Promise<IUser | null> {
    if (!this.isAuthenticated()) {
      return null;
    }

    try {
      if (!this.currentUser) {
        // TODO: Replace with actual API call
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${this.tokens?.accessToken}`
          }
        });

        if (!response.ok) {
          throw this.createAuthError(AUTH_ERRORS.USER_NOT_FOUND);
        }

        this.currentUser = await response.json();
        await this.cacheService.set(USER_CACHE_KEY, this.currentUser, {
          namespace: AUTH_CACHE_NAMESPACE
        });
      }

      return this.currentUser;
    } catch (error) {
      logger.error('Failed to get current user:', error);
      throw this.handleAuthError(error);
    }
  }

  public async updateUserProfile(data: Partial<IUser>): Promise<IUser> {
    if (!this.isAuthenticated()) {
      throw this.createAuthError(AUTH_ERRORS.INVALID_TOKEN);
    }

    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.tokens?.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw this.createAuthError(AUTH_ERRORS.NETWORK_ERROR);
      }

      const updatedUser = await response.json();
      this.currentUser = updatedUser;
      
      await this.cacheService.set(USER_CACHE_KEY, updatedUser, {
        namespace: AUTH_CACHE_NAMESPACE
      });

      this.emitAuthEvent(AuthEventType.PROFILE_UPDATED, updatedUser);
      return updatedUser;
    } catch (error) {
      logger.error('Failed to update user profile:', error);
      throw this.handleAuthError(error);
    }
  }

  public isAuthenticated(): boolean {
    return !!this.tokens?.accessToken && !this.isTokenExpired();
  }

  public getAccessToken(): string | null {
    return this.tokens?.accessToken ?? null;
  }

  public hasPermission(permission: string): boolean {
    return this.currentUser?.permissions.includes(permission) ?? false;
  }

  public hasRole(role: UserRole): boolean {
    return this.currentUser?.role === role;
  }

  public onAuthStateChanged(callback: (user: IUser | null) => void): () => void {
    const wrappedCallback = (event: AuthEvent) => {
      if (event.type === AuthEventType.SIGNED_IN || 
          event.type === AuthEventType.SIGNED_OUT) {
        callback(event.user ?? null);
      }
    };

    this.eventListeners.add(wrappedCallback);
    return () => this.eventListeners.delete(wrappedCallback);
  }

  public onTokenExpired(callback: () => void): () => void {
    const wrappedCallback = (event: AuthEvent) => {
      if (event.type === AuthEventType.ERROR && 
          event.error?.code === AUTH_ERRORS.TOKEN_EXPIRED) {
        callback();
      }
    };

    this.eventListeners.add(wrappedCallback);
    return () => this.eventListeners.delete(wrappedCallback);
  }

  private async handleAuthSuccess(tokens: AuthTokens, user: IUser): Promise<void> {
    this.tokens = tokens;
    this.currentUser = user;

    await Promise.all([
      this.cacheService.set(TOKEN_CACHE_KEY, tokens, {
        namespace: AUTH_CACHE_NAMESPACE
      }),
      this.cacheService.set(USER_CACHE_KEY, user, {
        namespace: AUTH_CACHE_NAMESPACE
      })
    ]);

    this.setupTokenRefresh();
    this.emitAuthEvent(AuthEventType.SIGNED_IN, user);
  }

  private async handleTokenRefresh(tokens: AuthTokens): Promise<void> {
    this.tokens = tokens;
    await this.cacheService.set(TOKEN_CACHE_KEY, tokens, {
      namespace: AUTH_CACHE_NAMESPACE
    });

    this.setupTokenRefresh();
    this.emitAuthEvent(AuthEventType.TOKEN_REFRESHED);
  }

  private async clearAuthState(): Promise<void> {
    this.tokens = null;
    this.currentUser = null;
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }

    await this.cacheService.clear(AUTH_CACHE_NAMESPACE);
  }

  private async restoreAuthState(): Promise<void> {
    const [cachedTokens, cachedUser] = await Promise.all([
      this.cacheService.get<AuthTokens>(TOKEN_CACHE_KEY, AUTH_CACHE_NAMESPACE),
      this.cacheService.get<IUser>(USER_CACHE_KEY, AUTH_CACHE_NAMESPACE)
    ]);

    if (cachedTokens && !this.isTokenExpired(cachedTokens)) {
      this.tokens = cachedTokens;
      this.currentUser = cachedUser;
      this.emitAuthEvent(AuthEventType.SIGNED_IN, cachedUser);
    } else {
      await this.clearAuthState();
    }
  }

  private setupTokenRefresh(): void {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }

    if (!this.tokens) return;

    const buffer = 60000; // 1 minute before expiry
    const timeout = (this.tokens.expiresIn * 1000) - buffer;

    this.refreshTokenTimeout = setTimeout(async () => {
      try {
        if (this.tokens?.refreshToken) {
          await this.refreshToken(this.tokens.refreshToken);
        }
      } catch (error) {
        this.emitAuthEvent(AuthEventType.ERROR, null, error as AuthError);
      }
    }, timeout);
  }

  private isTokenExpired(tokens = this.tokens): boolean {
    if (!tokens) return true;
    return Date.now() >= tokens.expiresIn * 1000;
  }

  private createAuthError(code: string, message?: string): AuthError {
    const error = new Error(message || `Authentication error: ${code}`) as AuthError;
    error.code = code;
    return error;
  }

  private handleAuthError(error: any): AuthError {
    if (error.code && Object.values(AUTH_ERRORS).includes(error.code)) {
      return error as AuthError;
    }
    return this.createAuthError(
      AUTH_ERRORS.NETWORK_ERROR,
      error.message || 'An unexpected authentication error occurred'
    );
  }

  private emitAuthEvent(
    type: AuthEventType,
    user: IUser | null = null,
    error?: AuthError
  ): void {
    const event: AuthEvent = {
      type,
      user: user || this.currentUser,
      error,
      timestamp: Date.now()
    };

    this.eventListeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        logger.error('Error in auth event listener:', error);
      }
    });
  }
}
