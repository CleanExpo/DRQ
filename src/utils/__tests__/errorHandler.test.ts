import { 
  reportError, 
  getErrorSeverity, 
  getRecentErrors, 
  clearErrors,
  formatErrorMessage,
  isCriticalError,
  getUserFriendlyMessage,
  handleError
} from '../errorHandler';

describe('Error Handler', () => {
  beforeEach(() => {
    clearErrors();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('reportError', () => {
    it('should store error in recent errors', () => {
      const error = new Error('Test error');
      reportError(error);
      const recentErrors = getRecentErrors();
      expect(recentErrors).toHaveLength(1);
      expect(recentErrors[0]).toBe(error);
    });

    it('should handle multiple errors', () => {
      const error1 = new Error('Test error 1');
      const error2 = new Error('Test error 2');
      
      reportError(error1);
      reportError(error2);
      
      const recentErrors = getRecentErrors();
      expect(recentErrors).toHaveLength(2);
      expect(recentErrors).toContain(error1);
      expect(recentErrors).toContain(error2);
    });

    it('should include timestamp with error', () => {
      const error = new Error('Test error');
      const now = new Date();
      jest.setSystemTime(now);
      
      reportError(error);
      
      const recentErrors = getRecentErrors();
      expect(recentErrors[0]).toBe(error);
      expect((error as any).timestamp).toBe(now.getTime());
    });
  });

  describe('getErrorSeverity', () => {
    it('should mark security errors as critical severity', () => {
      const error = new Error('Authentication failed');
      error.name = 'SecurityError';
      
      expect(getErrorSeverity(error)).toBe('critical');
    });

    it('should mark network errors as high severity', () => {
      const error = new Error('Network request failed');
      error.name = 'NetworkError';
      
      expect(getErrorSeverity(error)).toBe('high');
    });

    it('should mark validation errors as medium severity', () => {
      const error = new Error('Invalid input');
      error.name = 'ValidationError';
      
      expect(getErrorSeverity(error)).toBe('medium');
    });

    it('should default to low severity', () => {
      const error = new Error('Unknown error');
      expect(getErrorSeverity(error)).toBe('low');
    });
  });

  describe('getRecentErrors', () => {
    it('should only return errors within specified time window', () => {
      const oldError = new Error('Old error');
      const newError = new Error('New error');
      
      // Set time to 1 hour ago
      jest.setSystemTime(Date.now() - 3600000);
      reportError(oldError);
      
      // Set time to now
      jest.setSystemTime(Date.now());
      reportError(newError);
      
      const recentErrors = getRecentErrors(1800000); // 30 minutes window
      expect(recentErrors).toHaveLength(1);
      expect(recentErrors[0]).toBe(newError);
    });

    it('should return all errors when no time window specified', () => {
      const error1 = new Error('Error 1');
      const error2 = new Error('Error 2');
      
      reportError(error1);
      reportError(error2);
      
      expect(getRecentErrors()).toHaveLength(2);
    });
  });

  describe('formatErrorMessage', () => {
    it('should format error message with timestamp', () => {
      const error = new Error('Test error');
      const now = new Date();
      jest.setSystemTime(now);
      
      reportError(error);
      
      const formattedMessage = formatErrorMessage(error);
      expect(formattedMessage).toContain('Test error');
      expect(formattedMessage).toContain(now.toLocaleString());
    });

    it('should handle errors without timestamp', () => {
      const error = new Error('Test error');
      const message = formatErrorMessage(error);
      expect(message).toContain('Unknown time');
      expect(message).toContain('Test error');
    });
  });

  describe('isCriticalError', () => {
    it('should identify critical errors', () => {
      const error = new Error('Security breach');
      error.name = 'SecurityError';
      reportError(error);
      
      expect(isCriticalError(error)).toBe(true);
    });

    it('should identify non-critical errors', () => {
      const error = new Error('Minor issue');
      reportError(error);
      
      expect(isCriticalError(error)).toBe(false);
    });
  });

  describe('getUserFriendlyMessage', () => {
    it('should return security error message', () => {
      const error = new Error('Access denied');
      error.name = 'SecurityError';
      
      expect(getUserFriendlyMessage(error)).toBe(
        'There was a security issue. Please try again or contact support.'
      );
    });

    it('should return network error message', () => {
      const error = new Error('Connection failed');
      error.name = 'NetworkError';
      
      expect(getUserFriendlyMessage(error)).toBe(
        'There was a problem connecting to the server. Please check your internet connection.'
      );
    });

    it('should return validation error message', () => {
      const error = new Error('Invalid input');
      error.name = 'ValidationError';
      
      expect(getUserFriendlyMessage(error)).toBe(
        'Please check your input and try again.'
      );
    });

    it('should return default message for unknown errors', () => {
      const error = new Error('Unknown error');
      
      expect(getUserFriendlyMessage(error)).toBe(
        'An unexpected error occurred. Please try again.'
      );
    });
  });

  describe('handleError', () => {
    it('should report error and return user-friendly message', () => {
      const error = new Error('Test error');
      const message = handleError(error);
      
      const recentErrors = getRecentErrors();
      expect(recentErrors).toHaveLength(1);
      expect(recentErrors[0]).toBe(error);
      expect(message).toBe('An unexpected error occurred. Please try again.');
    });

    it('should handle critical errors appropriately', () => {
      const error = new Error('Security breach');
      error.name = 'SecurityError';
      
      const message = handleError(error);
      expect(message).toBe('There was a security issue. Please try again or contact support.');
      expect(isCriticalError(error)).toBe(true);
    });
  });

  describe('clearErrors', () => {
    it('should remove all stored errors', () => {
      reportError(new Error('Test error 1'));
      reportError(new Error('Test error 2'));
      expect(getRecentErrors()).toHaveLength(2);
      
      clearErrors();
      expect(getRecentErrors()).toHaveLength(0);
    });
  });
});
