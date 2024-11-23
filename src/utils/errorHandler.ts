type ErrorSeverity = 'critical' | 'high' | 'medium' | 'low';

interface TrackedError extends Error {
  timestamp: number;
  severity: ErrorSeverity;
}

let recentErrors: TrackedError[] = [];

/**
 * Reports an error to the error tracking system
 * @param error The error to report
 */
export const reportError = (error: Error): void => {
  const trackedError = error as TrackedError;
  trackedError.timestamp = Date.now();
  trackedError.severity = getErrorSeverity(error);
  
  recentErrors.push(trackedError);

  // In a real implementation, we might send this to an error tracking service
  if (process.env.NODE_ENV === 'development') {
    console.error('Error reported:', error);
  }
};

/**
 * Determines the severity of an error based on its type and content
 * @param error The error to evaluate
 * @returns The error severity level
 */
export const getErrorSeverity = (error: Error): ErrorSeverity => {
  if (error.name === 'SecurityError' || error.message.toLowerCase().includes('security')) {
    return 'critical';
  }
  
  if (error.name === 'NetworkError' || error.message.toLowerCase().includes('network')) {
    return 'high';
  }
  
  if (error.name === 'ValidationError' || error.message.toLowerCase().includes('validation')) {
    return 'medium';
  }
  
  return 'low';
};

/**
 * Retrieves recent errors within a specified time window
 * @param timeWindow Optional time window in milliseconds
 * @returns Array of recent errors
 */
export const getRecentErrors = (timeWindow?: number): TrackedError[] => {
  if (!timeWindow) {
    return recentErrors;
  }

  const cutoffTime = Date.now() - timeWindow;
  return recentErrors.filter(error => error.timestamp >= cutoffTime);
};

/**
 * Clears all stored errors
 */
export const clearErrors = (): void => {
  recentErrors = [];
};

/**
 * Formats an error message for display
 * @param error The error to format
 * @returns Formatted error message
 */
export const formatErrorMessage = (error: Error): string => {
  const trackedError = error as TrackedError;
  const timestamp = trackedError.timestamp 
    ? new Date(trackedError.timestamp).toLocaleString()
    : 'Unknown time';
  
  return `[${timestamp}] ${error.name}: ${error.message}`;
};

/**
 * Checks if an error is critical and requires immediate attention
 * @param error The error to check
 * @returns True if the error is critical
 */
export const isCriticalError = (error: Error): boolean => {
  const trackedError = error as TrackedError;
  return trackedError.severity === 'critical';
};

/**
 * Gets a user-friendly error message
 * @param error The error to get a message for
 * @returns User-friendly error message
 */
export const getUserFriendlyMessage = (error: Error): string => {
  // Add specific error message mappings here
  const messageMap: Record<string, string> = {
    SecurityError: "There was a security issue. Please try again or contact support.",
    NetworkError: "There was a problem connecting to the server. Please check your internet connection.",
    ValidationError: "Please check your input and try again.",
    TypeError: "There was a technical issue. Please try again.",
    ReferenceError: "There was a technical issue. Please try again."
  };

  return messageMap[error.name] || "An unexpected error occurred. Please try again.";
};

/**
 * Handles an error by reporting it and returning a user-friendly message
 * @param error The error to handle
 * @returns User-friendly error message
 */
export const handleError = (error: Error): string => {
  reportError(error);
  return getUserFriendlyMessage(error);
};
