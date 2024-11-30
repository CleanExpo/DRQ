import { useState, useEffect, useCallback } from 'react';
import { formService } from '@/services/FormService';
import { logger } from '@/utils/logger';

interface FormField {
  id: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'file';
  name: string;
  label: string;
  placeholder?: string;
  defaultValue?: string;
  options?: { label: string; value: string }[];
  validation?: {
    required?: boolean;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    customValidation?: (value: any) => boolean | string;
  };
  metadata?: {
    description?: string;
    hint?: string;
    errorMessages?: Record<string, string>;
  };
}

interface FormConfig {
  id: string;
  name: string;
  fields: FormField[];
  submitEndpoint: string;
  successMessage: string;
  errorMessage: string;
  metadata: {
    description?: string;
    createdAt: string;
    updatedAt: string;
    version: number;
    status: 'active' | 'inactive' | 'archived';
  };
}

interface FormSubmission {
  id: string;
  formId: string;
  data: Record<string, any>;
  metadata: {
    submittedAt: string;
    ip?: string;
    userAgent?: string;
    status: 'pending' | 'processed' | 'failed';
    processedAt?: string;
    error?: string;
  };
}

interface FormMetrics {
  totalForms: number;
  activeForms: number;
  totalSubmissions: number;
  submissionsByForm: Record<string, number>;
  successRate: number;
  lastUpdate: number;
}

interface UseFormOptions {
  formId: string;
  onSubmit?: (data: Record<string, any>) => void;
  onSuccess?: (submission: FormSubmission) => void;
  onError?: (error: Error) => void;
  onValidationError?: (errors: Record<string, string>) => void;
}

export function useForm(options: UseFormOptions) {
  const {
    formId,
    onSubmit,
    onSuccess,
    onError,
    onValidationError
  } = options;

  const [form, setForm] = useState<FormConfig | null>(null);
  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [metrics, setMetrics] = useState<FormMetrics>(formService.getMetrics());

  useEffect(() => {
    loadForm();
    loadSubmissions();

    const unsubscribe = formService.onFormEvent((type, data) => {
      if (type.startsWith('form:') && data.id === formId) {
        loadForm();
      }
      if (type.startsWith('submission:') && data.formId === formId) {
        loadSubmissions();
      }
      setMetrics(formService.getMetrics());
    });

    return unsubscribe;
  }, [formId]);

  const loadForm = useCallback(async () => {
    try {
      const formData = await formService.getForm(formId);
      if (formData) {
        setForm(formData);
        // Initialize form values with default values
        const initialValues = formData.fields.reduce((acc, field) => {
          if (field.defaultValue !== undefined) {
            acc[field.name] = field.defaultValue;
          }
          return acc;
        }, {} as Record<string, any>);
        setValues(initialValues);
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to load form');
      onError?.(err);
      logger.error('Failed to load form', { formId, error });
    }
  }, [formId, onError]);

  const loadSubmissions = useCallback(async () => {
    try {
      const formSubmissions = await formService.getSubmissions(formId);
      setSubmissions(formSubmissions);
    } catch (error) {
      logger.error('Failed to load submissions', { formId, error });
    }
  }, [formId]);

  const handleChange = useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    // Clear error when field is modified
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, []);

  const validateField = useCallback((field: FormField, value: any): string | null => {
    const validation = field.validation;
    if (!validation) return null;

    if (validation.required && !value) {
      return field.metadata?.errorMessages?.required || 'This field is required';
    }

    if (validation.pattern && value && !new RegExp(validation.pattern).test(value)) {
      return field.metadata?.errorMessages?.pattern || 'Invalid format';
    }

    if (validation.minLength && value?.length < validation.minLength) {
      return field.metadata?.errorMessages?.minLength || 
        `Minimum length is ${validation.minLength}`;
    }

    if (validation.maxLength && value?.length > validation.maxLength) {
      return field.metadata?.errorMessages?.maxLength || 
        `Maximum length is ${validation.maxLength}`;
    }

    if (validation.customValidation) {
      const result = validation.customValidation(value);
      if (result !== true) {
        return typeof result === 'string' ? result : 'Invalid value';
      }
    }

    return null;
  }, []);

  const validateForm = useCallback((): boolean => {
    if (!form) return false;

    const newErrors: Record<string, string> = {};
    let isValid = true;

    form.fields.forEach(field => {
      const value = values[field.name];
      const error = validateField(field, value);
      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    if (!isValid) {
      onValidationError?.(newErrors);
    }
    return isValid;
  }, [form, values, validateField, onValidationError]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!form) return;

    try {
      if (!validateForm()) return;

      setIsSubmitting(true);
      onSubmit?.(values);

      const submission = await formService.submitForm(formId, values);
      
      if (submission.metadata.status === 'processed') {
        onSuccess?.(submission);
        setValues({});
        setErrors({});
      } else if (submission.metadata.status === 'failed') {
        throw new Error(submission.metadata.error || 'Submission failed');
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Form submission failed');
      onError?.(err);
      logger.error('Form submission failed', { formId, error });
    } finally {
      setIsSubmitting(false);
    }
  }, [form, formId, values, validateForm, onSubmit, onSuccess, onError]);

  const reset = useCallback(() => {
    setValues({});
    setErrors({});
  }, []);

  const getFieldProps = useCallback((name: string) => ({
    value: values[name] || '',
    onChange: (e: any) => handleChange(name, e.target.value),
    error: errors[name],
    'aria-invalid': !!errors[name],
    'aria-describedby': errors[name] ? `${name}-error` : undefined
  }), [values, errors, handleChange]);

  return {
    form,
    values,
    errors,
    isSubmitting,
    submissions,
    metrics,
    handleChange,
    handleSubmit,
    reset,
    getFieldProps
  };
}

// Example usage:
/*
function MyForm() {
  const {
    form,
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    getFieldProps
  } = useForm({
    formId: 'contact-form',
    onSuccess: (submission) => {
      console.log('Form submitted:', submission);
    },
    onError: (error) => {
      console.error('Form error:', error);
    }
  });

  if (!form) return <div>Loading form...</div>;

  return (
    <form onSubmit={handleSubmit}>
      {form.fields.map(field => (
        <div key={field.id}>
          <label htmlFor={field.name}>{field.label}</label>
          <input
            id={field.name}
            type={field.type}
            {...getFieldProps(field.name)}
          />
          {errors[field.name] && (
            <span className="error">{errors[field.name]}</span>
          )}
        </div>
      ))}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
*/
