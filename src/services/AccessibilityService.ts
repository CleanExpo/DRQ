import { logger } from '@/utils/logger';
import { cacheService } from './CacheService';

interface AccessibilityIssue {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  code: string;
  element?: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
  wcag?: {
    principle: string;
    guideline: string;
    level: 'A' | 'AA' | 'AAA';
  };
  metadata: {
    path: string;
    timestamp: string;
    selector?: string;
    html?: string;
    suggestion: string;
  };
}

interface AccessibilityTest {
  id: string;
  name: string;
  description: string;
  category: 'aria' | 'color' | 'forms' | 'keyboard' | 'structure' | 'media';
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
  wcag?: {
    principle: string;
    guideline: string;
    level: 'A' | 'AA' | 'AAA';
  };
}

interface AccessibilityMetrics {
  totalIssues: number;
  issuesBySeverity: Record<string, number>;
  issuesByType: Record<string, number>;
  issuesByWCAG: Record<string, number>;
  complianceLevel: {
    a: number;
    aa: number;
    aaa: number;
  };
  lastUpdate: number;
}

class AccessibilityService {
  private static instance: AccessibilityService;
  private issues: Map<string, AccessibilityIssue> = new Map();
  private tests: Map<string, AccessibilityTest> = new Map();
  private metrics: AccessibilityMetrics;
  private observers: ((type: string, data: any) => void)[] = [];

  private constructor() {
    this.metrics = this.initializeMetrics();
    this.initializeTests();
  }

  public static getInstance(): AccessibilityService {
    if (!AccessibilityService.instance) {
      AccessibilityService.instance = new AccessibilityService();
    }
    return AccessibilityService.instance;
  }

  private initializeMetrics(): AccessibilityMetrics {
    return {
      totalIssues: 0,
      issuesBySeverity: {},
      issuesByType: {},
      issuesByWCAG: {},
      complianceLevel: {
        a: 100,
        aa: 100,
        aaa: 100
      },
      lastUpdate: Date.now()
    };
  }

  private initializeTests(): void {
    // ARIA tests
    this.addTest({
      id: 'aria-required-attr',
      name: 'ARIA Required Attributes',
      description: 'Ensures elements with ARIA roles have required attributes',
      category: 'aria',
      impact: 'critical',
      wcag: {
        principle: '4.1',
        guideline: '4.1.2',
        level: 'A'
      }
    });

    // Color tests
    this.addTest({
      id: 'color-contrast',
      name: 'Color Contrast',
      description: 'Ensures sufficient color contrast between elements',
      category: 'color',
      impact: 'serious',
      wcag: {
        principle: '1.4',
        guideline: '1.4.3',
        level: 'AA'
      }
    });

    // Form tests
    this.addTest({
      id: 'label',
      name: 'Form Label',
      description: 'Ensures form controls have associated labels',
      category: 'forms',
      impact: 'critical',
      wcag: {
        principle: '1.3',
        guideline: '1.3.1',
        level: 'A'
      }
    });

    // Keyboard tests
    this.addTest({
      id: 'keyboard',
      name: 'Keyboard Navigation',
      description: 'Ensures all functionality is available via keyboard',
      category: 'keyboard',
      impact: 'critical',
      wcag: {
        principle: '2.1',
        guideline: '2.1.1',
        level: 'A'
      }
    });
  }

  private addTest(test: AccessibilityTest): void {
    this.tests.set(test.id, test);
  }

  public async analyzePage(path: string): Promise<AccessibilityIssue[]> {
    try {
      const issues: AccessibilityIssue[] = [];

      // In production, this would use a proper accessibility testing library
      for (const [testId, test] of this.tests) {
        const testIssues = await this.runTest(testId, path);
        issues.push(...testIssues);
      }

      issues.forEach(issue => this.issues.set(issue.id, issue));
      this.updateMetrics();
      this.notifyObservers('page:analyzed', { path, issues });

      logger.debug('Page analyzed for accessibility', { path, issueCount: issues.length });
      return issues;
    } catch (error) {
      logger.error('Failed to analyze page', { path, error });
      throw error;
    }
  }

