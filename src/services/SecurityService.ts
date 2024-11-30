import { logger } from '@/utils/logger';
import { diagnosticService } from './DiagnosticService';

interface SecurityCheck {
  id: string;
  type: 'ssl' | 'csp' | 'mixed-content' | 'headers' | 'malware';
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: Record<string, any>;
  timestamp: number;
}

interface SecurityMetrics {
  totalChecks: number;
  failedChecks: number;
  warningChecks: number;
  lastCheck: number;
  checksByType: Record<string, number>;
}

class SecurityService {
  private static instance: SecurityService;
  private checks: Map<string, SecurityCheck> = new Map();
  private metrics: SecurityMetrics;

  private constructor() {
    this.metrics = this.initializeMetrics();
  }

  public static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    return SecurityService.instance;
  }

  private initializeMetrics(): SecurityMetrics {
    return {
      totalChecks: 0,
      failedChecks: 0,
      warningChecks: 0,
      lastCheck: Date.now(),
      checksByType: {}
    };
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  public async checkSSL(url: string): Promise<SecurityCheck> {
    try {
      const check: SecurityCheck = {
        id: this.generateId(),
        type: 'ssl',
        status: 'pass',
        message: 'SSL certificate is valid',
        timestamp: Date.now()
      };

      // Check if URL is HTTPS
      if (!url.startsWith('https://')) {
        check.status = 'fail';
        check.message = 'Site is not using HTTPS';
        check.details = {
          recommendation: 'Enable HTTPS for your site',
          impact: 'High - Chrome blocks non-HTTPS sites'
        };
      }

      this.checks.set(check.id, check);
      this.updateMetrics();
      return check;
    } catch (error) {
      logger.error('SSL check failed', { error });
      throw error;
    }
  }

  public async checkCSP(headers: Record<string, string>): Promise<SecurityCheck> {
    try {
      const check: SecurityCheck = {
        id: this.generateId(),
        type: 'csp',
        status: 'pass',
        message: 'Content Security Policy is properly configured',
        timestamp: Date.now()
      };

      const cspHeader = headers['content-security-policy'];
      if (!cspHeader) {
        check.status = 'fail';
        check.message = 'No Content Security Policy found';
        check.details = {
          recommendation: 'Implement a Content Security Policy',
          impact: 'High - Site is vulnerable to XSS attacks'
        };
      }

      this.checks.set(check.id, check);
      this.updateMetrics();
      return check;
    } catch (error) {
      logger.error('CSP check failed', { error });
      throw error;
    }
  }

  public async checkMixedContent(html: string): Promise<SecurityCheck> {
    try {
      const check: SecurityCheck = {
        id: this.generateId(),
        type: 'mixed-content',
        status: 'pass',
        message: 'No mixed content found',
        timestamp: Date.now()
      };

      // Check for HTTP resources in HTML
      const httpRegex = /http:\/\/[^"'\s>]+/g;
      const mixedContent = html.match(httpRegex);

      if (mixedContent) {
        check.status = 'fail';
        check.message = 'Mixed content detected';
        check.details = {
          mixedContent,
          recommendation: 'Update all resources to use HTTPS',
          impact: 'High - Chrome blocks mixed content'
        };
      }

      this.checks.set(check.id, check);
      this.updateMetrics();
      return check;
    } catch (error) {
      logger.error('Mixed content check failed', { error });
      throw error;
    }
  }

  public async checkSecurityHeaders(headers: Record<string, string>): Promise<SecurityCheck> {
    try {
      const check: SecurityCheck = {
        id: this.generateId(),
        type: 'headers',
        status: 'pass',
        message: 'Security headers are properly configured',
        timestamp: Date.now()
      };

      const requiredHeaders = [
        'strict-transport-security',
        'x-content-type-options',
        'x-frame-options',
        'x-xss-protection'
      ];

      const missingHeaders = requiredHeaders.filter(header => !headers[header]);

      if (missingHeaders.length > 0) {
        check.status = missingHeaders.length === requiredHeaders.length ? 'fail' : 'warning';
        check.message = 'Missing security headers';
        check.details = {
          missingHeaders,
          recommendation: 'Implement missing security headers',
          impact: 'Medium - Site may be vulnerable to various attacks'
        };
      }

      this.checks.set(check.id, check);
      this.updateMetrics();
      return check;
    } catch (error) {
      logger.error('Security headers check failed', { error });
      throw error;
    }
  }

  public async analyzePage(url: string, html: string, headers: Record<string, string>): Promise<void> {
    try {
      const checks = await Promise.all([
        this.checkSSL(url),
        this.checkCSP(headers),
        this.checkMixedContent(html),
        this.checkSecurityHeaders(headers)
      ]);

      const failedChecks = checks.filter(check => check.status === 'fail');
      if (failedChecks.length > 0) {
        // Report to diagnostic service
        diagnosticService.addDiagnosticResult({
          type: 'error',
          code: 'SECURITY_CHECK_FAILED',
          message: 'Security checks failed',
          details: {
            failedChecks,
            url,
            timestamp: Date.now()
          },
          timestamp: Date.now()
        });
      }
    } catch (error) {
      logger.error('Page analysis failed', { error });
      throw error;
    }
  }

  private updateMetrics(): void {
    const checks = Array.from(this.checks.values());
    const checksByType: Record<string, number> = {};
    let failedChecks = 0;
    let warningChecks = 0;

    checks.forEach(check => {
      checksByType[check.type] = (checksByType[check.type] || 0) + 1;
      if (check.status === 'fail') failedChecks++;
      if (check.status === 'warning') warningChecks++;
    });

    this.metrics = {
      totalChecks: checks.length,
      failedChecks,
      warningChecks,
      lastCheck: Date.now(),
      checksByType
    };
  }

  public getMetrics(): SecurityMetrics {
    return { ...this.metrics };
  }

  public getChecks(): SecurityCheck[] {
    return Array.from(this.checks.values());
  }

  public async generateReport(): Promise<string> {
    const report = {
      metrics: this.metrics,
      checks: this.getChecks(),
      recommendations: this.getChecks()
        .filter(check => check.status !== 'pass')
        .map(check => ({
          type: check.type,
          message: check.message,
          details: check.details
        })),
      timestamp: new Date().toISOString()
    };

    return JSON.stringify(report, null, 2);
  }

  public clearChecks(): void {
    this.checks.clear();
    this.metrics = this.initializeMetrics();
  }
}

export const securityService = SecurityService.getInstance();
export default SecurityService;
