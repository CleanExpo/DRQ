'use client';

import { useState, useEffect } from 'react';
import { AuthService } from '../services/core/AuthService';
import { useAriaExpanded } from '../hooks/useAriaExpanded';
import { IUser, UserRole, AuthEvent, AuthEventType } from '../services/types/IAuthService';

interface AuthStats {
  user: IUser | null;
  isAuthenticated: boolean;
  lastEvent: AuthEvent | null;
  sessionExpiry: Date | null;
}

export default function AuthMonitor() {
  const [stats, setStats] = useState<AuthStats | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const ariaProps = useAriaExpanded(isVisible);

  useEffect(() => {
    const authService = AuthService.getInstance();
    let unsubscribe: (() => void) | null = null;

    const initialize = async () => {
      try {
        const user = await authService.getCurrentUser();
        const token = authService.getAccessToken();
        let sessionExpiry: Date | null = null;

        if (token) {
          // Decode JWT to get expiry
          const payload = JSON.parse(atob(token.split('.')[1]));
          sessionExpiry = new Date(payload.exp * 1000);
        }

        setStats({
          user,
          isAuthenticated: authService.isAuthenticated(),
          lastEvent: null,
          sessionExpiry
        });

        // Subscribe to auth events
        unsubscribe = authService.onAuthStateChanged((user) => {
          setStats(prev => ({
            ...prev!,
            user,
            isAuthenticated: authService.isAuthenticated(),
            lastEvent: {
              type: user ? AuthEventType.SIGNED_IN : AuthEventType.SIGNED_OUT,
              user,
              timestamp: Date.now()
            }
          }));
        });
      } catch (error) {
        console.error('Failed to initialize AuthMonitor:', error);
      }
    };

    initialize();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  if (!stats || process.env.NODE_ENV === 'production') {
    return null;
  }

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'bg-red-500';
      case UserRole.STAFF:
        return 'bg-blue-500';
      case UserRole.USER:
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div 
      className="fixed bottom-4 left-4 z-50"
      data-testid="auth-monitor"
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-700 transition-colors"
        aria-controls="auth-stats-panel"
        data-testid="auth-monitor-toggle"
        {...ariaProps}
      >
        Auth Monitor {isVisible ? '▼' : '▲'}
      </button>

      {/* Stats Panel */}
      {isVisible && (
        <div
          id="auth-stats-panel"
          className="mt-2 p-4 bg-white rounded-lg shadow-lg border border-gray-200 w-80"
          role="region"
          aria-label="Authentication status"
          data-testid="auth-stats-panel"
        >
          {/* Auth Status */}
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-500">Status</div>
            <div className="flex items-center mt-1">
              <span 
                className={`w-2 h-2 rounded-full mr-2 ${
                  stats.isAuthenticated ? 'bg-green-500' : 'bg-red-500'
                }`}
                aria-hidden="true"
              />
              <span className="font-medium">
                {stats.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
              </span>
            </div>
          </div>

          {/* User Info */}
          {stats.user && (
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-500 mb-2">User</div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-gray-600 text-sm">Email:</span>
                  <span className="ml-2 font-medium text-sm">{stats.user.email}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 text-sm">Role:</span>
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs text-white ${getRoleColor(stats.user.role)}`}>
                    {stats.user.role}
                  </span>
                </div>
                {stats.user.lastLogin && (
                  <div className="flex items-center">
                    <span className="text-gray-600 text-sm">Last Login:</span>
                    <span className="ml-2 text-sm">
                      {new Date(stats.user.lastLogin).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Session Info */}
          {stats.sessionExpiry && (
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-500">Session</div>
              <div className="mt-1 text-sm">
                Expires: {stats.sessionExpiry.toLocaleString()}
              </div>
            </div>
          )}

          {/* Last Event */}
          {stats.lastEvent && (
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-500">Last Event</div>
              <div className="mt-1 text-sm">
                <span className="text-gray-600">{stats.lastEvent.type}</span>
                <span className="ml-2 text-gray-400">
                  {formatTimestamp(stats.lastEvent.timestamp)}
                </span>
              </div>
            </div>
          )}

          {/* Sign Out Button */}
          {stats.isAuthenticated && (
            <button
              onClick={async () => {
                const authService = AuthService.getInstance();
                await authService.logout();
              }}
              className="mt-4 w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              data-testid="sign-out-button"
            >
              Sign Out
            </button>
          )}
        </div>
      )}
    </div>
  );
}
