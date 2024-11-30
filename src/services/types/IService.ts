export interface IService {
  initialize(): Promise<void>;
  dispose(): Promise<void>;
  isInitialized(): boolean;
  getName(): string;
  getStatus(): ServiceStatus;
}

export enum ServiceStatus {
  UNINITIALIZED = 'UNINITIALIZED',
  INITIALIZING = 'INITIALIZING',
  READY = 'READY',
  ERROR = 'ERROR',
  DISPOSED = 'DISPOSED'
}

export abstract class BaseService implements IService {
  protected name: string;
  protected status: ServiceStatus;
  protected initialized: boolean;
  protected error?: Error;

  constructor(name: string) {
    this.name = name;
    this.status = ServiceStatus.UNINITIALIZED;
    this.initialized = false;
  }

  public async initialize(): Promise<void> {
    try {
      if (this.initialized) {
        return;
      }

      this.status = ServiceStatus.INITIALIZING;
      await this.onInitialize();
      this.initialized = true;
      this.status = ServiceStatus.READY;
    } catch (error) {
      this.error = error as Error;
      this.status = ServiceStatus.ERROR;
      throw error;
    }
  }

  public async dispose(): Promise<void> {
    try {
      if (!this.initialized) {
        return;
      }

      await this.onDispose();
      this.initialized = false;
      this.status = ServiceStatus.DISPOSED;
    } catch (error) {
      this.error = error as Error;
      this.status = ServiceStatus.ERROR;
      throw error;
    }
  }

  public isInitialized(): boolean {
    return this.initialized;
  }

  public getName(): string {
    return this.name;
  }

  public getStatus(): ServiceStatus {
    return this.status;
  }

  protected abstract onInitialize(): Promise<void>;
  protected abstract onDispose(): Promise<void>;
}

// Dependency injection decorators
export function Service(name: string) {
  return function (constructor: Function) {
    Reflect.defineMetadata('service:name', name, constructor);
  };
}

export function Inject(serviceType: string) {
  return function (target: any, propertyKey: string | symbol, parameterIndex: number) {
    const existingInjections = Reflect.getMetadata('service:inject', target) || [];
    existingInjections.push({ index: parameterIndex, type: serviceType });
    Reflect.defineMetadata('service:inject', existingInjections, target);
  };
}

// Service registration decorator
export function RegisterService(options: {
  name: string;
  dependencies?: string[];
}) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    Reflect.defineMetadata('service:options', options, constructor);
    return class extends constructor {
      constructor(...args: any[]) {
        super(...args);
        // Additional initialization logic can be added here
      }
    };
  };
}

// Service lifecycle hooks
export interface IServiceLifecycle {
  onBeforeInitialize?(): Promise<void>;
  onAfterInitialize?(): Promise<void>;
  onBeforeDispose?(): Promise<void>;
  onAfterDispose?(): Promise<void>;
  onError?(error: Error): Promise<void>;
}

// Service configuration interface
export interface IServiceConfig {
  name: string;
  enabled?: boolean;
  dependencies?: string[];
  config?: Record<string, any>;
}

// Service event types
export enum ServiceEventType {
  INITIALIZING = 'INITIALIZING',
  INITIALIZED = 'INITIALIZED',
  DISPOSING = 'DISPOSING',
  DISPOSED = 'DISPOSED',
  ERROR = 'ERROR',
  CONFIG_CHANGED = 'CONFIG_CHANGED',
  STATUS_CHANGED = 'STATUS_CHANGED'
}

// Service event interface
export interface IServiceEvent {
  type: ServiceEventType;
  serviceName: string;
  timestamp: number;
  data?: any;
  error?: Error;
}
