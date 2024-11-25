import { ReactNode } from 'react';

export interface AlertProps {
  variant?: 'default' | 'destructive' | 'warning';
  title?: string;
  description?: string;
  children?: ReactNode;
}

export interface ContactFormProps {
  onSubmit: (data: any) => void;
  className?: string;
}

export interface QuoteFormProps {
  onSubmit: (data: any) => void;
  className?: string;
}

export interface EmergencyFormProps {
  onSubmit: (data: any) => void;
  priority?: 'high' | 'medium' | 'low';
  className?: string;
}

export interface MainNavProps {
  items: {
    title: string;
    href: string;
  }[];
}

export interface MobileNavProps extends MainNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface FooterNavProps {
  links: {
    title: string;
    items: {
      title: string;
      href: string;
    }[];
  }[];
}

export interface CoreUIComponents {
  alerts: {
    emergency: AlertProps;
    warning: AlertProps;
    success: AlertProps;
  };
  forms: {
    contact: ContactFormProps;
    quote: QuoteFormProps;
    emergency: EmergencyFormProps;
  };
  navigation: {
    main: MainNavProps;
    mobile: MobileNavProps;
    footer: FooterNavProps;
  };
}
