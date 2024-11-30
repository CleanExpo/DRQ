import { SERVICE_TYPES } from './index';
import { logger } from '@/utils/logger';

type ServiceType = typeof SERVICE_TYPES[keyof typeof SERVICE_TYPES][keyof typeof SERVICE_TYPES[keyof typeof SERVICE_TYPES]];
type ServiceInstance = any; // Will be refined as we implement each service

class ServiceFactory {
  private static instance: ServiceFactory;
  private services: Map<ServiceType, ServiceInstance>;
  private initializing: Set<ServiceType>;

  private constructor() {
    this.services = new Map();
    this.initializing = new Set();
  }

  public static getInstance(): ServiceFactory {
    if (!ServiceFactory.instance) {
      ServiceFactory.instance = new ServiceFactory();
    }
    return ServiceFactory.instance;
  }

  public async getService<T>(serviceType: ServiceType): Promise<T> {
    try {
      // Check if service is already instantiated
      if (this.services.has(serviceType)) {
        return this.services.get(serviceType) as T;
      }

      // Check for circular dependencies
      if (this.initializing.has(serviceType)) {
        throw new Error(`Circular dependency detected while initializing ${serviceType}`);
      }

      this.initializing.add(serviceType);

      // Import and instantiate the service
      const service = await this.createService(serviceType);
      this.services.set(serviceType, service);
      this.initializing.delete(serviceType);

      return service as T;
    } catch (error) {
      logger.error(`Failed to get service ${serviceType}:`, error);
      throw error;
    }
  }

  private async createService(serviceType: ServiceType): Promise<ServiceInstance> {
    try {
      // Determine service category and path
      const category = this.getServiceCategory(serviceType);
      const servicePath = `./src/services/${category}/${serviceType}`;

      // Dynamic import of service
      const module = await import(servicePath);
      const ServiceClass = module[serviceType];

      if (!ServiceClass) {
        throw new Error(`Service class ${serviceType} not found in module`);
      }

      // Get dependencies if any
      const dependencies = await this.resolveDependencies(ServiceClass);

      // Instantiate service with dependencies
      return new ServiceClass(...dependencies);
    } catch (error) {
      logger.error(`Failed to create service ${serviceType}:`, error);
      throw error;
    }
  }

  private getServiceCategory(serviceType: ServiceType): string {
    if (Object.values(SERVICE_TYPES.CORE).includes(serviceType as any)) {
      return 'core';
    }
    if (Object.values(SERVICE_TYPES.FEATURES).includes(serviceType as any)) {
      return 'features';
    }
    if (Object.values(SERVICE_TYPES.INFRASTRUCTURE).includes(serviceType as any)) {
      return 'infrastructure';
    }
    throw new Error(`Unknown service category for ${serviceType}`);
  }

  private async resolveDependencies(ServiceClass: any): Promise<ServiceInstance[]> {
    try {
      // Check for dependencies metadata
      const dependencies = Reflect.getMetadata('design:paramtypes', ServiceClass) || [];

      // Resolve each dependency
      return Promise.all(
        dependencies.map(async (dep: any) => {
          const dependencyType = this.getDependencyType(dep);
          if (dependencyType) {
            return this.getService(dependencyType);
          }
          return undefined;
        })
      );
    } catch (error) {
      logger.error('Failed to resolve dependencies:', error);
      return [];
    }
  }

  private getDependencyType(dependency: any): ServiceType | undefined {
    // Extract service type from dependency metadata
    // This will be implemented as we add dependency injection decorators
    return undefined;
  }

  public clearServices(): void {
    this.services.clear();
    this.initializing.clear();
  }
}

// Export singleton instance
export const serviceFactory = ServiceFactory.getInstance();
