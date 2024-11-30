import { useState, useEffect, useCallback } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { routingService } from '@/services/RoutingService';
import { logger } from '@/utils/logger';

interface Route {
  id: string;
  path: string;
  name: string;
  component?: string;
  layout?: string;
  meta?: {
    title?: string;
    description?: string;
    auth?: boolean;
    roles?: string[];
    middleware?: string[];
  };
  params?: Array<{
    name: string;
    required: boolean;
    type: 'string' | 'number' | 'boolean';
    pattern?: string;
  }>;
  children?: Route[];
}

interface RouteMatch {
  route: Route;
  params: Record<string, string>;
  query: Record<string, string>;
}

interface RouteMetrics {
  totalRoutes: number;
  activeRoutes: number;
  routesByType: Record<string, number>;
  routeHits: Record<string, number>;
  averageLoadTime: number;
  lastUpdate: number;
}

interface UseRoutingOptions {
  onRouteChange?: (match: RouteMatch) => void;
  onRouteError?: (error: Error) => void;
}

export function useRouting(options: UseRoutingOptions = {}) {
  const {
    onRouteChange,
    onRouteError
  } = options;

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentRoute, setCurrentRoute] = useState<RouteMatch | null>(null);
  const [metrics, setMetrics] = useState<RouteMetrics>(routingService.getMetrics());

  useEffect(() => {
    if (pathname) {
      const search = searchParams?.toString();
      const path = search ? `${pathname}?${search}` : pathname;
      const match = routingService.matchRoute(path);

      if (match) {
        setCurrentRoute(match);
        onRouteChange?.(match);
      }
    }
  }, [pathname, searchParams, onRouteChange]);

  useEffect(() => {
    // Update metrics every second
    const interval = setInterval(() => {
      setMetrics(routingService.getMetrics());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const navigate = useCallback((
    route: Route,
    params: Record<string, string> = {},
    query: Record<string, string> = {}
  ) => {
    try {
      if (!routingService.validateParams(route, params)) {
        throw new Error('Invalid route parameters');
      }

      const path = routingService.buildPath(route, params, query);
      router.push(path);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Navigation failed');
      onRouteError?.(err);
      logger.error('Navigation failed', { route, params, query, error });
    }
  }, [router, onRouteError]);

  const registerRoute = useCallback((route: Route) => {
    try {
      routingService.registerRoute(route);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to register route');
      onRouteError?.(err);
      logger.error('Failed to register route', { route, error });
    }
  }, [onRouteError]);

  const registerRoutes = useCallback((routes: Route[]) => {
    try {
      routingService.registerRoutes(routes);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to register routes');
      onRouteError?.(err);
      logger.error('Failed to register routes', { error });
    }
  }, [onRouteError]);

  const getRoute = useCallback((path: string): Route | null => {
    try {
      return routingService.getRoute(path);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to get route');
      onRouteError?.(err);
      logger.error('Failed to get route', { path, error });
      return null;
    }
  }, [onRouteError]);

  const matchRoute = useCallback((path: string): RouteMatch | null => {
    try {
      return routingService.matchRoute(path);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to match route');
      onRouteError?.(err);
      logger.error('Failed to match route', { path, error });
      return null;
    }
  }, [onRouteError]);

  const buildPath = useCallback((
    route: Route,
    params: Record<string, string> = {},
    query: Record<string, string> = {}
  ): string => {
    try {
      return routingService.buildPath(route, params, query);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to build path');
      onRouteError?.(err);
      logger.error('Failed to build path', { route, params, query, error });
      return '';
    }
  }, [onRouteError]);

  const generateReport = useCallback(async () => {
    try {
      return await routingService.generateReport();
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to generate report');
      onRouteError?.(err);
      logger.error('Failed to generate report', { error });
      throw err;
    }
  }, [onRouteError]);

  return {
    currentRoute,
    metrics,
    navigate,
    registerRoute,
    registerRoutes,
    getRoute,
    matchRoute,
    buildPath,
    generateReport
  };
}

// Example usage:
/*
function RoutingComponent() {
  const {
    currentRoute,
    metrics,
    navigate
  } = useRouting({
    onRouteChange: (match) => {
      console.log('Route changed:', match);
    }
  });

  const handleNavigation = () => {
    const route = {
      id: 'user-profile',
      path: '/users/:id',
      name: 'User Profile'
    };
    navigate(route, { id: '123' }, { tab: 'settings' });
  };

  return (
    <div>
      <div>Current Path: {currentRoute?.route.path}</div>
      <div>Active Routes: {metrics.activeRoutes}</div>
      <button onClick={handleNavigation}>
        Go to User Profile
      </button>
    </div>
  );
}
*/
