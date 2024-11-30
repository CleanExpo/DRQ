import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { accessibilityService } from '@/services/AccessibilityService';
import { logger } from '@/utils/logger';

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

interface UseAccessibilityOptions {
  onIssueDetected?: (issue: AccessibilityIssue) => void;
  onAnalysisComplete?: (issues: AccessibilityIssue[]) => void;
  onError?: (error: Error) => void;
}

export function useAccessibility(options: UseAccessibilityOptions = {}) {
  const {
    onIssueDetected,
    onAnalysisComplete,
    onError
  } = options;

  const pathname = usePathname();
  const [issues, setIssues] = useState<AccessibilityIssue[]>([]);
  const [metrics, setMetrics] = useState<AccessibilityMetrics>(accessibilityService.getMetrics());
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const unsubscribe = accessibilityService.onAccessibilityEvent((type, data) => {
      switch (type) {
        case 'issue:detected':
          onIssueDetected?.(data);
          break;
        case 'page:analyzed':
          onAnalysisComplete?.(data.issues);
          break;
      }
      setMetrics(accessibilityService.getMetrics());
    });

    return unsubscribe;
  }, [onIssueDetected, onAnalysisComplete]);

  useEffect(() => {
    if (pathname) {
      loadIssues(pathname);
    }
  }, [pathname]);

  const loadIssues = useCallback(async (path: string) => {
    try {
      const pageIssues = await accessibilityService.getIssues(path);
      setIssues(pageIssues);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to load issues');
      onError?.(err);
      logger.error('Failed to load issues', { path, error });
    }
  }, [onError]);

  const analyzePage = useCallback(async (path: string = pathname || '') => {
    try {
      setIsAnalyzing(true);
      const newIssues = await accessibilityService.analyzePage(path);
      setIssues(newIssues);
      return newIssues;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to analyze page');
      onError?.(err);
      logger.error('Failed to analyze page', { path, error });
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  }, [pathname, onError]);

  const getIssueColor = useCallback((severity: string): string => {
    switch (severity) {
      case 'high': return 'red';
      case 'medium': return 'yellow';
      case 'low': return 'blue';
      default: return 'gray';
    }
  }, []);

  const getImpactColor = useCallback((impact: string): string => {
    switch (impact) {
      case 'critical': return 'red';
      case 'serious': return 'orange';
      case 'moderate': return 'yellow';
      case 'minor': return 'blue';
      default: return 'gray';
    }
  }, []);

  const getComplianceColor = useCallback((level: number): string => {
    if (level >= 90) return 'green';
    if (level >= 70) return 'yellow';
    return 'red';
  }, []);

  const getComplianceLabel = useCallback((level: number): string => {
    if (level >= 90) return 'Excellent';
    if (level >= 70) return 'Good';
    if (level >= 50) return 'Fair';
    return 'Poor';
  }, []);

  const generateReport = useCallback(async () => {
    try {
      return await accessibilityService.generateReport();
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to generate report');
      onError?.(err);
      logger.error('Failed to generate report', { error });
      throw err;
    }
  }, [onError]);

  return {
    issues,
    metrics,
    isAnalyzing,
    analyzePage,
    getIssueColor,
    getImpactColor,
    getComplianceColor,
    getComplianceLabel,
    generateReport
  };
}

// Example usage:
/*
function AccessibilityComponent() {
  const {
    issues,
    metrics,
    isAnalyzing,
    analyzePage,
    getIssueColor,
    getComplianceColor,
    getComplianceLabel
  } = useAccessibility({
    onIssueDetected: (issue) => {
      console.log('Accessibility issue detected:', issue);
    },
    onAnalysisComplete: (issues) => {
      console.log('Analysis complete:', issues);
    }
  });

  return (
    <div>
      <div>
        WCAG Level A Compliance: 
        <span className={`text-${getComplianceColor(metrics.complianceLevel.a)}-600`}>
          {getComplianceLabel(metrics.complianceLevel.a)}
          ({metrics.complianceLevel.a}%)
        </span>
      </div>
      <div>Total Issues: {metrics.totalIssues}</div>
      <button 
        onClick={() => analyzePage()}
        disabled={isAnalyzing}
      >
        {isAnalyzing ? 'Analyzing...' : 'Analyze Page'}
      </button>
      <div>
        {issues.map(issue => (
          <div 
            key={issue.id}
            className={`text-${getIssueColor(issue.severity)}-600`}
          >
            {issue.message}
          </div>
        ))}
      </div>
    </div>
  );
}
*/
