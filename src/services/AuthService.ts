import { logger } from '@/utils/logger';
import { cacheService } from './CacheService';

interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role: 'user' | 'admin' | 'moderator';
  permissions: string[];
  metadata: {
    createdAt: string;
    updatedAt: string;
    lastLogin?: string;
    loginCount: number;
    verified: boolean;
    twoFactorEnabled: boolean;
  };
}

interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

interface AuthSession {
  token: string;
  refreshToken: string;
  expiresAt: number;
  user: UserProfile;
}

interface AuthMetrics {
  totalUsers: number;
  activeUsers: number;
  loginAttempts: number;
  successfulLogins: number;
  failedLogins: number;
  registrations: number;
  lastUpdate: number;
}

class AuthService {
  private static instance: AuthService;
  private currentSession: AuthSession | null = null;
  private metrics: AuthMetrics;
  private observers: ((type: string, data: any) => void)[] = [];
  private refreshTimeout?: NodeJS.Timeout;

  private constructor() {
    this.metrics = this.initializeMetrics();
    this.setupRefreshHandler();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private initializeMetrics(): AuthMetrics {
    return {
      totalUsers: 0,
      activeUsers: 0,
      loginAttempts: 0,
      successfulLogins: 0,
      failedLogins: 0,
      registrations: 0,
      lastUpdate: Date.now()
    };
  }

  private setupRefreshHandler(): void {
    if (typeof window === 'undefined') return;

    // Restore session from storage
    const storedSession = localStorage.getItem('auth_session');
    if (storedSession) {
      try {
        const session = JSON.parse(storedSession);
        if (this.isValidSession(session)) {
          this.currentSession = session;
          this.scheduleTokenRefresh();
        } else {
          this.clearSession();
        }
      } catch (error) {
        this.clearSession();
        logger.error('Failed to restore session', { error });
      }
    }
  }

  private isValidSession(session: any): boolean {
    return (
      session &&
      session.token &&
      session.refreshToken &&
      session.expiresAt &&
      session.expiresAt > Date.now()
    );
  }

  private scheduleTokenRefresh(): void {
    if (!this.currentSession) return;

    const now = Date.now();
    const expiresAt = this.currentSession.expiresAt;
    const refreshTime = expiresAt - (5 * 60 * 1000); // 5 minutes before expiry

    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }

    if (refreshTime > now) {
      this.refreshTimeout = setTimeout(
        () => this.refreshToken(),
        refreshTime - now
      );
    } else {
      this.refreshToken();
    }
  }

  public async login(credentials: LoginCredentials): Promise<AuthSession> {
    try {
      this.metrics.loginAttempts++;

      // In production, this would make an API call
      const response = await this.mockLoginRequest(credentials);
      
      if (response.ok) {
        const session = await response.json();
        this.setSession(session);
        this.metrics.successfulLogins++;
        this.notifyObservers('login:success', { email: credentials.email });
        return session;
      } else {
        this.metrics.failedLogins++;
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      this.notifyObservers('login:failed', { error });
      logger.error('Login failed', { error });
      throw error;
    } finally {
      this.updateMetrics();
    }
  }

  private async mockLoginRequest(credentials: LoginCredentials): Promise<Response> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        if (credentials.email === 'test@example.com' && credentials.password === 'password') {
          resolve(new Response(JSON.stringify({
            token: 'mock_token',
            refreshToken: 'mock_refresh_token',
            expiresAt: Date.now() + (60 * 60 * 1000), // 1 hour
            user: {
              id: '1',
              email: credentials.email,
              role: 'user',
              permissions: ['read:content'],
              metadata: {
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                loginCount: 1,
                verified: true,
                twoFactorEnabled: false
              }
            }
          })));
        } else {
          resolve(new Response(null, { status: 401 }));
        }
      }, 500);
    });
  }

  public async register(data: RegisterData): Promise<UserProfile> {
    try {
      // In production, this would make an API call
      const response = await this.mockRegisterRequest(data);
      
      if (response.ok) {
        const user = await response.json();
        this.metrics.registrations++;
        this.notifyObservers('register:success', { email: data.email });
        return user;
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      this.notifyObservers('register:failed', { error });
      logger.error('Registration failed', { error });
      throw error;
    } finally {
      this.updateMetrics();
    }
  }

  private async mockRegisterRequest(data: RegisterData): Promise<Response> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(new Response(JSON.stringify({
          id: Math.random().toString(36).substring(7),
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: 'user',
          permissions: ['read:content'],
          metadata: {
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            loginCount: 0,
            verified: false,
            twoFactorEnabled: false
          }
        })));
      }, 500);
    });
  }

  public async logout(): Promise<void> {
    try {
      // In production, this would make an API call
      await this.mockLogoutRequest();
      
      this.clearSession();
      this.notifyObservers('logout:success', {});
    } catch (error) {
      this.notifyObservers('logout:failed', { error });
      logger.error('Logout failed', { error });
      throw error;
    } finally {
      this.updateMetrics();
    }
  }

  private async mockLogoutRequest(): Promise<void> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
  }

  private async refreshToken(): Promise<void> {
    if (!this.currentSession?.refreshToken) return;

    try {
      // In production, this would make an API call
      const response = await this.mockRefreshRequest(this.currentSession.refreshToken);
      
      if (response.ok) {
        const session = await response.json();
        this.setSession(session);
        this.notifyObservers('token:refreshed', {});
      } else {
        this.clearSession();
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      this.notifyObservers('token:refresh:failed', { error });
      logger.error('Token refresh failed', { error });
      throw error;
    }
  }

  private async mockRefreshRequest(refreshToken: string): Promise<Response> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(new Response(JSON.stringify({
          token: 'new_mock_token',
          refreshToken: 'new_mock_refresh_token',
          expiresAt: Date.now() + (60 * 60 * 1000), // 1 hour
          user: this.currentSession?.user
        })));
      }, 500);
    });
  }

  private setSession(session: AuthSession): void {
    this.currentSession = session;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_session', JSON.stringify(session));
    }
    this.scheduleTokenRefresh();
  }

  private clearSession(): void {
    this.currentSession = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_session');
    }
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }
  }

  public isAuthenticated(): boolean {
    return this.isValidSession(this.currentSession);
  }

  public getCurrentUser(): UserProfile | null {
    return this.currentSession?.user || null;
  }

  public hasPermission(permission: string): boolean {
    return this.currentSession?.user.permissions.includes(permission) || false;
  }

  public hasRole(role: string): boolean {
    return this.currentSession?.user.role === role;
  }

  public onAuthEvent(callback: (type: string, data: any) => void): () => void {
    this.observers.push(callback);
    return () => {
      this.observers = this.observers.filter(cb => cb !== callback);
    };
  }

  private notifyObservers(type: string, data: any): void {
    this.observers.forEach(callback => {
      try {
        callback(type, data);
      } catch (error) {
        logger.error('Auth event callback failed', { error });
      }
    });
  }

  private updateMetrics(): void {
    this.metrics = {
      ...this.metrics,
      lastUpdate: Date.now()
    };
  }

  public getMetrics(): AuthMetrics {
    return { ...this.metrics };
  }

  public async generateReport(): Promise<string> {
    const report = {
      metrics: this.metrics,
      currentSession: this.currentSession ? {
        expiresAt: this.currentSession.expiresAt,
        user: {
          id: this.currentSession.user.id,
          email: this.currentSession.user.email,
          role: this.currentSession.user.role
        }
      } : null,
      timestamp: new Date().toISOString()
    };

    return JSON.stringify(report, null, 2);
  }
}

export const authService = AuthService.getInstance();
export default AuthService;
