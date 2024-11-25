import React from 'react';
import { AlertCircle, PhoneCall } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { cn } from '@/lib/utils';

interface EmergencyAlertProps {
  title?: string;
  description?: string;
  phoneNumber?: string;
  className?: string;
  children?: React.ReactNode;
  showIcon?: boolean;
}

export const EmergencyAlert: React.FC<EmergencyAlertProps> = ({
  title = "Emergency Response Required",
  description,
  phoneNumber = "1300 309 361",
  className,
  children,
  showIcon = true,
}) => {
  return (
    <Alert variant="emergency" className={cn("flex items-start gap-4", className)}>
      {showIcon && (
        <AlertCircle className="h-5 w-5 mt-1" />
      )}
      <div className="flex-1">
        <AlertTitle className="flex items-center gap-2">
          {title}
          {phoneNumber && (
            <a 
              href={`tel:${phoneNumber.replace(/\s/g, '')}`}
              className="inline-flex items-center gap-1 text-red-600 hover:text-red-700"
            >
              <PhoneCall className="h-4 w-4" />
              <span>{phoneNumber}</span>
            </a>
          )}
        </AlertTitle>
        {description && (
          <AlertDescription>{description}</AlertDescription>
        )}
        {children}
      </div>
    </Alert>
  );
};

export default EmergencyAlert;
