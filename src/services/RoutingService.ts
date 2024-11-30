import { logger } from '@/utils/logger';
import { cacheService } from './CacheService';

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

class RoutingService {
  private static instance: RoutingService;
  private routes: Map<string, Route> = new Map();
  private metrics: RouteMetrics;
  private routeHistory: Array<{
    path: string;
    timestamp: number;
    loadTime: number;
  }> = [];
  private maxHistorySize = 100;

  private constructor() {
    this.metrics = this.initializeMetrics();
    this.setupRouteObserver();
  }

  public static getInstance(): RoutingService {
    if (!RoutingService.instance) {
      RoutingService.instance = new RoutingService();
    }
    return RoutingService.instance;
  }

  private initializeMetrics(): RouteMetrics {
    return {
      totalRoutes: 0,
      activeRoutes: 0,
      routesByType: {},
      routeHits: {},
      averageLoadTime: 0,
      lastUpdate: Date.now()
    };
  }

  private setupRouteObserver(): void {
    if (typeof window === 'undefined') return;

    // Observe route changes
    const originalPushState = window.history.pushState;
    window.history.pushState = (...args) => {
      originalPushState.apply(window.history, args);
      this.handleRouteChange();
    };

    window.addEventListener('popstate', () => {
      this.handleRouteChange();
    });
  }

  private handleRouteChange(): void {
    const path = window.location.pathname;
    const startTime = performance.now();

    // Record route visit
    this.routeHistory.push({
      path,
      timestamp: Date.now(),
      loadTime: performance.now() - startTime
    });

    // Keep history size in check
    if (this.routeHistory.length > this.maxHistorySize) {
      this.routeHistory.shift();
    }

    this.updateMetrics();
  }

  public registerRoute(route: Route): void {
    try {
      this.validateRoute(route);
      this.routes.set(route.path, route);
      this.updateMetrics();
      logger.debug('Route registered', { path: route.path });
    } catch (error) {
      logger.error('Failed to register route', { route, error });
      throw error;
    }
  }

  public registerRoutes(routes: Route[]): void {
    try {
      routes.forEach(route => this.registerRoute(route));
    } catch (error) {
      logger.error('Failed to register routes', { error });
      throw error;
    }
  }

  public getRoute(path: string): Route | null {
    return this.routes.get(path) || null;
  }

  public matchRoute(path: string): RouteMatch | null {
    try {
      const [pathname, search] = path.split('?');
      const route = this.findMatchingRoute(pathname);
      if (!route) return null;

      const params = this.extractParams(pathname, route);
      const query = this.parseQueryString(search);

      return { route, params, query };
    } catch (error) {
      logger.error('Failed to match route', { path, error });
      return null;
    }
  }

  private findMatchingRoute(pathname: string): Route | null {
    for (const [routePath, route] of this.routes) {
      if (this.pathMatchesRoute(pathname, routePath)) {
        return route;
      }
    }
    return null;
  }

  private pathMatchesRoute(pathname: string, routePath: string): boolean {
    const pathParts = pathname.split('/').filter(Boolean);
    const routeParts = routePath.split('/').filter(Boolean);

    if (pathParts.length !== routeParts.length) return false;

    return routeParts.every((part, i) => {
      if (part.startsWith(':')) return true;
      return part === pathParts[i];
    });
  }

  private extractParams(pathname: string, route: Route): Record<string, string> {
    const params: Record<string, string> = {};
    const pathParts = pathname.split('/').filter(Boolean);
    const routeParts = route.path.split('/').filter(Boolean);

    routeParts.forEach((part, i) => {
      if (part.startsWith(':')) {
        const paramName = part.slice(1);
        params[paramName] = pathParts[i];
      }
    });

    return params;
  }

  private parseQueryString(search?: string): Record<string, string> {
    if (!search) return {};
    const params = new URLSearchParams(search);
    const query: Record<string, string> = {};
    params.forEach((value, key) => {
      query[key] = value;
    });
    return query;
  }

  private validateRoute(route: Route): void {
    if (!route.path) {
      throw new Error('Route must have a path');
    }

    if (!route.name) {
      throw new Error('Route must have a name');
    }

    if (route.params) {
      route.params.forEach(param => {
        if (param.pattern) {
          try {
            new RegExp(param.pattern);
          } catch {
            throw new Error(`Invalid pattern for param ${param.name}`);
          }
        }
      });
    }
  }

  public buildPath(
    route: Route,
    params: Record<string, string> = {},
    query: Record<string, string> = {}
  ): string {
    try {
      let path = route.path;

      // Replace path parameters
      Object.entries(params).forEach(([key, value]) => {
        path = path.replace(`:${key}`, encodeURIComponent(value));
      });

      // Add query parameters
      const queryString = Object.entries(query)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

      return queryString ? `${path}?${queryString}` : path;
    } catch (error) {
      logger.error('Failed to build path', { route, params, query, error });
      throw error;
    }
  }

  public validateParams(route: Route, params: Record<string, string>): boolean {
    if (!route.params) return true;

    return route.params.every(param => {
      const value = params[param.name];

      if (param.required && !value) {
        return false;
      }

      if (value && param.pattern) {
        const regex = new RegExp(param.pattern);
        return regex.test(value);
      }

      return true;
    });
  }

  private updateMetrics(): void {
    const now = Date.now();
    const activeRoutes = this.routeHistory
      .filter(entry => now - entry.timestamp < 3600000); // Last hour

    const routeHits: Record<string, number> = {};
    activeRoutes.forEach(entry => {
      routeHits[entry.path] = (routeHits[entry.path] || 0) + 1;
    });

    const averageLoadTime = activeRoutes.length > 0
      ? activeRoutes.reduce((sum, entry) => sum + entry.loadTime, 0) / activeRoutes.length
      : 0;

    const routesByType: Record<string, number> = {};
    this.routes.forEach(route => {
      const type = route.meta?.auth ? 'protected' : 'public';
      routesByType[type] = (routesByType[type] || 0) + 1;
    });

    this.metrics = {
      totalRoutes: this.routes.size,
      activeRoutes: activeRoutes.length,
      routesByType,
      routeHits,
      averageLoadTime,
      lastUpdate: now
    };
  }

  public getMetrics(): RouteMetrics {
    return { ...this.metrics };
  }

  public async generateReport(): Promise<string> {
    const report = {
      metrics: this.metrics,
      routes: Array.from(this.routes.values()).map(route => ({
        path: route.path,
        name: route.name,
        type: route.meta?.auth ? 'protected' : 'public',
        hits: this.metrics.routeHits[route.path] || 0
      })),
      history: this.routeHistory.slice(-10),
      timestamp: new Date().toISOString()
    };

    return JSON.stringify(report, null, 2);
  }

  // Route caching
  public async cacheRoute(route: Route): Promise<void> {
    try {
      await cacheService.set(`route:${route.path}`, route, {
        ttl: 3600000, // 1 hour
        type: 'route'
      });
    } catch (error) {
      logger.error('Failed to cache route', { route, error });
    }
  }

  public async getCachedRoute(path: string): Promise<Route | null> {
    try {
      return await cacheService.get<Route>(`route:${path}`);
    } catch (error) {
      logger.error('Failed to get cached route', { path, error });
      return null;
    }
  }
}

export const routingService = RoutingService.getInstance();
export default RoutingService;
