// Core Services
export { AuthService } from './core/AuthService';
export { SecurityService } from './core/SecurityService';
export { StateService } from './core/StateService';
export { CacheService } from './core/CacheService';
export { DatabaseService } from './core/DatabaseService';
export { ThemeService } from './core/ThemeService';
export { LocalizationService } from './core/LocalizationService';

// Feature Services
export { CMSService } from './features/CMSService';
export { MediaService } from './features/MediaService';
export { SEOService } from './features/SEOService';
export { FormService } from './features/FormService';
export { SearchService } from './features/SearchService';
export { NotificationService } from './features/NotificationService';
export { PaymentService } from './features/PaymentService';
export { AnalyticsService } from './features/AnalyticsService';

// Infrastructure Services
export { PerformanceService } from './infrastructure/PerformanceService';
export { ErrorService } from './infrastructure/ErrorService';
export { LoggingService } from './infrastructure/LoggingService';
export { RoutingService } from './infrastructure/RoutingService';
export { DiagnosticService } from './infrastructure/DiagnosticService';
export { DiagnosticSchedulerService } from './infrastructure/DiagnosticSchedulerService';
export { DiagnosticAnalyticsService } from './infrastructure/DiagnosticAnalyticsService';

// Service Types
export type { IAuthService } from './types/IAuthService';
export type { ISecurityService } from './types/ISecurityService';
export type { IStateService } from './types/IStateService';
export type { ICacheService } from './types/ICacheService';
export type { IDatabaseService } from './types/IDatabaseService';
export type { IThemeService } from './types/IThemeService';
export type { ILocalizationService } from './types/ILocalizationService';
export type { ICMSService } from './types/ICMSService';
export type { IMediaService } from './types/IMediaService';
export type { ISEOService } from './types/ISEOService';
export type { IFormService } from './types/IFormService';
export type { ISearchService } from './types/ISearchService';
export type { INotificationService } from './types/INotificationService';
export type { IPaymentService } from './types/IPaymentService';
export type { IAnalyticsService } from './types/IAnalyticsService';
export type { IPerformanceService } from './types/IPerformanceService';
export type { IErrorService } from './types/IErrorService';
export type { ILoggingService } from './types/ILoggingService';
export type { IRoutingService } from './types/IRoutingService';
export type { IDiagnosticService } from './types/IDiagnosticService';
export type { IDiagnosticSchedulerService } from './types/IDiagnosticSchedulerService';
export type { IDiagnosticAnalyticsService } from './types/IDiagnosticAnalyticsService';

// Service Factory
export { ServiceFactory } from './ServiceFactory';

// Service Constants
export const SERVICE_TYPES = {
  CORE: {
    AUTH: 'AuthService',
    SECURITY: 'SecurityService',
    STATE: 'StateService',
    CACHE: 'CacheService',
    DATABASE: 'DatabaseService',
    THEME: 'ThemeService',
    LOCALIZATION: 'LocalizationService'
  },
  FEATURES: {
    CMS: 'CMSService',
    MEDIA: 'MediaService',
    SEO: 'SEOService',
    FORM: 'FormService',
    SEARCH: 'SearchService',
    NOTIFICATION: 'NotificationService',
    PAYMENT: 'PaymentService',
    ANALYTICS: 'AnalyticsService'
  },
  INFRASTRUCTURE: {
    PERFORMANCE: 'PerformanceService',
    ERROR: 'ErrorService',
    LOGGING: 'LoggingService',
    ROUTING: 'RoutingService',
    DIAGNOSTIC: 'DiagnosticService',
    DIAGNOSTIC_SCHEDULER: 'DiagnosticSchedulerService',
    DIAGNOSTIC_ANALYTICS: 'DiagnosticAnalyticsService'
  }
} as const;
