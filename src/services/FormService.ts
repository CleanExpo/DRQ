import { logger } from '@/utils/logger';
import { cacheService } from './CacheService';

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

class FormService {
  private static instance: FormService;
  private forms: Map<string, FormConfig> = new Map();
  private submissions: Map<string, FormSubmission[]> = new Map();
  private metrics: FormMetrics;
  private observers: ((type: string, data: any) => void)[] = [];

  private constructor() {
    this.metrics = this.initializeMetrics();
  }

  public static getInstance(): FormService {
    if (!FormService.instance) {
      FormService.instance = new FormService();
    }
    return FormService.instance;
  }

  private initializeMetrics(): FormMetrics {
    return {
      totalForms: 0,
      activeForms: 0,
      totalSubmissions: 0,
      submissionsByForm: {},
      successRate: 100,
      lastUpdate: Date.now()
    };
  }

  public async getForm(id: string): Promise<FormConfig | null> {
    try {
      const cacheKey = `form:${id}`;
      const cached = await cacheService.get<FormConfig>(cacheKey);

      if (cached) {
        logger.debug('Form loaded from cache', { id });
        return cached;
      }

      const form = this.forms.get(id);
      if (form) {
        await cacheService.set(cacheKey, form, {
          ttl: 3600000, // 1 hour
          type: 'form'
        });
      }

      return form || null;
    } catch (error) {
      logger.error('Failed to get form', { id, error });
      return null;
    }
  }

  public async createForm(form: Omit<FormConfig, 'id'>): Promise<FormConfig> {
    try {
      const id = this.generateId();
      const newForm: FormConfig = {
        ...form,
        id,
        metadata: {
          ...form.metadata,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: 1
        }
      };

      this.forms.set(id, newForm);
      this.updateMetrics();
      this.notifyObservers('form:created', newForm);

      logger.debug('Form created', { id });
      return newForm;
    } catch (error) {
      logger.error('Failed to create form', { error });
      throw error;
    }
  }

  public async updateForm(id: string, updates: Partial<FormConfig>): Promise<FormConfig> {
    try {
      const form = this.forms.get(id);
      if (!form) {
        throw new Error(`Form not found: ${id}`);
      }

      const updatedForm: FormConfig = {
        ...form,
        ...updates,
        metadata: {
          ...form.metadata,
          ...updates.metadata,
          updatedAt: new Date().toISOString(),
          version: form.metadata.version + 1
        }
      };

      this.forms.set(id, updatedForm);
      this.updateMetrics();
      this.notifyObservers('form:updated', updatedForm);

      // Invalidate cache
      await cacheService.invalidate(`form:${id}`);

      logger.debug('Form updated', { id });
      return updatedForm;
    } catch (error) {
      logger.error('Failed to update form', { id, error });
      throw error;
    }
  }

  public async submitForm(formId: string, data: Record<string, any>): Promise<FormSubmission> {
    try {
      const form = await this.getForm(formId);
      if (!form) {
        throw new Error(`Form not found: ${formId}`);
      }

      // Validate submission
      this.validateSubmission(form, data);

      const submission: FormSubmission = {
        id: this.generateId(),
        formId,
        data,
        metadata: {
          submittedAt: new Date().toISOString(),
          status: 'pending'
        }
      };

      // Store submission
      const formSubmissions = this.submissions.get(formId) || [];
      formSubmissions.push(submission);
      this.submissions.set(formId, formSubmissions);

      // Process submission
      await this.processSubmission(submission);

      this.updateMetrics();
      this.notifyObservers('form:submitted', submission);

      logger.debug('Form submitted', { formId, submissionId: submission.id });
      return submission;
    } catch (error) {
      logger.error('Form submission failed', { formId, error });
      throw error;
    }
  }

  private validateSubmission(form: FormConfig, data: Record<string, any>): void {
    const errors: Record<string, string> = {};

    form.fields.forEach(field => {
      const value = data[field.name];
      const validation = field.validation;

      if (!validation) return;

      if (validation.required && !value) {
        errors[field.name] = field.metadata?.errorMessages?.required || 'This field is required';
      }

      if (validation.pattern && value && !new RegExp(validation.pattern).test(value)) {
        errors[field.name] = field.metadata?.errorMessages?.pattern || 'Invalid format';
      }

      if (validation.minLength && value?.length < validation.minLength) {
        errors[field.name] = field.metadata?.errorMessages?.minLength || 
          `Minimum length is ${validation.minLength}`;
      }

      if (validation.maxLength && value?.length > validation.maxLength) {
        errors[field.name] = field.metadata?.errorMessages?.maxLength || 
          `Maximum length is ${validation.maxLength}`;
      }

      if (validation.customValidation) {
        const result = validation.customValidation(value);
        if (result !== true) {
          errors[field.name] = typeof result === 'string' ? result : 'Invalid value';
        }
      }
    });

    if (Object.keys(errors).length > 0) {
      throw new Error(JSON.stringify(errors));
    }
  }

  private async processSubmission(submission: FormSubmission): Promise<void> {
    try {
      const form = await this.getForm(submission.formId);
      if (!form) throw new Error('Form not found');

      // Send to endpoint
      const response = await fetch(form.submitEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
      });

      if (!response.ok) throw new Error('Submission processing failed');

      // Update submission status
      submission.metadata.status = 'processed';
      submission.metadata.processedAt = new Date().toISOString();

      this.updateMetrics();
      this.notifyObservers('submission:processed', submission);
    } catch (error) {
      submission.metadata.status = 'failed';
      submission.metadata.error = error instanceof Error ? error.message : 'Unknown error';
      this.notifyObservers('submission:failed', submission);
      throw error;
    }
  }

  public async getSubmissions(formId: string): Promise<FormSubmission[]> {
    return this.submissions.get(formId) || [];
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  public onFormEvent(callback: (type: string, data: any) => void): () => void {
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
        logger.error('Form event callback failed', { error });
      }
    });
  }

  private updateMetrics(): void {
    const forms = Array.from(this.forms.values());
    const allSubmissions = Array.from(this.submissions.values()).flat();

    this.metrics = {
      totalForms: forms.length,
      activeForms: forms.filter(f => f.metadata.status === 'active').length,
      totalSubmissions: allSubmissions.length,
      submissionsByForm: Array.from(this.submissions.entries()).reduce(
        (acc, [formId, submissions]) => {
          acc[formId] = submissions.length;
          return acc;
        },
        {} as Record<string, number>
      ),
      successRate: allSubmissions.length > 0
        ? (allSubmissions.filter(s => s.metadata.status === 'processed').length / 
           allSubmissions.length) * 100
        : 100,
      lastUpdate: Date.now()
    };
  }

  public getMetrics(): FormMetrics {
    return { ...this.metrics };
  }

  public async generateReport(): Promise<string> {
    const report = {
      metrics: this.metrics,
      forms: Array.from(this.forms.values()).map(form => ({
        id: form.id,
        name: form.name,
        fields: form.fields.length,
        status: form.metadata.status,
        submissions: this.submissions.get(form.id)?.length || 0
      })),
      submissions: Array.from(this.submissions.entries()).reduce(
        (acc, [formId, submissions]) => {
          acc[formId] = submissions.map(s => ({
            id: s.id,
            status: s.metadata.status,
            submittedAt: s.metadata.submittedAt,
            processedAt: s.metadata.processedAt
          }));
          return acc;
        },
        {} as Record<string, any[]>
      ),
      timestamp: new Date().toISOString()
    };

    return JSON.stringify(report, null, 2);
  }
}

export const formService = FormService.getInstance();
export default FormService;
