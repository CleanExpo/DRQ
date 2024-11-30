import React from 'react';
import { cn } from '../../lib/utils';

interface Step {
  step: string;
  title: string;
  description: string;
}

interface ProcessStepsProps {
  title: string;
  steps: Step[];
  className?: string;
}

export const ProcessSteps: React.FC<ProcessStepsProps> = ({ 
  title, 
  steps, 
  className = "px-4 py-16" 
}) => {
  return (
    <section className={cn(className, "bg-gray-100")}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="text-center"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="w-12 h-12 bg-blue-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                {step.step}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Add display name for better debugging
ProcessSteps.displayName = 'ProcessSteps';
