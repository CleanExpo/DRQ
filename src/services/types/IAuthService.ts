export interface IUser {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  permissions: string[];
  lastLogin?: Date;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  USER = 'USER',
  GUEST = 'GUEST'
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface IAuthService {
  // Authentication methods
  login(credentials: AuthCredentials): Promise<AuthTokens>;
  logout(): Promise<void>;
  refreshToken(token: string): Promise<AuthTokens>;
  
  // User management
  getCurrentUser(): Promise<IUser | null>;
  updateUserProfile(data: Partial<IUser>): Promise<IUser>;
  
  // Session management
  isAuthenticated(): boolean;
  getAccessToken(): string | null;
  
  // Permission management
  hasPermission(permission: string): boolean;
  hasRole(role: UserRole): boolean;
  
  // Event handlers
  onAuthStateChanged(callback: (user: IUser | null) => void): () => void;
  onTokenExpired(callback: () => void): () => void;
}

export interface AuthState {
  user: IUser | null;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
}

export interface AuthError extends Error {
  code: string;
  details?: Record<string, any>;
}

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'auth/invalid-credentials',
  TOKEN_EXPIRED: 'auth/token-expired',
  INSUFFICIENT_PERMISSIONS: 'auth/insufficient-permissions',
  NETWORK_ERROR: 'auth/network-error',
  USER_NOT_FOUND: 'auth/user-not-found',
  EMAIL_IN_USE: 'auth/email-already-in-use',
  WEAK_PASSWORD: 'auth/weak-password',
  INVALID_TOKEN: 'auth/invalid-token'
} as const;

export type AuthErrorCode = typeof AUTH_ERRORS[keyof typeof AUTH_ERRORS];

// Event types for auth state changes
export enum AuthEventType {
  SIGNED_IN = 'SIGNED_IN',
  SIGNED_OUT = 'SIGNED_OUT',
  TOKEN_REFRESHED = 'TOKEN_REFRESHED',
  PROFILE_UPDATED = 'PROFILE_UPDATED',
  ERROR = 'ERROR'
}

export interface AuthEvent {
  type: AuthEventType;
  user?: IUser | null;
  error?: AuthError;
  timestamp: number;
}
