import { NextRequest, NextResponse } from 'next/server';
import { logger } from '../utils/logger';

interface ValidationRule {
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'object' | 'array';
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  enum?: any[];
  custom?: (value: any) => boolean | Promise<boolean>;
}

interface ValidationSchema {
  [key: string]: ValidationRule;
}

export class ValidationError extends Error {
  constructor(public errors: { [key: string]: string }) {
    super('Validation failed');
    this.name = 'ValidationError';
  }
}

async function validateValue(
  value: any,
  rule: ValidationRule,
  fieldName: string
): Promise<string | null> {
  // Required check
  if (rule.required && (value === undefined || value === null || value === '')) {
    return `${fieldName} is required`;
  }

  // Skip further validation if value is not provided and not required
  if (value === undefined || value === null) {
    return null;
  }

  // Type check
  if (rule.type) {
    const actualType = Array.isArray(value) ? 'array' : typeof value;
    if (actualType !== rule.type) {
      return `${fieldName} must be of type ${rule.type}`;
    }
  }

  // String-specific validations
  if (typeof value === 'string') {
    if (rule.minLength && value.length < rule.minLength) {
      return `${fieldName} must be at least ${rule.minLength} characters long`;
    }
    if (rule.maxLength && value.length > rule.maxLength) {
      return `${fieldName} must not exceed ${rule.maxLength} characters`;
    }
    if (rule.pattern && !rule.pattern.test(value)) {
      return `${fieldName} has an invalid format`;
    }
  }

  // Enum validation
  if (rule.enum && !rule.enum.includes(value)) {
    return `${fieldName} must be one of: ${rule.enum.join(', ')}`;
  }

  // Custom validation
  if (rule.custom) {
    try {
      const isValid = await rule.custom(value);
      if (!isValid) {
        return `${fieldName} failed custom validation`;
      }
    } catch (error) {
      logger.error(`Custom validation error for ${fieldName}:`, error);
      return `${fieldName} validation failed`;
    }
  }

  return null;
}

export function createRequestValidator(schema: ValidationSchema) {
  return async function validateRequest(request: NextRequest) {
    try {
      // Skip validation for GET and OPTIONS requests
      if (['GET', 'OPTIONS'].includes(request.method)) {
        return NextResponse.next();
      }

      // Parse request body
      const body = await request.json();
      const errors: { [key: string]: string } = {};

      // Validate each field
      for (const [fieldName, rule] of Object.entries(schema)) {
        const error = await validateValue(body[fieldName], rule, fieldName);
        if (error) {
          errors[fieldName] = error;
        }
      }

      // Check for validation errors
      if (Object.keys(errors).length > 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'Validation Error',
            details: errors
          },
          { status: 400 }
        );
      }

      return NextResponse.next();
    } catch (error) {
      logger.error('Request validation error:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid Request',
          message: 'Failed to parse request body'
        },
        { status: 400 }
      );
    }
  };
}

// Common validation schemas
export const commonSchemas = {
  id: {
    required: true,
    type: 'string',
    pattern: /^[0-9a-fA-F]{24}$/ // MongoDB ObjectId pattern
  },
  name: {
    required: true,
    type: 'string',
    minLength: 1,
    maxLength: 100
  },
  email: {
    required: true,
    type: 'string',
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  date: {
    type: 'string',
    pattern: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/
  },
  status: {
    type: 'string',
    enum: ['active', 'inactive', 'archived']
  }
};
