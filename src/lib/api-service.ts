import { ContactFormData } from "@/types/forms"

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  errors?: Array<{
    code: string;
    message: string;
    path: string[];
  }>;
}

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errors?: any[];

  constructor(message: string, statusCode: number = 500, errors?: any[]) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export class ApiService {
  private static async fetchWithTimeout(
    resource: string,
    options: RequestInit & { timeout?: number } = {}
  ): Promise<Response> {
    const { timeout = 8000 } = options;
    
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(resource, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError('Request timeout - please try again', 408);
        }
        throw new ApiError(error.message);
      }
      throw error;
    }
  }

  static async submitContactForm(formData: ContactFormData): Promise<ApiResponse> {
    try {
      const response = await this.fetchWithTimeout('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        timeout: 10000 // 10 seconds timeout
      });

      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(
          data.message || 'Failed to submit form',
          response.status,
          data.errors
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new ApiError(error.message);
      }
      throw new ApiError('An unexpected error occurred');
    }
  }

  static async submitAnalytics(eventName: string, data: any): Promise<void> {
    try {
      const response = await this.fetchWithTimeout('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: eventName,
          data
        }),
        timeout: 5000 // 5 seconds timeout for analytics
      });

      if (!response.ok) {
        console.error('Analytics submission failed:', await response.json());
      }
    } catch (error) {
      // Log but don't throw for analytics errors
      console.error('Analytics error:', error);
    }
  }
}