  private async runTest(testId: string, path: string): Promise<AccessibilityIssue[]> {
    const test = this.tests.get(testId);
    if (!test) return [];

    // Simulate test execution
    // In production, this would run actual accessibility checks
    const issues: AccessibilityIssue[] = [];

    switch (test.category) {
      case 'aria':
        // Simulate ARIA checks
        if (Math.random() > 0.8) {
          issues.push(this.createIssue('missing_aria_label', {
            message: 'Element missing required aria-label',
            severity: 'high',
            impact: 'critical',
            path,
            test
          }));
        }
        break;

      case 'color':
        // Simulate color contrast checks
        if (Math.random() > 0.7) {
          issues.push(this.createIssue('insufficient_contrast', {
            message: 'Insufficient color contrast ratio',
            severity: 'medium',
            impact: 'serious',
            path,
            test
          }));
        }
        break;

      case 'forms':
        // Simulate form accessibility checks
        if (Math.random() > 0.9) {
          issues.push(this.createIssue('missing_label', {
            message: 'Form control missing associated label',
            severity: 'high',
            impact: 'critical',
            path,
            test
          }));
        }
        break;

      case 'keyboard':
        // Simulate keyboard navigation checks
        if (Math.random() > 0.85) {
          issues.push(this.createIssue('keyboard_trap', {
            message: 'Keyboard trap detected',
            severity: 'high',
            impact: 'critical',
            path,
            test
          }));
        }
        break;
    }

    return issues;
  }

  private createIssue(code: string, params: {
    message: string;
    severity: AccessibilityIssue['severity'];
    impact: AccessibilityIssue['impact'];
    path: string;
    test: AccessibilityTest;
  }): AccessibilityIssue {
    return {
      id: this.generateId(),
      type: params.test.category,
      severity: params.severity,
      message: params.message,
      code,
      impact: params.impact,
      wcag: params.test.wcag,
      metadata: {
        path: params.path,
        timestamp: new Date().toISOString(),
        suggestion: this.getSuggestion(code)
      }
    };
  }

  private getSuggestion(code: string): string {
    const suggestions: Record<string, string> = {
      missing_aria_label: 'Add an aria-label attribute to provide context for screen readers',
      insufficient_contrast: 'Increase the color contrast ratio to meet WCAG guidelines',
      missing_label: 'Add a label element or aria-label for the form control',
      keyboard_trap: 'Ensure users can navigate through and away from content using keyboard'
    };

    return suggestions[code] || 'Review and fix the accessibility issue';
  }

  public async getIssues(path?: string): Promise<AccessibilityIssue[]> {
    const issues = Array.from(this.issues.values());
    return path ? issues.filter(issue => issue.metadata.path === path) : issues;
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  public onAccessibilityEvent(callback: (type: string, data: any) => void): () => void {
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
        logger.error('Accessibility event callback failed', { error });
      }
    });
  }

  private updateMetrics(): void {
    const issues = Array.from(this.issues.values());

    // Calculate issues by severity
    const issuesBySeverity = issues.reduce((acc, issue) => {
      acc[issue.severity] = (acc[issue.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate issues by type
    const issuesByType = issues.reduce((acc, issue) => {
      acc[issue.type] = (acc[issue.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate issues by WCAG guideline
    const issuesByWCAG = issues.reduce((acc, issue) => {
      if (issue.wcag) {
        const key = `${issue.wcag.principle}.${issue.wcag.guideline}`;
        acc[key] = (acc[key] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Calculate compliance levels
    const complianceLevel = this.calculateComplianceLevel(issues);

    this.metrics = {
      totalIssues: issues.length,
      issuesBySeverity,
      issuesByType,
      issuesByWCAG,
      complianceLevel,
      lastUpdate: Date.now()
    };
  }

  private calculateComplianceLevel(issues: AccessibilityIssue[]): AccessibilityMetrics['complianceLevel'] {
    const levels = { a: 100, aa: 100, aaa: 100 };
    const weights = { high: 1, medium: 0.5, low: 0.25 };

    issues.forEach(issue => {
      if (!issue.wcag) return;

      const weight = weights[issue.severity];
      const level = issue.wcag.level.toLowerCase();

      // Reduce compliance level based on issue severity
      if (level === 'a') {
        levels.a = Math.max(0, levels.a - weight * 10);
        levels.aa = Math.max(0, levels.aa - weight * 5);
        levels.aaa = Math.max(0, levels.aaa - weight * 2.5);
      } else if (level === 'aa') {
        levels.aa = Math.max(0, levels.aa - weight * 10);
        levels.aaa = Math.max(0, levels.aaa - weight * 5);
      } else if (level === 'aaa') {
        levels.aaa = Math.max(0, levels.aaa - weight * 10);
      }
    });

    return levels;
  }

  public getMetrics(): AccessibilityMetrics {
    return { ...this.metrics };
  }

  public async generateReport(): Promise<string> {
    const report = {
      metrics: this.metrics,
      issues: Array.from(this.issues.values()).map(issue => ({
        type: issue.type,
        severity: issue.severity,
        message: issue.message,
        wcag: issue.wcag,
        path: issue.metadata.path
      })),
      tests: Array.from(this.tests.values()).map(test => ({
        name: test.name,
        category: test.category,
        impact: test.impact,
        wcag: test.wcag
      })),
      timestamp: new Date().toISOString()
    };

    return JSON.stringify(report, null, 2);
  }
}

export const accessibilityService = AccessibilityService.getInstance();
export default AccessibilityService;
