import { useState, useEffect, useCallback, useMemo } from 'react';
import { AuthService } from '@/services/core/AuthService';
import type {
  IUser,
  AuthCredentials,
  AuthTokens,
  UserRole,
  AuthState
} from '@/services/types/IAuthService';
import { logger } from '@/utils/logger';

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
    isAuthenticated: false
  });

  const authService = useMemo(() => AuthService.getInstance(), []);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (mounted) {
          setState({
            user,
            loading: false,
            error: null,
            isAuthenticated: !!user
          });
        }
      } catch (error) {
        if (mounted) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: error as Error
          }));
        }
      }
    };

    initializeAuth();

    // Subscribe to auth state changes
    const unsubscribe = authService.onAuthStateChanged((user) => {
      if (mounted) {
        setState({
          user,
          loading: false,
          error: null,
          isAuthenticated: !!user
        });
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [authService]);

  // Login handler
  const login = useCallback(async (credentials: AuthCredentials) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const tokens = await authService.login(credentials);
      return tokens;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error as Error
      }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [authService]);

  // Logout handler
  const logout = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await authService.logout();
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error as Error
      }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [authService]);

  // Update profile handler
  const updateProfile = useCallback(async (data: Partial<IUser>) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const updatedUser = await authService.updateUserProfile(data);
      setState(prev => ({
        ...prev,
        user: updatedUser,
        loading: false
      }));
      return updatedUser;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error as Error
      }));
      throw error;
    }
  }, [authService]);

  // Permission check
  const hasPermission = useCallback((permission: string): boolean => {
    return authService.hasPermission(permission);
  }, [authService]);

  // Role check
  const hasRole = useCallback((role: UserRole): boolean => {
    return authService.hasRole(role);
  }, [authService]);

  // Get access token
  const getAccessToken = useCallback((): string | null => {
    return authService.getAccessToken();
  }, [authService]);

  // Memoized auth utilities
  const utils = useMemo(() => ({
    hasPermission,
    hasRole,
    getAccessToken
  }), [hasPermission, hasRole, getAccessToken]);

  return {
    ...state,
    login,
    logout,
    updateProfile,
    ...utils
  };
}

// Example usage:
/*
function LoginComponent() {
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login({
        email: 'user@example.com',
        password: 'password'
      });
      // Redirect or show success message
    } catch (error) {
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      // Form fields
    </form>
  );
}

function ProtectedComponent() {
  const { user, hasPermission } = useAuth();

  if (!user) {
    return <div>Please log in</div>;
  }

  if (!hasPermission('read:data')) {
    return <div>Access denied</div>;
  }

  return <div>Protected content</div>;
}
*/
