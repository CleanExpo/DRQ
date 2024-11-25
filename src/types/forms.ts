// Form Data Types
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  urgency: "high" | "medium" | "low";
  serviceType?: "water" | "fire" | "mould";
}

// Contact Form Error Type
export interface ContactFormErrorData extends Partial<ContactFormData> {
  statusCode?: number;
  error?: string;
}

// Analytics Types
export interface FormAnalytics {
  formType: string;
  urgency: "high" | "medium" | "low";
  serviceType?: "water" | "fire" | "mould";
}

export interface FormErrorAnalytics {
  error: string;
  statusCode?: number;
  formData?: Partial<ContactFormData>;
}

export interface PageViewAnalytics {
  path: string;
  referrer?: string;
}

export interface BaseAnalyticsEvent {
  timestamp: string;
  path: string;
  userAgent: string;
}

export type AnalyticsEvent = BaseAnalyticsEvent & {
  event: string;
  data: FormAnalytics | FormErrorAnalytics | PageViewAnalytics;
}
